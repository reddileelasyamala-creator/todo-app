import { useState } from "react";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (task.trim() === "") return;
    setTasks([...tasks, task]);
    setTask("");
  };
  const deleteTask = (indexToDelete) => {
  const newTasks = tasks.filter((_, index) => index !== indexToDelete);
  setTasks(newTasks);
};

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial" }}>
      <h1>My To-Do App</h1>

      <input
        type="text"
        placeholder="Enter task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      <button onClick={addTask}>Add Task</button>

      <ul>
  {tasks.map((t, index) => (
    <li key={index}>
      {t}
      <button onClick={() => deleteTask(index)}>❌</button>
    </li>
  ))}
</ul>
    </div>
  );
}

export default App;