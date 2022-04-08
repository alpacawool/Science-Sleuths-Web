import {TestComponent} from './components/TestComponent/TestComponent'
import {useState, useEffect} from 'react'

function App() {

  const [state, setState] = useState({})

  useEffect(() => {
    fetch("/hello").then(response => {
      if (response.status === 200) {
        return response.json()
      }
    }).then(data => setState(data))
    .then(error => console.log(error))
  }, [])

  return (
    <div className="App">
      <TestComponent prop={state}/>
    </div>
  );
}

export default App;
