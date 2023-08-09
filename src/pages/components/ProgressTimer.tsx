import { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function ProgressTimer(props) {
  const [remainingTime, setRemainingTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const totalMinutes = props.totalTime * 60;
  let timerInterval;

  useEffect(() => {
    console.log("useEffect");
    if(!props.timerDisabled){
    if (remainingTime >= totalMinutes) {
      console.log("onTimer");
      props.onTimerComplete();
      setProgress(100);
      return () => clearInterval(timerInterval);
    } else {
      timerInterval = setInterval(() => {
        setRemainingTime(prevTime => prevTime + 60);
        if(totalMinutes > 0){
          setProgress(remainingTime/totalMinutes * 100);
        }
      }, 60000);

      return () => clearInterval(timerInterval);
    }
  }
  else{
    setProgress(100);
    setRemainingTime(totalMinutes);
  }
  }, [remainingTime]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <Box sx={{ width: '75%', mr: 1, ml:1 }}>
        <LinearProgress variant="determinate" value={progress} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography className='progress-timer-text' variant="body2" color="text.secondary">{`${Math.round(
          remainingTime/60,
        )}`}/{`${Math.round(
          props.totalTime,
        )}`} min</Typography>
      </Box>
    </Box>
  );
}