import { useState } from 'react'
import './App.css'
import Inicio from './pages/layout'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import StoreProvider from './store';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <StoreProvider>
        <Inicio />
      </StoreProvider>
    </>
  )
}

export default App
