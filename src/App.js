import React, { useReducer, useContext,useState, useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';

const appReducer = (state, action) => {
  switch (action.type) {
    case 'add': {
      return [
        ...state,
        {
          id:Date.now(),
          text:action.payload,
          completed: false
        }
      ]
    }
    case 'delete': {
      return state.filter((item) => item.id!==action.payload);
    }
    case 'completed': {
      return state.map((item) => {
        if(item.id === action.payload){
          return {
            ...item,
            completed: !item.completed,
          };
        }
        return item;
      });
    }
    case 'reset':
      return action.payload
    default:
      return state;
  }
}

const Context = React.createContext();

function useEffectOnce(cb) {
  const didRun = useRef(false);
  useEffect(()=>{
    if(!didRun.current) {
      cb();
      didRun.current = true;
    }
    });
}


function App() {
  const [task, setTask] = useState('')
  const [state, dispatch] = useReducer(appReducer,[]);
  useEffectOnce(()=>{
    const raw = localStorage.getItem('data');
    dispatch({type:'reset', payload:JSON.parse(raw)});
    })


  useEffect(()=>{
    localStorage.setItem('data',JSON.stringify(state));
  },[state]);

  return (
    <div className="App">
      <Context.Provider value={dispatch}>
      <h1>TODO APP</h1>
      <input type="text" onChange={(e)=>setTask(e.target.value)}/>
      <button onClick={() => dispatch({type:'add',payload:task})}>NEW TODO</button>
      <br/>
      <br/>      
      <TodosList items={state} />
      </Context.Provider>
    </div>
  );
}

function TodosList({items}) {
  return items.map((item) => <TodoItem key={item.id} {...item}/>)
}

function TodoItem({id, completed, text}){
  const dispatch = useContext(Context)
  return (
  <div
  style={{
    display:'flex',
    flexDirection:'row',
    justifyContent:'center'
  }}
  >
    <input type="checkbox" checked={completed} onChange={() => dispatch({type:'completed',payload:id})}/>
    <input type="text" defaultValue={text} disabled/>
    <button onClick={() => dispatch({type:'delete', payload: id})}>Delete</button>
  </div>
  )
}

export default App;
