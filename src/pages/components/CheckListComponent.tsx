import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Paper from '@mui/material/Paper';
import ListSubheader from '@mui/material/ListSubheader';
import { Todo, UITodo } from '../../types/Todo';
import DeleteIcon from '@mui/icons-material/Delete';
import PencilIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton } from '@mui/material';
import { CheckListType } from '../../types/CheckListType';
import ProgressTimer from './ProgressTimer';
import { sendNotification } from "@tauri-apps/api/notification";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

export default function CheckListComponent(props) {
  const [uiTODOS, setUITODOS] = useState<UITodo[]>(props?.value?.items.map((todo)=>new UITodo(todo)));

  function toggleEditTodo(todo: UITodo) {
    let updateTodos = uiTODOS.map((uiTodo)=>{
      if(uiTodo.id == todo.id){
        return {...todo, editing: !todo.editing};
      }
      return uiTodo;
    })
    setUITODOS(updateTodos);
  };

  function acceptEditTodo(todo: UITodo){
    toggleEditTodo(todo);
    updateTodos(uiTODOS);
  }

  function cancelEditTodo(todo: UITodo){
    toggleEditTodo(todo);
    revertTodos(uiTODOS);
  }

  function handleToggle(todo: UITodo) {
    let updatedTodo = { ...todo };
    updatedTodo.done = !todo.done
    updateTodo(updatedTodo);
  };

  function updateTodoName(event, todo: UITodo) {
    console.log(event.target.value);
    let updatedTodo = { ...todo };
    updatedTodo.name = event.target.value;
    updateUITodos(updatedTodo);
  };

  function deleteTodo(todo: UITodo) {
    const updatedTodos = props?.value?.items?.filter((checklistTodo: Todo) => {
      return checklistTodo.id != todo.id;
    });

    const updatedUITodos = updatedTodos.map((todo)=>new UITodo(todo))

    updateChecklist(updatedTodos);
    setUITODOS(updatedUITodos);
  };

  function addTodo() {
    const updatedTodos = [...props?.value?.items, Object.assign({}, new Todo())];

    const updatedUITodos = updatedTodos.map((todo)=>new UITodo(todo))

    updateChecklist(updatedTodos);
    setUITODOS(updatedUITodos);
  }

  function updateUITodos(updatedTodo: UITodo) {
    const updatedTodos = uiTODOS.map((checklistTodo: UITodo) => {
      if (checklistTodo.id == updatedTodo.id) {
        return updatedTodo
      }
      return checklistTodo;
    });

    setUITODOS(updatedTodos);
  };

  function revertTodos(updatedTodos: UITodo[]) {
    const existingTodos = props?.value?.items;
    const newTodos = updatedTodos.map((checklistTodo: UITodo) => {
      let newTodo = {...checklistTodo};
      for(var i = 0; i<existingTodos.length;i++){
        if (newTodo.id == existingTodos[i].id) {
          return {
            id: newTodo.id,
            name: existingTodos[i].name,
            done: newTodo.done,
            editing: false
          }
        }
      }
      return newTodo;
    });

    setUITODOS(newTodos);
  };

  function updateTodos(updatedTodos: UITodo[]) {
    const newTodos = props?.value?.items?.map((checklistTodo: Todo) => {
      let newTodo = {...checklistTodo};
      for(var i = 0; i<updatedTodos.length;i++){
        if (newTodo.id == updatedTodos[i].id) {
          return {
            id: updatedTodos[i].id,
            name: updatedTodos[i].name,
            done: updatedTodos[i].done
          }
        }
      }
      return newTodo;
    });

    updateChecklist(newTodos);
  };

  function updateTodo(updatedTodo: UITodo) {
    const updatedTodos = props?.value?.items?.map((checklistTodo: Todo) => {
      if (checklistTodo.id == updatedTodo.id) {
        return {
          id: updatedTodo.id,
          name: updatedTodo.name,
          done: updatedTodo.done
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

  function completeTimerOnChecklist() {
    let updatedChecklist: CheckListType = {
      ...props?.value,
      timerComplete: true
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

  function alertComplete(){
    console.log("alertComplete");
    sendNotification({
      title: `ToChecklist`,
      body: `Timers up for ${props?.value?.name}`,
    });
     (async ()=>{
      const { UserAttentionType, appWindow } = await import("@tauri-apps/api/window");
      await appWindow.requestUserAttention(UserAttentionType.Informational)
    })();
    completeTimerOnChecklist();
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
        {uiTODOS.map((item: UITodo) => {
          const labelId = `todo-list-item-${item.id}-label`;
          const inputId = `todo-list-item-${item.id}-input`;
          let notEditingClass = `todo-action ${item.editing ? '' : 'not-editing'}`;
          let editingClass = `todo-action ${item.editing ? 'editing' : ''}`;

          return (
            <ListItem
              key={item.id}
              role="listitem"
              className='todo-item'
            >
              <ListItemButton role={undefined} dense disableRipple>
                <ListItemIcon onClick={() => handleToggle(item)}>
                  
                  <Checkbox
                    edge="start"
                    checked={item.done}
                    tabIndex={-1}
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText hidden={item.editing} className='todo-item-label' id={labelId} primary={`${item.name.length > 0 ? item.name : "Enter a new task..."}`} />
                <input
                  id={inputId}
                  className='todo-item-input'
                  hidden={!item.editing}
                  onChange={(e) => updateTodoName(e, item)}
                  onKeyUp={(keypressEvent) => { if (keypressEvent.key == 'Enter') { acceptEditTodo(item) } }}
                  placeholder="Enter a new task..."
                  value={item.name}
                />
              </ListItemButton>
              <ListItemButton className={notEditingClass} role={'edit'} dense disableRipple disableGutters onClick={() => toggleEditTodo(item)}>
                <IconButton edge="end" aria-label="edit" size="small">
                  <PencilIcon />
                </IconButton>
              </ListItemButton>
              <ListItemButton className={notEditingClass} role={'delete'} dense disableRipple disableGutters onClick={() => deleteTodo(item)}>
                <IconButton edge="end" aria-label="delete" size="small">
                  <DeleteIcon />
                </IconButton>
              </ListItemButton>
              <ListItemButton className={editingClass} role={'accept'} dense disableRipple disableGutters onClick={() => acceptEditTodo(item)}>
                <IconButton edge="end" aria-label="accept" size="small">
                  <DoneIcon />
                </IconButton>
              </ListItemButton>
              <ListItemButton className={editingClass} role={'cancel'} dense disableRipple disableGutters onClick={() => cancelEditTodo(item)}>
                <IconButton edge="end" aria-label="cancel" size="small">
                  <CloseIcon />
                </IconButton>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      {(() => {
          if(props?.value?.timerMinutes){
            return (
              <ProgressTimer timerDisabled={props?.value?.timerComplete} totalTime={props?.value?.timerMinutes} onTimerComplete={()=>{ alertComplete()}}></ProgressTimer>
            );
          }
        })()}
    </Paper>
  );
}