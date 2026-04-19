import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [cards, setCards] = useState([]);

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

  // ✏️ START EDIT
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

  // 💾 SAVE EDIT
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
    <div className="app">
      <h1 style={{ color: "#333", textAlign: "center" }}>
        My To-Do
      </h1>

      <div className="card-container">
        {cards.map((card) => (
          <div key={card.id} className="card">

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

                  {/* ✨ EDIT UI */}
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