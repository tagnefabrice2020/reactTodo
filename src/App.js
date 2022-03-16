import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import fetch from './settings';
import { v4 as uuidv4 } from 'uuid';

function App() {

  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doneTodos, setDoneTodos] = useState([]);
  const [doneTodoTotal, setDoneTodoTotal] = useState(0);

  useEffect(() => {
    async function fetchTodos () {
      const results = await fetch.get('/todos');
     
      setTodos(results.data);
      
        const nTodo = results.data.reduce((dts, todo) => {
          if (todo.done) {
            dts.push(todo.id);
            return (dts);
          }
          return (dts);
        }, []);  setDoneTodos(nTodo);
        setLoading(false);
      
    }
    fetchTodos();
  }, []);

  const handleChange = (event) => {
    setTodo(event.target.value);
  }

  const storeTodo = async () => {
    const data = {
      id: uuidv4(),
      todo: todo,
      done: false
    }; 
    const response = await fetch.post('/todos', data);
    if (response.status == 201) {
      setTodos([...todos, response.data]);
      setTodo("");
    };
  }

  const update = async (id, data) => {
    const initialTodos = [...todos];
    initialTodos.map(async todo => {
      if (todo.id === id) {
        await fetch.put(`/todos/${id}`, data)
      }
    })
  }

  const switchTaskState =  (id) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) { 
        todo.done = !todo.done;
        if (todo.done) {
          setDoneTodos([...doneTodos, todo.id]);
        } else {
          const newDoneTodos = doneTodos.filter(id => {
            return todo.id !== id 
          });
          setDoneTodos([...newDoneTodos]);
        }
        return todo;
      }
      return todo = todo;
    });
    setTodos(newTodos);
  }

  const deleteTodo = async (id) => {
    const response = await fetch.delete(`/todos/${id}`);
    if (response.status === 200) {
      const newTodos = todos.filter((todo) => {
        return todo.id !== id;
      });
      const initialNewDoneTodos = [...doneTodos];

      const newDoneTodosIdx = initialNewDoneTodos.findIndex(todo => {
        return todo === id;
      });
      initialNewDoneTodos.splice(newDoneTodosIdx, 1);
      setDoneTodos(initialNewDoneTodos);

      setTodos(newTodos);
    }
  }


  const deleteDoneTodos = async () => {
    const initialTodos = [...doneTodos];
    const deleteDoneTodos = doneTodos.map(todo => {
        return fetch.delete(`/todos/${todo}`)
    });
    Promise.all(deleteDoneTodos);
    const td = todos.filter(todo => {
      return todo.done === false;
    });
    setDoneTodos([]);
    setTodos(td);
  }

  return (
    <div className="todo-container">
      <div className="todo-container-top">
        <div className="todo-input-container">
          <input type="text" value={todo} onChange={(event) => handleChange(event)} placeholder="Task name:" />
        </div>
        <div className="todo-button-container">
          <input type="submit" disabled={todo.length == 0 ? true : false} onClick={storeTodo} className={todo.length > 0 ? 'enabled': null} value="ADD TODO" />
        </div>
      </div>
      <div className="todo-container-bottom">
        <div className="todo-container-bottom-row1">
          <span>{!loading ? doneTodos.length : '0'} / {todos.length}</span>
          <button disabled={todos.length == 0 ? true : false} onClick={() => deleteDoneTodos()}>CLEAR DONE TODOS</button>
        </div>
        <div className="todo-container-bottom-row2">
          {!loading &&
            todos.map((todo, idx) => {
              return <div className="todo" key={idx}>
                <label 
                  className="container" 
                  onClick={() => {switchTaskState(todo.id); update(todo.id, todo)}} 
                  >
                  <div className={todo.done ? "checkmark checked" : "checkmark" }
                    
                    checked={doneTodos.map((id) => {
                      console.log(id, todo.id)
                      return id === todo.id ? 'checked': null
                    })} 
                  ></div>
                  &nbsp;<span className={todo.done ? "todo-task task-done" : "todo-task" }>{todo.todo} {todo.done}</span>
                </label>
                <button className="cancel" onClick={() => deleteTodo(todo.id)}>
                  <i className="bi bi-x"></i>
                </button>
            </div>
            })
          }
        </div>
      </div>
    </div>
  );
}

export default App;
