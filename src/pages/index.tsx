import { useState, useEffect } from "react";
import * as fs from "@tauri-apps/api/fs";
import Agenda from "./components/agenda";
import AddTask from "./components/addTask";
import AddChecklist from "./components/addChecklist";
import { Config } from "../types/Config";
import { CheckListType } from "../types/CheckListType";

function App() {
  const [config, setConfig] = useState<Config>({checklists: []} as Config);
  const [activeTasks, setActiveTasks] = useState<CheckListType[]>([]);

  useEffect(() => {
    (async () => {
      const configExists = await fs.exists('config.json', { dir: fs.BaseDirectory.Resource });

      if (configExists) {
        const configJson = await fs.readTextFile('config.json', { dir: fs.BaseDirectory.Resource });
        setConfig(JSON.parse(configJson))
        console.log(config.checklists);
      }
    })();
  }, []);

  function addChecklist(index) {
    setActiveTasks([...activeTasks, Object.assign({}, config.checklists[index])]);
  }

  function addTask(name) {
    setActiveTasks([...activeTasks, {"name":"TODO", items:[name]} as CheckListType]);
  }

  function deleteChecklist(index) {
    setActiveTasks([...activeTasks.filter((_val, checkListIndex) => { return checkListIndex !== index})]);
  }

  return (
    <div className="container">
      <h2>Choose a checklist below to start</h2>
      <AddChecklist items={config.checklists} onClick={(index) => addChecklist(index)}></AddChecklist>
      <Agenda items={activeTasks} onComplete={(index) => deleteChecklist(index)}></Agenda>
      <AddTask onClick={(name) => addTask(name)}></AddTask>
    </div>
  );
}

export default App;
