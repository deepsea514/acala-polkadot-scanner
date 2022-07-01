import { FC } from 'react';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import { Typography, Box } from '@mui/material';

type LinearProgressWithLabelProps = LinearProgressProps & { value: number };
const LinearProgressWithLabel: FC<LinearProgressWithLabelProps> = (props) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
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