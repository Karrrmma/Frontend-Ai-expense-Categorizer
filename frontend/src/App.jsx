import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import UploadStatement from './Component/uploadStatement'

function App() {
  const [count, setCount] = useState(0)

  return  <UploadStatement/>;
}

export default App
