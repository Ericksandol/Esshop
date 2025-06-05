import { useEffect, useState, useContext } from "react"; 
import { useNavigate } from "react-router-dom";
import { CartContext } from '../context/CartContext';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();
  const { cart, total, addToCart, showCart, setShowCart, cartItemCount } = useContext(CartContext);

  useEffect(() => {
    fetch("http://localhost:5157/productos")
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(() => alert("Error al cargar productos"));
  }, []);

  const handleProductClick = (id) => {
    navigate(`/producto/${id}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart({
      id: product.id_producto,
      nombre: product.nombre,
      precio: product.precio,
      img: product.imgProducto
    });
  };

  return (
    <div
      className="min-vh-100"
      style={{
        background: '#FFFFFF',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Navigation Menu */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#003087' }}>
        <div className="container">
          <a className="navbar-brand" href="/" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
            ESHOP
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="/">Inicio</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/productos">Productos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/acerca">Acerca</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/contacto">Contacto</a>
              </li>
            </ul>
            <div className="d-flex gap-2 align-items-center">
              <button
                onClick={() => setShowCart(true)}
                className="btn btn-warning position-relative"
              >
                🛒 Carrito
                {cartItemCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => navigate("/login")}
                className="btn btn-outline-light"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/registro")}
                className="btn btn-outline-light"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-5">
        <h2 className="text-center mb-4" style={{ color: '#003087', fontWeight: '600' }}>
          Nuestros Productos
        </h2>
        {productos.length > 0 ? (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
            {productos.map(prod => (
              <div key={prod.id_producto} className="col">
                <div
                  className="card h-100 border-0"
                  style={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '2px solid #0052CC',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleProductClick(prod.id_producto)}
                >
                  <div style={{ height: '250px', overflow: 'hidden', backgroundColor: '#F8F9FA' }}>
                    <img
                      src={prod.imgProducto || "https://via.placeholder.com/300x200?text=Producto"}
                      alt={prod.nombre}
                      className="card-img-top"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        borderRadius: '8px',
                        padding: '10px',
                      }}
                      onError={(e) => (e.target.src = "https://via.placeholder.com/300x200?text=Error")}
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title" style={{ color: '#003087', fontWeight: '500' }}>
                      {prod.nombre}
                    </h5>
                    <p className="card-text text-muted">${prod.precio.toFixed(2)}</p>
                    <button
                      className="btn w-100"
                      style={{ backgroundColor: '#FFC107', color: '#003087', fontWeight: '500' }}
                      onClick={(e) => handleAddToCart(e, prod)}
                    >
                      Añadir al Carrito
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted">No hay productos disponibles.</p>
        )}
      </main>
       {/* Modal del Carrito */}
{showCart && (
  <div className="position-fixed end-0 top-0 mt-5 me-3 p-3 bg-white shadow rounded" 
       style={{ zIndex: 1000, width: '300px' }}>
    <h5 className="text-center mb-3" style={{ color: '#003087' }}>Tu Carrito</h5>
    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
      {cart.length > 0 ? (
        cart.map((item, index) => (
          <div key={index} className="d-flex justify-content-between mb-2">
            <span>{item.nombre}</span>
            <span>${item.precio.toFixed(2)}</span>
          </div>
        ))
      ) : (
        <p className="text-muted text-center">El carrito está vacío</p>
      )}
    </div>
    <hr />
    <div className="d-flex justify-content-between fw-bold mb-3">
      <span>Total:</span>
      <span>${total.toFixed(2)}</span>
    </div>
    <button
      onClick={() => {
        setShowCart(false);
        navigate('/pedidos');
      }}
      className="btn btn-primary w-100 mb-2"
      disabled={cart.length === 0}
    >
      Ir a ver pedido
    </button>
    <button
      onClick={() => setShowCart(false)}
      className="btn btn-outline-secondary w-100"
    >
      Cerrar
    </button>
  </div>
)}


      {/* Footer */}
      <footer
        className="text-white text-center py-4"
        style={{
          backgroundColor: '#003087',
          borderTop: '3px solid #FFC107',
        }}
      >
        <div className="container">
          <p className="mb-1">© 2025 Tienda El Salvador - Todos los derechos reservados</p>
          <p className="mb-0" style={{ fontSize: '0.9rem' }}>
            Inspirado en la vibrante cultura de El Salvador: pupusas, volcanes y mercados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Productos;
