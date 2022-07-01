import { FC, Fragment, memo, useState } from 'react';
import {
    Container, Collapse, IconButton, Box, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel
} from '@mui/material';
import {
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';

export type PolkadotEvent = {
    block: number,
    name: string,
    id: number,
    type: "ApplyExtrinsic" | "Finalization" | "Initialization",
    params: any[]
}

const renderObjectTable = (object: any) => {
    const keys = Object.keys(object);
    return keys.map((key, index) => {
        const value = object[key];
        if (typeof value === 'object') {
            return (
                <TableRow key={'' + key + index}>
                    <TableCell>{key}</TableCell>
                    <TableCell sx={{ borderLeft: '1px solid #DDD', p: 0 }}>
                        <Table size="small" sx={{ p: 0 }}>
                            <TableBody>
                                {renderObjectTable(object[key])}
                            </TableBody>
                        </Table>
                    </TableCell>
                </TableRow>
            );
        }
        return (
            <TableRow key={'' + key + index}>
                <TableCell>{key}</TableCell>
                <TableCell sx={{ borderLeft: '1px solid #DDD' }}>
                    <div style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'normal',
                        wordBreak: 'break-all'
                    }}>
                        {object[key]}
                    </div>
                </TableCell>
            </TableRow>
        )
    })
}

const descendingComparator = <T,>(a: T, b: T, orderBy: keyof T) => {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof PolkadotEvent>(order: Order, orderBy: Key): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
    let orderBy_ = orderBy === 'id' ? 'block' as Key : orderBy;
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy_)
        : (a, b) => -descendingComparator(a, b, orderBy_);
}

const stableSort = (array: readonly PolkadotEvent[], order: Order, orderBy: keyof PolkadotEvent) => {
    const comparator = getComparator(order, orderBy);
    const stabilizedThis = array.map((el, index) => [el, index] as [PolkadotEvent, number]);
    stabilizedThis.sort((a, b) => {
        const order_ = comparator(a[0], b[0]);
        if (order_ !== 0) {
            return order_;
        }
        if (orderBy === 'id') {
            return order === 'asc' ? a[1] - b[1] : b[1] - a[1];
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof PolkadotEvent) => void;
    order: Order;
    orderBy: string;
}

interface HeadCell {
    id: keyof PolkadotEvent;
    label: string;
    sortable: boolean,
}
const headCells: readonly HeadCell[] = [
    {
        id: 'id',
        label: 'Event Id',
        sortable: true,
    },
    {
        id: 'block',
        label: 'Block Number',
        sortable: true,
    },
    {
        id: 'name',
        label: 'Name',
        sortable: true,
    },
    {
        id: 'type',
        label: 'Type',
        sortable: true,
    },
    {
        id: 'params',
        label: 'Params',
        sortable: false,
    },
];

const EnhancedTableHead: FC<EnhancedTableProps> = (props) => {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property: keyof PolkadotEvent) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.sortable && <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>}
                        {!headCell.sortable && headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

type EventTableRowProps = {
    event: PolkadotEvent
}
const EventTableRow: FC<EventTableRowProps> = ({ event }) => {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <Fragment>
            <TableRow tabIndex={-1} key={event.id}>
                <TableCell>
                    {event.block} - {event.id}
                </TableCell>
                <TableCell>
                    {event.block}
                </TableCell>
                <TableCell>
                    {event.name}
                </TableCell>
                <TableCell>
                    {event.type}
                </TableCell>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0, background: '#DDD' }} colSpan={5}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ padding: 1 }}>
                            <Typography variant="subtitle2" gutterBottom component="div">
                                Params
                            </Typography>
                            <Table size="small"
                                aria-label="purchases"
                                sx={{ background: '#FFF' }}>
                                <TableBody>
                                    {event.params.map((param) => renderObjectTable(param))}
                                </TableBody >
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    )
}

const MemoizedEventTableRow = memo(EventTableRow);

type EventTableProps = {
    events: PolkadotEvent[]
}
const EventTable: FC<EventTableProps> = ({ events }) => {
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(50);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof PolkadotEvent>('id');

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof PolkadotEvent,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Container component="div" maxWidth="xl" sx={{ minHeight: '100px' }}>
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <EnhancedTableHead
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                        {stableSort(events, order, orderBy).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((event) => <MemoizedEventTableRow event={event}
                                key={event.block + ':' + event.id} />)}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={events.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Container>
    );
}

export default EventTable;