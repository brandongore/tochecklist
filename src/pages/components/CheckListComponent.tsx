import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import ListSubheader from '@mui/material/ListSubheader';
import { useState, useEffect } from "react";

export default function CheckListComponent(props) {
  const [checked, setChecked] = useState<readonly number[]>([]);

  useEffect(() => {
    if(checked.length == props.value.items.length){
      props.onComplete();
    }
  }, );

  const handleToggle = (index: number) => () => {
    const currentIndex = checked.indexOf(index);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(index);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    console.log(newChecked);

    setChecked(newChecked);
  };

  return (
    <Paper sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      
      <List dense component="div" role="list"
        subheader={<ListSubheader>{props?.value?.name}
        </ListSubheader>}
      >
        {props?.value?.items?.map((item: string, index: number) => {
          const labelId = `transfer-list-item-${index}-label`;

          return (
            <ListItem
              key={index}
              role="listitem"
              button
              onClick={handleToggle(index)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(index) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${item}`} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );
}