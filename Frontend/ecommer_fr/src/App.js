
import './App.css';
import './Compontents/Login';
import Home from './Compontents/Home';

import Login from './Compontents/Login';
import Register from './Compontents/Register';
import Welcome from './Compontents/Welcome';
import { BrowserRouter , Routes, Route, } from "react-router-dom";


function App() {
  return (
    <>
    <BrowserRouter>
    <main />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path="/login" element={<Login></Login>} />
        <Route path="/register" element={<Register />} />
        <Route path='/welcome' element={<Welcome/>}/>
      </Routes></BrowserRouter>
      
  
    </>
  );
}

export default App;
