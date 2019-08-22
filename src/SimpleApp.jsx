import React, { useEffect, useState } from "react";
import {
  useIdentityContext,
  IdentityContextProvider
} from "react-netlify-identity-widget";
import "react-netlify-identity-widget/styles.css";

import api from "./utils/api";
import Login from "./Login";

export default function SimpleApp() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editedId, setEditedId] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const url = "https://admiring-shannon-4243e8.netlify.com/";

  useEffect(() => {
    api.readAll().then(todos => {
      if (todos.message === "unauthorized") {
        /*if (isLocalHost()) {
          alert(
            "FaunaDB key is not unauthorized. Make sure you set it in terminal session where you ran `npm start`. Visit http://bit.ly/set-fauna-key for more info"
          );
        } else {
          alert(
            "FaunaDB key is not unauthorized. Verify the key `FAUNADB_SERVER_SECRET` set in Netlify enviroment variables is correct"
          );
        }*/
        return false;
      }

      console.log("all todos", todos);
      setTodos(todos);
    });
  }, []);
  function saveTodo(e) {
    e.preventDefault();
    const todoInfo = {
      title,
      completed: false
    };
    api
      .create(todoInfo)
      .then(response => {
        console.log(response);
        setTodos(todos => todos.concat(response));
        setTitle("");
      })
      .catch(e => {
        console.log("An API error occurred", e);
      });
  }
  function deleteTodo(todoId) {
    // Make API request to delete todo
    api
      .delete(todoId)
      .then(() => {
        console.log(`deleted todo id ${todoId}`);
        const newState = todos.filter(item => {
          return item.ref["@ref"].id !== todoId;
        });
        setTodos(newState);
      })
      .catch(e => {
        console.log(`There was an error removing ${todoId}`, e);
        // Add item removed back to list
      });
  }
  function saveEditedData(e) {
    e.preventDefault();

    api
      .update(editedId, {
        title: editedTitle
      })
      .then(() => {
        console.log(`update todo ${editedId}`);
        const nextTodos = todos.map(todo => {
          if (todo.ref["@ref"].id === editedId) {
            todo.data.title = editedTitle;
            return todo;
          } else {
            return todo;
          }
        });
        setTodos(nextTodos);
      })
      .catch(e => {
        console.log("An API error occurred", e);
      });
  }

  return (
    <IdentityContextProvider url={url}>
      <div>
        <h1>Simple App</h1>

        <Login />
        <h2>Get data</h2>
        <ul>
          {todos.map(todo => {
            return (
              <li
                style={{
                  textDecoration: todo.data.completed ? "line-through" : "none"
                }}
              >
                {todo.data.title}{" "}
                <button
                  className="delete"
                  onClick={() => {
                    deleteTodo(todo.ref["@ref"].id);
                  }}
                >
                  Delete {todo.ref["@ref"].id}
                </button>
                <button
                  className="edit"
                  onClick={() => {
                    setEditedId(todo.ref["@ref"].id);
                    setEditedTitle(todo.data.title);
                  }}
                >
                  Edit {todo.ref["@ref"].id}
                </button>
              </li>
            );
          })}
        </ul>
        <h2>Post data</h2>
        <form onSubmit={saveTodo}>
          <input
            type="text"
            name="title"
            onChange={e => {
              setTitle(e.target.value);
            }}
            value={title}
          />
          <input type="submit" value="Save" />
        </form>
        <h2>Edit data</h2>
        <form onSubmit={saveEditedData}>
          <input
            type="text"
            name="title"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
          />
          <input type="text" disabled name="id" value={editedId} />
          <input type="submit" value="Update" />
        </form>
      </div>
    </IdentityContextProvider>
  );
}
