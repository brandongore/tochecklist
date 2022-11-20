import * as React from 'react';
import { useState } from "react";
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';

export default function AddTask(props) {
  const [newTask, setNewTask] = useState("");

  function addNewTask(){
    props.onClick(newTask)
    let input: HTMLInputElement = document.querySelector<HTMLInputElement>("#task-input");
    input.value = "";
  }

  return (
    <Box sx={{ '& > :not(style)': { m: 1 } }}>
      <Stack direction="row" spacing={2}>
        <div>
          <input
            id="task-input"
            onChange={(e) => setNewTask(e.currentTarget.value)}
            placeholder="Enter a new task..."
          />
          <Fab sx={{ ml: 1 }}  size="medium" color="primary" aria-label="add" onClick={() => addNewTask()}>
            <AddIcon />
          </Fab>
        </div>
      </Stack>
    </Box>
  );
}
