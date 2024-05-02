import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import { FaTimesCircle } from "react-icons/fa";

interface ITodo {
  id: string
  name: string
  isComplete: boolean
}

function App() {
  const [todos, setTodos] = useState<ITodo[]>([])
  const [name, setName] = useState("")
  const [isComplete, setIsComplete] = useState<boolean>(false)

  const fetchTodos = async () => {
    const { data } = await axios.get("https://localhost:7214/api/todoitems")
    setTodos(data)
    console.log(data);
  }

  const deleteTodo = async (id: any) => {
    await axios.delete(`https://localhost:7214/api/todoitems/${id}`)
    .then(() => console.log("todo deleted successfully"))
    .catch((err: any) => console.log(err))
    .finally(() => {
        const timeoutId = setTimeout(() => {
          fetchTodos();
          }, 300);
   
        return () => clearTimeout(timeoutId); 
    })
  
  }

  const handleCheck = async (id: any) => {
    const { data } = await axios.get(`https://localhost:7214/api/todoitems/${id}`);
    const todo = data;
    console.log("todo ", data)
    if(!todo) {
      console.log("todo does not exist");
    }
    await axios.put(`https://localhost:7214/api/todoitems/${todo?.id}`, {
      id: todo?.id,
      name: todo?.name,
      isComplete
    }, {
          headers: {
            'Content-Type': 'application/json'
          }      
    })
    .then(() => {
      if(todo?.isComplete == true) {
        setIsComplete(isComplete)
        const timeoutId = setTimeout(() => {
          fetchTodos();
          }, 100);
   
        return () => clearTimeout(timeoutId);
      }else {
        setIsComplete(!isComplete)
        const timeoutId = setTimeout(() => {
          fetchTodos();
          }, 100);
   
        return () => clearTimeout(timeoutId);
      }
    })
    .catch((err: any) => console.log(err))

  }



  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await axios.post("https://localhost:7214/api/todoitems", {
          name,
          isComplete
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
    }).then(({data}) => {
      console.log(data); return data;
    
    })
    .catch((err:any) => console.log(err))
    .finally(() => {
      setName("")
        const timeoutId = setTimeout(() => {
          fetchTodos();
          }, 300);
   
        return () => clearTimeout(timeoutId); 
    })
  }


  useEffect(() => {
    fetchTodos();    
  }, [])
  

  return (
    <>
      <div className='container'>
          <header className=''>
            <h1>Tasks</h1>
          </header>
          <hr />
            <form onSubmit={handleSubmit}>
              <input type='text' name='name' placeholder='What do you wanna do?' 
              value={name}
              onChange={(e) => setName(e.target.value)}
              />
              <button className='' type='submit'>add</button>
            </form>
            <hr />
          <div className="taskDiv">
            {
              todos?.map(task => (
                <div className='taskItem' key={task?.id}>
                  <div className="first">
                   
                      <input type="checkbox" name="isComplete"  
                      checked={task?.isComplete == true ? true : false}
                      onChange={() => handleCheck(task?.id)}
                      />
                   
                    <h4 className="">{task.name}</h4>
                  </div>
                  <div className="">
                    <FaTimesCircle onClick={() => deleteTodo(task?.id)} />
                  </div>
                </div>
              ))
            }
          </div>
      </div>
    </>
  )
}

export default App
