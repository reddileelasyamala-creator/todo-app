import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [cards, setCards] = useState([]);
  const [darkMode, setDarkMode] = useState(false); // ✅ FIXED POSITION

  useEffect(() => {
    const savedCards = JSON.parse(localStorage.getItem("cards"));
    if (savedCards) {
      setCards(savedCards);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);

  const addCard = () => {
    const newCard = {
      id: Date.now(),
      title: "New List",
      tasks: [],
      newTask: ""
    };
    setCards([...cards, newCard]);
  };

  const deleteCard = (cardId) => {
    setCards(cards.filter((card) => card.id !== cardId));
  };

  const updateInput = (cardId, value) => {
    setCards(
      cards.map((card) =>
        card.id === cardId ? { ...card, newTask: value } : card
      )
    );
  };

  const addTask = (cardId) => {
    setCards(
      cards.map((card) => {
        if (card.id === cardId && card.newTask.trim() !== "") {
          return {
            ...card,
            tasks: [
              ...card.tasks,
              { text: card.newTask, completed: false, editing: false }
            ],
            newTask: ""
          };
        }
        return card;
      })
    );
  };

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

  const startEdit = (cardId, index) => {
    setCards(
      cards.map((card) => {
        if (card.id === cardId) {
          const updated = [...card.tasks];
          updated[index].editing = true;
          return { ...card, tasks: updated };
        }
        return card;
      })
    );
  };

  const saveEdit = (cardId, index, newText) => {
    setCards(
      cards.map((card) => {
        if (card.id === cardId) {
          const updated = [...card.tasks];
          updated[index].text = newText;
          updated[index].editing = false;
          return { ...card, tasks: updated };
        }
        return card;
      })
    );
  };

  return (
    <div
      className="app"
      style={{
        background: darkMode ? "#1e1e2f" : "#f4f6f8",
        color: darkMode ? "white" : "black",
        minHeight: "100vh"
      }}
    >
      {/* 🌙 Toggle Button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px"
        }}
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>

      <h1
  style={{
    color: darkMode ? "white" : "#333",
    textAlign: "center"
  }}
>
  My To-Do
</h1>

      <div className="card-container">
        {cards.map((card) => (
          <div
            key={card.id}
            className="card"
            style={{
              background: darkMode ? "#2c2c3e" : "#e7cc95"
            }}
          >
            <button
  className="delete-card"
  style={{
    color: darkMode ? "#ff6b6b" : "black",
    background: "transparent",
    border: "none",
    cursor: "pointer"
  }}
>
  🗑
</button>

            <h2
  style={{
    color: darkMode ? "white" : "#333"
  }}
>
  {card.title}
</h2>

            <ul>
              {card.tasks.map((task, index) => (
                <li key={index}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(card.id, index)}
                  />

                  {task.editing ? (
                    <input
                      value={task.text}
                      onChange={(e) =>
                        saveEdit(card.id, index, e.target.value)
                      }
                      onBlur={() =>
                        saveEdit(card.id, index, task.text)
                      }
                      autoFocus
                    />
                  ) : (
                    <span
                      onDoubleClick={() =>
                        startEdit(card.id, index)
                      }
                      style={{
                        textDecoration: task.completed
                          ? "line-through"
                          : "none",
                        marginLeft: "10px",
                        cursor: "pointer"
                      }}
                    >
                      {task.text}
                    </span>
                  )}

                  <button
  onClick={() => deleteTask(card.id, index)}
  className="delete-task"
  style={{
    color: darkMode ? "#ff6b6b" : "red",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    marginLeft: "10px"
  }}
>
  ✖
</button>
                </li>
              ))}
            </ul>

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

      <button className="add-card-btn" onClick={addCard}>
        +
      </button>
    </div>
  );
}

export default App;