import React from 'react';
import { useCart } from '../context/CartContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';


const Pedidos = () => {
  const { cart, total } = useCart();
  const navigate = useNavigate();


  // Agrupar productos por nombre
  const groupedCart = cart.reduce((acc, item) => {
    const key = item.nombre;
    if (!acc[key]) {
      acc[key] = { ...item, quantity: item.quantity || 1 };
    } else {
      acc[key].quantity += item.quantity || 1;
    }
    return acc;
  }, {});

  const resumen = Object.values(groupedCart);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(0, 48, 135);
    doc.text('Factura Esshop', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    const headers = [['Producto', 'Precio Unitario', 'Cantidad', 'Subtotal']];
    const data = resumen.map(item => [
      item.nombre,
      `$${item.precio.toFixed(2)}`,
      item.quantity,
      `$${(item.precio * item.quantity).toFixed(2)}`
    ]);

   const table = autoTable(doc, {
  head: headers,
  body: data,
  startY: 30,
  theme: 'grid',
  headStyles: {
    fillColor: [0, 48, 135],
    textColor: 255
  }
});

doc.setFontSize(14);
doc.text(`Total a Pagar: $${total}`, 14, doc.lastAutoTable.finalY + 20);



    doc.save(`factura-esshop-${new Date().toLocaleDateString()}.pdf`);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4" style={{ color: '#003087' }}>📦 Resumen del Pedido</h2>
      <button className="btn btn-outline-secondary mb-3" onClick={() => navigate('/productos')}>
  ← Regresar a Productos
</button>


      {resumen.length > 0 ? (
        <>
          <table className="table table-striped">
            <thead className="table-primary">
              <tr>
                <th>Producto</th>
                <th>Precio Unitario</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {resumen.map((item, index) => (
                <tr key={`${item.id}-${index}`}>
                  <td>{item.nombre}</td>
                  <td>${item.precio.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.precio * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <h4>Total: <span className="text-success">${total}</span></h4>
            <button className="btn btn-primary" onClick={generatePDF}>
              📄 Descargar Factura
            </button>
          </div>
        </>
      ) : (
        <div className="text-center mt-5">
          <p className="text-muted">No hay productos en tu pedido.</p>
        </div>
      )}
    </div>
  );
};

export default Pedidos;
