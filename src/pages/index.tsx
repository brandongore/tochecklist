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
import SettingsDialog from "./components/settingsDialog";
import { generateUniqueId } from "../helpers/helpers";

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
        setConfig(hydrateConfig(configJson))
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
    setActiveTasksState([...activeTasks, hydrateChecklist({"name":"TODO", items:[name]})]);
  }

  function addTimedTask(name, minutes){
    setActiveTasksState([...activeTasks,hydrateChecklist({"name":"TODO", items:[name], timerMinutes: minutes})]);
  }

  function hydrateConfig(configJson: string): Config{
    let parsedConfig: Config = JSON.parse(configJson);
    let defaultConfig = Object.assign(new Config(), parsedConfig);
    return defaultConfig;
  }

  function hydrateChecklist(checklist: CheckListConfigType): CheckListType{
    let newChecklist: CheckListType = {
      id: generateUniqueId(),
      name: checklist.name,
      items: [...checklist.items.map((todo)=>hydrateTodo(todo))],
      complete: false,
      timerMinutes: checklist.timerMinutes,
      timerComplete: false,
    }

    return newChecklist;
  }

  function hydrateTodo(todo: string): Todo{
    let newTodo = {
      id: generateUniqueId(),
      name: todo.length > 0 ? todo : "NEW TODO",
      done: false
    }

    return newTodo;
  }

  function updateChecklists(updatedChecklists: CheckListType[]) {
    setActiveTasksState(updatedChecklists);
  }

  return (
    <div className="container">
      <h2>Choose a checklist below to start</h2>
      <SettingsDialog settings={config} onUpdateSetting={(newConfig)=>{setConfig(newConfig);}}></SettingsDialog>
      <AddChecklist items={config.checklists} onClick={(index) => addChecklist(index)}></AddChecklist>
      <Agenda items={activeTasks} showCompleted={config.showCompleted} 
        onUpdateChecklists={(checklists) => updateChecklists(checklists)}></Agenda>
      <AddTask onAddNewTask={(name) => addTask(name)} onAddNewTimedTask={(name, minutes) => addTimedTask(name, minutes)}></AddTask>
    </div>
  );
}

export default App;
