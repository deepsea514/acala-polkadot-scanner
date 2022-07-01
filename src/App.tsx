import { useCallback, useState, FC } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
    CssBaseline, Box, AppBar,
    Toolbar, Typography, Container, Grid, Paper
} from '@mui/material';
import { ApiPromise, WsProvider } from '@polkadot/api';
import '@polkadot/api-augment';
import BlockForm, { ScanParams } from './components/BlockForm';
import LinearWithValueLabel from './components/LinearWithValueLabel';
import EventTable, { PolkadotEvent } from './components/EventTable';

const mdTheme = createTheme();
const DashboardContent: FC = () => {
    const [scanning, setScanning] = useState<boolean>(false);
    const [events, setEvents] = useState<PolkadotEvent[]>([]);
    const [progress, setProgress] = useState<number>(0);

    const onScan = useCallback(async (params: ScanParams) => {
        setScanning(true);
        setProgress(0);
        setEvents([]);
        let totalEvents: PolkadotEvent[] = [];

        try {
            const wsProvider = new WsProvider(params.endpoint);
            const api = await ApiPromise.create({ provider: wsProvider });

            const lastBlock = await api.rpc.chain.getBlock();
            let lastBlockNumber = lastBlock.block.header.number.toNumber();
            lastBlockNumber = lastBlockNumber < params.endBlock ? lastBlockNumber : params.endBlock;

            const totalBlock = lastBlockNumber - params.startBlock + 1;

            for (let block = params.startBlock; block <= lastBlockNumber; block++) {
                const blockHash = await api.rpc.chain.getBlockHash(block);
                const signedBlock = await api.rpc.chain.getBlock(blockHash);
                const apiAt = await api.at(signedBlock.block.header.hash);
                const allRecords = await apiAt.query.system.events();

                const events = allRecords.map(({ event, phase }, index): PolkadotEvent => {
                    const data = JSON.parse(JSON.stringify(event.data.toJSON()));
                    const params: any[] = [{ 'Docs': event.data.meta.docs.toLocaleString() }];
                    event.data.meta.fields.toArray().map((field, index) => {
                        const field_ = JSON.parse(JSON.stringify(field.toJSON()));
                        if (field_.name == null && field_.typeName == null) {
                            params.push({ 'DispatchInfo: dispatch_info': data[index] })
                        } else {
                            let fieldName = '';
                            if (field_.typeName) {
                                fieldName += field_.typeName;
                                if (field_.name) fieldName += ': ' + field_.name;
                            } else fieldName += field_.name;
                            params.push({ [fieldName]: data[index] })
                        }
                        return null;
                    })
                    return {
                        block: block,
                        name: `${event.section}:${event.method}`,
                        id: index,
                        type: phase.type,
                        params: params
                    }
                });
                totalEvents = totalEvents.concat(events);
                setEvents(totalEvents);
                const progress = 100 * (block - params.startBlock + 1) / totalBlock;
                setProgress(progress);
            }
            setProgress(100);
        } catch (error) {
        } finally {
            setScanning(false);
        }
    }, []);

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute">
                    <Toolbar>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            Polkadot Event Scanner
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                        <Grid container spacing={3}>
                            {/* Chart */}
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                    <BlockForm scanning={scanning}
                                        onScan={onScan} />
                                </Paper>
                            </Grid>

                            {/* Events */}
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                    <LinearWithValueLabel progress={progress} />
                                    <EventTable events={events} />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

const App: FC = () => {
    return <DashboardContent />;
}

export default App;