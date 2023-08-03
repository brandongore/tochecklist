import { useState, useEffect } from "react";
import * as fs from "@tauri-apps/api/fs";
import Agenda from "./components/agenda";
import AddTask from "./components/addTask";
import AddChecklist from "./components/addChecklist";
import { Config } from "../types/Config";
import { CheckListType } from "../types/CheckListType";
import { CheckListConfigType } from "../types/CheckListConfigType";
import React from "react";
import { Todo } from "../types/Todo";


function App() {
  const [config, setConfig] = useState<Config>({checklists: []} as Config);
  const [activeTasks, setActiveTasks] = useState<CheckListType[]>([]);

  const activeTasksRef = React.useRef(activeTasks);
  const setActiveTasksState = data => {
    activeTasksRef.current = data;
    setActiveTasks(data);
  };

  useEffect(() => {
    (async () => {
      const { appWindow } = await import("@tauri-apps/api/window");
  
      const unlistenClose = appWindow.onCloseRequested(({ event }) => { 
        return fs.writeTextFile('taskState.json', JSON.stringify(activeTasksRef.current), { dir: fs.BaseDirectory.Resource });
      });

      const configExists = await fs.exists('config.json', { dir: fs.BaseDirectory.Resource });

      if (configExists) {
        const configJson = await fs.readTextFile('config.json', { dir: fs.BaseDirectory.Resource });
        setConfig(JSON.parse(configJson))
        console.log(config.checklists);
      }

      const taskStateExists = await fs.exists('taskState.json', { dir: fs.BaseDirectory.Resource });

      if (taskStateExists) {
        const taskStateJson = await fs.readTextFile('taskState.json', { dir: fs.BaseDirectory.Resource });
        setActiveTasks(JSON.parse(taskStateJson))
      }

      return () => {
        unlistenClose.then(f => f())
      };
    })();
  }, []);

  function addChecklist(index) {
    setActiveTasksState([...activeTasks, Object.assign({id: generateUniqueId()}, hydrateChecklist(config.checklists[index]))]);
  }

  function addTask(name) {
    setActiveTasksState([...activeTasks, {id: generateUniqueId(), "name":"TODO", items:[hydrateTodo(name)]} as CheckListType]);
  }

  function hydrateChecklist(checklist: CheckListConfigType): CheckListType{
    let check = {
      id: generateUniqueId(),
      name: checklist.name,
      items: [...checklist.items.map((todo)=>hydrateTodo(todo))]
    }
    console.log("check",check);
    return check;
  }

  function hydrateTodo(todo: string): Todo{
    let hytodo = {
      id: generateUniqueId(),
      name: todo,
      done: false
    }
    console.log("hytodo",hytodo);
    return hytodo;
  }

  function generateUniqueId(){
    return Math.floor(Math.random() * Date.now());
  }

  function updateTodo(checklistId, todoId) {
    setActiveTasksState(activeTasks.map((checklist)=>{
      if(checklist.id == checklistId){
        const updatedTodos = checklist.items.map((todo)=>{
          if(todo.id == todoId){
            return {
              ...todo,
              done: !todo.done
            }
          }
          return todo;
        });

        return {
          ...checklist,
          items: updatedTodos,
          complete: updatedTodos.every(todo=>todo.done),
          dateCompleted: Date.now()
        }
      }
      return checklist;
    }));
  }

  return (
    <div className="container">
      
      <h2>Choose a checklist below to start</h2>
      <AddChecklist items={config.checklists} onClick={(index) => addChecklist(index)}></AddChecklist>
      <Agenda items={activeTasks} onToggle={(checklistId, todoId) => updateTodo(checklistId,todoId)}></Agenda>
      <AddTask onClick={(name) => addTask(name)}></AddTask>
    </div>
  );
}

export default App;
