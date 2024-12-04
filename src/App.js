import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/home';
import NavBar from './pages/navBar';
import { Productos, NewProducto, ProductoActualizar, ProductoEliminar } from './pages/productos';
import { Platos, NewPlato, PlatoActualizar, PlatoEliminar, PlatoIngredientes } from './pages/platos';
import { Mesas, NewMesa, MesaActualizar, MesaEliminar } from './pages/mesas';


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
        <Route path='platos' element={<Platos/>} />
        <Route path='platos/nuevo' element={<NewPlato/>}/>
        <Route path="platos/actualizar/:id" element={<PlatoActualizar />} />
        <Route path="platos/eliminar/:id" element={<PlatoEliminar />} />
        <Route path="platos/ingredientes/:id" element={<PlatoIngredientes />} />
        <Route path='mesas' element={<Mesas/>} />
        <Route path='mesas/nuevo' element={<NewMesa/>} />
        <Route path='mesas/actualizar/:id' element={<MesaActualizar/>} />
        <Route path='mesas/eliminar/:id' element={<MesaEliminar/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
