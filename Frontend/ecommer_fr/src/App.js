
import './App.css';
import './Compontents/Login';
import Home from './Compontents/Home';

import Login from './Compontents/Login';
import Register from './Compontents/Register';
import Welcome from './Compontents/Welcome';
import { BrowserRouter , Routes, Route, } from "react-router-dom";
import Checkout from './Compontents/Checkout';
import Orderconfirmation from './Compontents/Orderconfirmation';
import ViewProduct from './Compontents/ViewProduct';


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
        <Route path='/Checkout' element={<Checkout></Checkout>}/>
        <Route path='/orderconfirmation' element={<Orderconfirmation></Orderconfirmation>}/>
        <Route path='/ViewProduct/:id' element={<ViewProduct></ViewProduct>}></Route>
      </Routes></BrowserRouter>
      
  
    </>
  );
}

export default App;
