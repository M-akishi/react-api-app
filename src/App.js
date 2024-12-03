import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/home';
import NavBar from './pages/navBar';
import { Productos, NewProducto, ProductoActualizar, ProductoEliminar } from './pages/productos';

function App() {
  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route index element={<Home/>} />
        <Route path='productos' element={<Productos/>} />
        <Route path='productos/nuevo' element={<NewProducto/>}/>
        <Route path="/producto/actualizar/:id" element={<ProductoActualizar />} />
        <Route path="/producto/eliminar/:id" element={<ProductoEliminar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
