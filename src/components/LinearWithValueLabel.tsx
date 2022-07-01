import { FC } from 'react';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import { Typography, Box } from '@mui/material';

type LinearProgressWithLabelProps = LinearProgressProps & { value: number };
const LinearProgressWithLabel: FC<LinearProgressWithLabelProps> = (props) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <Box sx={{ width: '100%', mr: 2 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 50 }}>
                <Typography variant="h6" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}
                </Typography>
            </Box>
        </Box>
    );
}

type LinearWithValueLabelProps = {
    progress: number
}

const LinearWithValueLabel: FC<LinearWithValueLabelProps> = ({ progress }) => {
    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={progress} />
        </Box>
    );
}

export default LinearWithValueLabel;