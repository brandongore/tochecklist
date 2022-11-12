import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Image from "next/image";
import { open } from "@tauri-apps/api/dialog";
import * as fs from "@tauri-apps/api/fs";

function App() {
  const [newTask, setNewTask] = useState({});
  const [config, setConfig] = useState({});

  useEffect(() => {
    (async () => {
      const configExists = await fs.exists('config.json', {dir: fs.BaseDirectory.Resource});

      if (configExists) {
        const configJson  = await fs.readTextFile('config.json', {dir: fs.BaseDirectory.Resource});
        setConfig(JSON.parse(configJson))
      }
    })();
  }, []);

  async function add() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    //setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className="container">
      <h1>Choose a checklist below to start</h1>

      <div className="row">
        <div>
          <input
            id="task-input"
            onChange={(e) => setNewTask(e.currentTarget.value)}
            placeholder="Enter a new task..."
          />
          <button type="button" onClick={() => add()}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
