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
import DeleteIcon from '@mui/icons-material/Delete';
import PencilIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton } from '@mui/material';
import { CheckListType } from '../../types/CheckListType';

export default function CheckListComponent(props) {
  function showEditTodo(labelFieldId: string, inputFieldId: string) {
    if (!document.getElementById(inputFieldId).hidden) {
      document.getElementById(labelFieldId).hidden = false;
      document.getElementById(inputFieldId).hidden = true;
    }
    else {
      document.getElementById(labelFieldId).hidden = true;
      document.getElementById(inputFieldId).hidden = false;
    }

  };

  function hideEditTodo(labelFieldId: string, inputFieldId: string) {
    if (document.getElementById(labelFieldId) && document.getElementById(inputFieldId)) {
      document.getElementById(labelFieldId).hidden = false;
      document.getElementById(inputFieldId).hidden = true;
    }
  };

  function handleToggle(todo: Todo) {
    let updatedTodo = { ...todo };
    updatedTodo.done = !todo.done
    updateTodos(updatedTodo);
  };

  function updateTodoName(event, todo: Todo) {
    console.log(event.target.value);
    let updatedTodo = { ...todo };
    updatedTodo.name = event.target.value;
    updateTodos(updatedTodo);
  };

  function deleteTodo(event, todo: Todo) {
    clearTimeout(event.target["timeoutId"]);
    const updatedTodos = props?.value?.items?.filter((checklistTodo: Todo) => {
      return checklistTodo.id != todo.id;
    });

    updateChecklist(updatedTodos);
  };

  function addTodo() {
    const updatedTodos = [...props?.value?.items, Object.assign({}, new Todo())];

    updateChecklist(updatedTodos);
  }

  function updateTodos(updatedTodo: Todo) {
    const updatedTodos = props?.value?.items?.map((checklistTodo: Todo) => {
      if (checklistTodo.id == updatedTodo.id) {
        return {
          ...updatedTodo
        }
      }
      return checklistTodo;
    });

    updateChecklist(updatedTodos);
  };

  function updateChecklist(updatedTodos: Todo[]) {
    let updatedChecklist = {
      ...props?.value,
      items: updatedTodos,
      complete: updatedTodos.every(todo => todo.done),
      dateCompleted: updatedTodos.every(todo => todo.done) ? Date.now() : null
    }

    props.onUpdateChecklist(updatedChecklist);
  }

  function deleteChecklist() {
    props.onDeleteChecklist(props?.value);
  }

  function getDateCompleted(dateCompleted) {
    if (dateCompleted) {
      return " - " + new Date(dateCompleted).toUTCString();
    }
    return "";
  }

  return (
    <Paper sx={{ width: '100%', height: '100%', overflow: 'auto' }}>

      <List dense component="div" role="list"
        subheader={<ListSubheader className='todo-list-subheader'>
          <Button className='add-todo-button' size="small" variant="contained" startIcon={<AddIcon />} onClick={() => { addTodo() }}>
                  TODO
          </Button>
          {props?.value?.name}
          {getDateCompleted(props?.value?.dateCompleted)}
          <IconButton className='delete-checklist-button' edge="end" aria-label="delete" onClick={() => { deleteChecklist() }}>
            <DeleteIcon />
          </IconButton>
        </ListSubheader>}
      >
        {props?.value?.items?.map((item: Todo) => {
          const labelId = `todo-list-item-${item.id}-label`;
          const inputId = `todo-list-item-${item.id}-input`;

          return (
            <ListItem
              key={item.id}
              role="listitem"
              className='todo-item'
              onMouseLeave={(e) => { e.target["timeoutId"] = setTimeout(() => { hideEditTodo(labelId, inputId) }, 4000) }}
              onMouseEnter={(e) => { clearTimeout(e.target["timeoutId"]) }}
            >
              <ListItemButton role={undefined} dense>
                <ListItemIcon onClick={() => handleToggle(item)}>
                  <Checkbox
                    edge="start"
                    checked={item.done}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={`${item.name}`} />
                <input
                  id={inputId}
                  className='todo-item-input'
                  hidden
                  onChange={(e) => updateTodoName(e, item)}
                  onBlur={() => hideEditTodo(labelId, inputId)}
                  onKeyUp={(keypressEvent) => { if (keypressEvent.key == 'Enter') { hideEditTodo(labelId, inputId) } }}
                  placeholder="Enter a new task..."
                  value={item.name}
                />
              </ListItemButton>
              <ListItemButton className='todo-action' role={'edit'} dense disableRipple disableGutters onClick={() => showEditTodo(labelId, inputId)}>
                <IconButton edge="end" aria-label="edit" size="small">
                  <PencilIcon />
                </IconButton>
              </ListItemButton>
              <ListItemButton className='todo-action' role={'delete'} dense disableRipple disableGutters onClick={() => deleteTodo(event, item)}>
                <IconButton edge="end" aria-label="delete" size="small">
                  <DeleteIcon />
                </IconButton>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
}