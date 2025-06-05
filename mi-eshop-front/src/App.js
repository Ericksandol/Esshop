import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Productos from "./Pages/Productos";
import Card_Producto from "./Pages/Card_Producto";
import { Cart } from './Pages/Cart';
import Pedidos from './Pages/Pedidos';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/productos" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/producto/:id" element={<Card_Producto />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/pedidos" element={<Pedidos />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;