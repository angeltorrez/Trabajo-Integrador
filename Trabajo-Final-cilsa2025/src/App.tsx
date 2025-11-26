import {Routes,Route, BrowserRouter} from 'react-router-dom'
import './App.css'
import Home from './Home'
import Login from './pages/Login'
import Help from './pages/Help'
import Dashboard from './pages/Dashboard'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/help" element={<Help/>}></Route>
        <Route path="/Dashboard" element={<Dashboard/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App
