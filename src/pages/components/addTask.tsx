import * as React from 'react';
import { ChangeEvent, useState } from "react";
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import TimerIcon from '@mui/icons-material/Timer';
import Box from '@mui/material/Box';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function AddTask(props) {
  const [newTask, setNewTask] = useState("");
  const [open, setOpen] = React.useState(false);
  const [minutes, setMinutes] = React.useState(0);

  function addNewTask() {
    props.onAddNewTask(newTask)
    let input: HTMLInputElement = document.querySelector<HTMLInputElement>("#task-input");
    input.value = "";
  }

  function addNewTimedTask() {
    if (minutes > 0) {
      props.onAddNewTimedTask(newTask, minutes)
      let input: HTMLInputElement = document.querySelector<HTMLInputElement>("#task-input");
      input.value = "";
      setOpen(false);
    }
  }

  function updateTimedTaskValue(event: ChangeEvent<HTMLInputElement>) {
    const newMinutes = parseInt(event.target.value);
    if (newMinutes > 0) {
      setMinutes(parseInt(event.target.value))
      
    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ '& > :not(style)': { m: 1 } }}>
      <Stack direction="row" spacing={2}>
        <div>
          <input
            id="task-input"
            onChange={(e) => setNewTask(e.currentTarget.value)}
            placeholder="Enter a new task..."
          />
          <Fab sx={{ ml: 1 }} size="medium" color="primary" aria-label="add" onClick={() => addNewTask()}>
            <AddIcon />
          </Fab>
          <Fab sx={{ ml: 1 }} size="medium" color="primary" aria-label="add" onClick={() => handleClickOpen()}>
            <TimerIcon />
          </Fab>
          <Dialog open={open} onClose={handleClose} disableRestoreFocus fullWidth maxWidth='xs'>
            <DialogTitle>Timed Task</DialogTitle>
            <DialogContent>
              <TextField
                id="timed-input"
                autoFocus
                margin="dense"
                label="Minutes"
                type="text"
                fullWidth
                variant="standard"
                placeholder='Enter how many minutes to time task'
                onChange={(e: ChangeEvent<HTMLInputElement>) => updateTimedTaskValue(e)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={addNewTimedTask}>Create</Button>
            </DialogActions>
          </Dialog>
        </div>
      </Stack>
    </Box>
  );
}
