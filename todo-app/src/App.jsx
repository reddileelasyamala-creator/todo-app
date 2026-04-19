import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [cards, setCards] = useState([]);

  // 🔥 LOAD DATA (on start)
  useEffect(() => {
    const savedCards = JSON.parse(localStorage.getItem("cards"));
    if (savedCards) {
      setCards(savedCards);
    }
  }, []);

  // 🔥 SAVE DATA (whenever cards change)
  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);

  // ➕ Add new card
  const addCard = () => {
    const newCard = {
      id: Date.now(),
      title: "New List",
      tasks: [],
      newTask: ""
    };
    setCards([...cards, newCard]);
  };

  // ❌ Delete entire card
  const deleteCard = (cardId) => {
    setCards(cards.filter((card) => card.id !== cardId));
  };

  // ✏️ Update input inside card
  const updateInput = (cardId, value) => {
    setCards(
      cards.map((card) =>
        card.id === cardId ? { ...card, newTask: value } : card
      )
    );
  };

  // ➕ Add task inside card
  const addTask = (cardId) => {
    setCards(
      cards.map((card) => {
        if (card.id === cardId && card.newTask.trim() !== "") {
          return {
            ...card,
            tasks: [
              ...card.tasks,
              { text: card.newTask, completed: false }
            ],
            newTask: ""
          };
        }
        return card;
      })
    );
  };

  // ✔️ Toggle task
  const toggleTask = (cardId, index) => {
    setCards(
      cards.map((card) => {
        if (card.id === cardId) {
          const updated = [...card.tasks];
          updated[index].completed = !updated[index].completed;
          return { ...card, tasks: updated };
        }
        return card;
      })
    );
  };

  // ❌ Delete task
  const deleteTask = (cardId, index) => {
    setCards(
      cards.map((card) => {
        if (card.id === cardId) {
          return {
            ...card,
            tasks: card.tasks.filter((_, i) => i !== index)
          };
        }
        return card;
      })
    );
  };

  return (
    <div className="app">
      <h1>My To-Do</h1>

      <div className="card-container">
        {cards.map((card) => (
          <div key={card.id} className="card">
            
            {/* Delete Card */}
            <button className="delete-card" onClick={() => deleteCard(card.id)}>
              🗑
            </button>

            <h2>{card.title}</h2>

            <ul>
              {card.tasks.map((task, index) => (
                <li key={index}>
  <input
    type="checkbox"
    checked={task.completed}
    onChange={() => toggleTask(card.id, index)}
  />

  <span
    style={{
      textDecoration: task.completed ? "line-through" : "none",
      marginLeft: "10px"
    }}
  >
    {task.text}
  </span>

  <button
    onClick={() => deleteTask(card.id, index)}
    className="delete-task"
  >
    ✖
  </button>
</li>
              ))}
            </ul>

            {/* Add Task */}
            <div className="add-task">
              <input
                type="text"
                placeholder="Add item"
                value={card.newTask}
                onChange={(e) =>
                  updateInput(card.id, e.target.value)
                }
              />
              <button onClick={() => addTask(card.id)}>+</button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Button */}
      <button className="add-card-btn" onClick={addCard}>
        +
      </button>
    </div>
  );
}

export default App;