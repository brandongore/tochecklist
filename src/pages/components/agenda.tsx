import * as React from 'react';
import { CheckListType } from '../../types/CheckListType';
import Box from '@mui/material/Box';
import CheckListComponent from './CheckListComponent';
import Grid from '@mui/material/Grid';

export default function Agenda(props) {

    function updateChecklist(updatedChecklist: CheckListType) {
        let updatedChecklists = props?.items?.map((checklist: CheckListType)=>{
          if(checklist.id == updatedChecklist.id){
            return updatedChecklist;
          }
          return checklist;
        });

        props.onUpdateChecklist(updatedChecklists);
      }

    return (
        <Box sx={{ padding: 1 }}>
        <Grid container spacing={0.5}>
            {props?.items?.filter((checklist:CheckListType)=>{return props?.showCompleted || !checklist.complete}).map((value: CheckListType, index: number) => {
                return (
                    <Grid item xs={12} md={6}>
                    <CheckListComponent value={value} onUpdateChecklist={(checklist) => updateChecklist(checklist)}>
                        {value.name}
                    </CheckListComponent>
                    </Grid>
                );
            })}
        </Grid>
        </Box>
    );
}