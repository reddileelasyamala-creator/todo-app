import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [cards, setCards] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedCards = JSON.parse(localStorage.getItem("cards"));
    if (savedCards) setCards(savedCards);
  }, []);

  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);

  // 🔔 Reminder checker
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();

      cards.forEach((card) => {
        card.tasks.forEach((task) => {
          if (task.reminderTime && !task.notified) {
            const reminder = new Date(task.reminderTime).getTime();

            if (reminder <= now) {
              alert(`🔔 Reminder: ${task.text}`);
              task.notified = true;
            }
          }
        });
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [cards]);

  const addCard = () => {
    const newCard = {
      id: Date.now(),
      title: "New List",
      tasks: [],
      newTask: "",
      reminderTime: ""
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

  const updateReminder = (cardId, value) => {
    setCards(
      cards.map((card) =>
        card.id === cardId ? { ...card, reminderTime: value } : card
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
              {
                text: card.newTask,
                completed: false,
                editing: false,
                reminderTime: card.reminderTime,
                notified: false
              }
            ],
            newTask: "",
            reminderTime: ""
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

  // ✅ FIXED EDIT SYSTEM
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

  const updateEditText = (cardId, index, value) => {
    setCards(
      cards.map((card) => {
        if (card.id === cardId) {
          const updated = [...card.tasks];
          updated[index].text = value;
          return { ...card, tasks: updated };
        }
        return card;
      })
    );
  };

  const saveEdit = (cardId, index) => {
    setCards(
      cards.map((card) => {
        if (card.id === cardId) {
          const updated = [...card.tasks];
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
        background: darkMode
          ? "linear-gradient(135deg, #1e1e2f, #2c2c3e)"
          : "linear-gradient(135deg, #667eea, #764ba2)",
        minHeight: "100vh",
        color: darkMode ? "white" : "black"
      }}
    >
      <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️" : "🌙"}
      </button>

      <h1 className="title" style={{ color: darkMode ? "white" : "#222" }}>
        My To-Do
      </h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card-container">
        {cards.map((card) => (
          <div key={card.id} className="card">
            <button className="delete-card" onClick={() => deleteCard(card.id)}>
              🗑
            </button>

            <h2 style={{ color: darkMode ? "white" : "#333" }}>
              {card.title}
            </h2>

            <ul>
              {card.tasks
                .filter((task) =>
                  task.text.toLowerCase().includes(search.toLowerCase())
                )
                .map((task, index) => (
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
                          updateEditText(card.id, index, e.target.value)
                        }
                        onBlur={() => saveEdit(card.id, index)}
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
                          color: darkMode ? "white" : "black"
                        }}
                      >
                        {task.text}
                      </span>
                    )}

                    <button
                      onClick={() => deleteTask(card.id, index)}
                      className="delete-task"
                    >
                      ✖
                    </button>

                    {/* ⏰ SHOW REMINDER */}
                    {task.reminderTime && (
                      <small style={{ marginLeft: "10px" }}>
                        ⏰{" "}
                        {new Date(task.reminderTime).toLocaleString()}
                      </small>
                    )}
                  </li>
                ))}
            </ul>

            {/* ADD TASK + TIME */}
            <div className="add-task">
              <input
                type="text"
                placeholder="Add item"
                value={card.newTask}
                onChange={(e) =>
                  updateInput(card.id, e.target.value)
                }
              />

              <input
                type="datetime-local"
                value={card.reminderTime || ""}
                onChange={(e) =>
                  updateReminder(card.id, e.target.value)
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