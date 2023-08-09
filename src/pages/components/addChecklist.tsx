import * as React from 'react';
import Button from '@mui/material/Button';
import { CheckListType } from '../../types/CheckListType';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

export default function AddChecklist(props) {
  return (
    <Box >
      <Grid container spacing={0.5}>
        {props?.items?.map((value: CheckListType, index: number) => {
          const checklistId = `${value?.name.replace(' ', '-')}-${index}`;
          return (
            <Grid item xs={4} md={3}>
              <Button id={checklistId} variant="contained" color="success" onClick={() => props.onClick(index)}>
                {value?.name}
              </Button>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
