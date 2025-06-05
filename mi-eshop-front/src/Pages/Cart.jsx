import React from 'react';
import { useCart } from '../context/CartContext';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Para tablas en el PDF

export const Cart = () => {
    const { 
        cart, 
        total, 
        removeFromCart, 
        clearCart, 
        showCart, 
        setShowCart,
        cartItemCount 
    } = useCart();

    const generatePDF = () => {
        const doc = new jsPDF();
        
        // Encabezado
        doc.setFontSize(18);
        doc.setTextColor(0, 48, 135); // Color #003087
        doc.text('Factura Esshop', 105, 20, { align: 'center' });
        
        // Detalles de la compra
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        
        const headers = [['Producto', 'Precio Unitario', 'Cantidad', 'Subtotal']];
        const data = cart.map(item => [
            item.nombre,
            `$${item.precio.toFixed(2)}`,
            item.quantity,
            `$${(item.precio * item.quantity).toFixed(2)}`
        ]);

        // Tabla de productos
        doc.autoTable({
            head: headers,
            body: data,
            startY: 30,
            theme: 'grid',
            headStyles: {
                fillColor: [0, 48, 135],
                textColor: 255
            }
        });

        // Total
        doc.setFontSize(14);
        doc.text(`Total a Pagar: $${total}`, 14, doc.autoTable.previous.finalY + 20);
        
        doc.save(`factura-esshop-${new Date().toLocaleDateString()}.pdf`);
    };

    if (!showCart) return null;

    return (
        <div className="position-fixed end-0 top-0 vh-100 p-3 bg-white shadow-lg" 
             style={{ 
                 zIndex: 1000, 
                 width: '350px',
                 overflowY: 'auto'
             }}>
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                <h4 style={{ color: '#003087' }}>
                    🛒 Carrito ({cartItemCount})
                </h4>
                <button 
                    onClick={() => setShowCart(false)} 
                    className="btn btn-sm btn-outline-danger"
                >
                    ×
                </button>
            </div>

            {/* Lista de productos */}
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {cart.length > 0 ? (
                    cart.map(item => (
                        <div key={`${item.id}-${item.quantity}`} 
                             className="d-flex justify-content-between align-items-center mb-3 p-2 border rounded">
                            <div className="d-flex align-items-center">
                                <img 
                                    src={item.img || 'https://via.placeholder.com/50'} 
                                    alt={item.nombre} 
                                    width="50" 
                                    className="me-2 rounded"
                                />
                                <div>
                                    <h6 className="mb-0">{item.nombre}</h6>
                                    <small className="text-muted">
                                        ${item.precio.toFixed(2)} x {item.quantity}
                                    </small>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <span className="me-2 fw-bold">
                                    ${(item.precio * item.quantity).toFixed(2)}
                                </span>
                                <button 
                                    onClick={() => removeFromCart(item.id)}
                                    className="btn btn-sm btn-outline-danger"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-4">
                        <img 
                            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" 
                            width="80" 
                            alt="Carrito vacío"
                        />
                        <p className="text-muted mt-2">Tu carrito está vacío</p>
                    </div>
                )}
            </div>

            {/* Resumen y acciones */}
            {cart.length > 0 && (
                <div className="border-top pt-3">
                    <div className="d-flex justify-content-between mb-3">
                        <h5>Total:</h5>
                        <h5 className="fw-bold" style={{ color: '#003087' }}>
                            ${total}
                        </h5>
                    </div>

                    <div className="d-grid gap-2">
                        <button
                            onClick={generatePDF}
                            className="btn btn-primary"
                        >
                            📄 Generar Factura
                        </button>
                        <button
                            onClick={clearCart}
                            className="btn btn-outline-danger"
                        >
                            Vaciar Carrito
                        </button>
                        <button
                            onClick={() => setShowCart(false)}
                            className="btn btn-outline-secondary"
                        >
                            Seguir Comprando
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};