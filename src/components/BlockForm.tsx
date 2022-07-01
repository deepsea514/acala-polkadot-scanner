import { FC, useState } from "react";
import { Button, TextField, Grid, Container } from '@mui/material';
import { LoadingButton } from '@mui/lab';

type BlockFormProps = {
    scanning: boolean,
    onScan: (params: SearchParams) => void
}

export type SearchParams = {
    startBlock: number,
    endBlock: number,
    endpoint: string,
}

export type SearchParamsError = {
    startBlock?: string,
    endBlock?: string,
    endpoint?: string,
}

const DEFAULT_ENDPOINT = 'wss://rpc.polkadot.io';

const BlockForm: FC<BlockFormProps> = ({ scanning, onScan }) => {
    const [startBlock, setStartBlock] = useState<string>('');
    const [endBlock, setEndBlock] = useState<string>('');
    const [endpoint, setEndpoint] = useState<string>(DEFAULT_ENDPOINT);
    const [error, setError] = useState<SearchParamsError>({});

    const onSubmit = (event: any) => {
        event?.preventDefault();

        const formError: SearchParamsError = {};
        if (startBlock === '') {
            formError.startBlock = "Please set the start block number.";
        }
        if (endBlock === '') {
            formError.endBlock = "Please set the end block number.";
        }
        if (endpoint === '') {
            formError.endpoint = "Please set the endpoint.";
        }
        const startBlockNumber = parseInt(startBlock);
        const endBlockNumber = parseInt(endBlock);
        if (startBlockNumber > endBlockNumber) {
            formError.endBlock = "Please set the valid end block number.";
        }

        setError(formError);
        if (Object.keys(formError).length > 0) return;

        onScan({
            startBlock: startBlockNumber,
            endBlock: endBlockNumber,
            endpoint: endpoint,
        });
    }

    const onChange = (event: any) => {
        switch (event.target.name) {
            case 'startBlock':
                setStartBlock(event.target.value);
                break;
            case 'endBlock':
                setEndBlock(event.target.value);
                break;
            case 'endpoint':
                setEndpoint(event.target.value);
                break;
        }
    }

    return (
        <Container component="div" maxWidth="xl">
            <form onSubmit={onSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            name="startBlock"
                            fullWidth
                            type="number"
                            id="startBlock"
                            label="Start Block"
                            size="small"
                            inputProps={{
                                min: 0,
                                step: 1
                            }}
                            autoFocus
                            value={startBlock}
                            onChange={onChange}
                            error={error.startBlock !== undefined}
                            helperText={error.startBlock}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            id="endBlock"
                            label="End Block"
                            name="endBlock"
                            type="number"
                            size="small"
                            inputProps={{
                                min: 0,
                                step: 1
                            }}
                            value={endBlock}
                            onChange={onChange}
                            error={error.endBlock !== undefined}
                            helperText={error.endBlock}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <TextField
                            fullWidth
                            id="endpoint"
                            label="Endpoint"
                            name="endpoint"
                            type="text"
                            size="small"
                            value={endpoint}
                            onChange={onChange}
                            error={error.endpoint !== undefined}
                            helperText={error.endpoint}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={2}>
                        {scanning ?
                            <LoadingButton
                                loading
                                // loadingPosition="start"
                                // startIcon={<SaveIcon />}
                                size="medium"
                                variant="contained"
                                fullWidth
                            >
                                Scanning
                            </LoadingButton>
                            :
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="medium"
                            >
                                Scan
                            </Button>
                        }
                    </Grid>
                </Grid>
            </form>
        </Container>
    )
};

export default BlockForm;