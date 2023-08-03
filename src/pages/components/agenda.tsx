import * as React from 'react';
import { CheckListType } from '../../types/CheckListType';
import Box from '@mui/material/Box';
import CheckListComponent from './CheckListComponent';
import Grid from '@mui/material/Grid';

export default function Agenda(props) {
    return (
        <Box sx={{ padding: 1 }}>
        <Grid container spacing={0.5}>
            {props?.items?.filter((checklist:CheckListType)=>{return !checklist.complete}).map((value: CheckListType, index: number) => {
                return (
                    <Grid item xs={12} md={6}>
                    <CheckListComponent value={value} onToggle={(todoId) => props.onToggle(value.id,todoId)}>
                        {value.name}
                    </CheckListComponent>
                    </Grid>
                );
            })}
        </Grid>
        </Box>
    );
}