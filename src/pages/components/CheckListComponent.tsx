import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Paper from '@mui/material/Paper';
import ListSubheader from '@mui/material/ListSubheader';
import { Todo } from '../../types/Todo';

export default function CheckListComponent(props) {
  const handleToggle = (id: number) => () => {
    props.onToggle(id);
  };

  return (
    <Paper sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      
      <List dense component="div" role="list"
        subheader={<ListSubheader>{props?.value?.name}
        </ListSubheader>}
      >
        {props?.value?.items?.map((item: Todo) => {
          const labelId = `transfer-list-item-${item.id}-label`;

          return (
            <ListItem
              key={item.id}
              role="listitem"
              onClick={handleToggle(item.id)}
            >
               <ListItemButton role={undefined} onClick={handleToggle(item.id)} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={item.done}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${item.name}`} />
            </ListItemButton>
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );
}