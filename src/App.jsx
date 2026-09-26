import { useState } from 'react';
import { useCart } from './context/CartContext';
import './App.css';

const products = [
  { id: 1, name: 'Wireless Headphones', price: 199.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
  { id: 2, name: 'Smart Watch', price: 299.50, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' },
  { id: 3, name: 'Mechanical Keyboard', price: 149.00, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80' },
  { id: 4, name: 'Gaming Mouse', price: 79.99, image: 'https://images.unsplash.com/photo-1527814050087-379381547969?w=500&q=80' },
];

export default function App() {
  const { state, dispatch } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  // Calculations
  const subtotal = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discountAmount = state.couponApplied ? (subtotal * (state.discountPercentage / 100)) : 0;
  const afterDiscount = subtotal - discountAmount;
  const gst = afterDiscount * 0.18; // 18% GST
  const grandTotal = afterDiscount + gst;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    
    if (state.couponApplied) {
      setCouponError('A coupon is already applied.');
      return;
    }

    if (couponCode.toUpperCase() === 'SAVE20') {
      dispatch({ type: 'APPLY_COUPON', payload: 20 });
    } else if (couponCode.toUpperCase() === 'SAVE50') {
      dispatch({ type: 'APPLY_COUPON', payload: 50 });
    } else {
      setCouponError('Invalid coupon code. Try SAVE20.');
    }
  };

  const handleRemoveCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' });
    setCouponCode('');
    setCouponError('');
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>TechStore Cart</h1>
        <div className="cart-badge">
          🛒 {state.cart.reduce((acc, item) => acc + item.quantity, 0)} Items
        </div>
      </header>

      <main className="main-content">
        {/* Products Section */}
        <section className="products-section">
          <h2>Available Products</h2>
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="price">${product.price.toFixed(2)}</p>
                  <button 
                    className="btn-add"
                    onClick={() => dispatch({ type: 'ADD_TO_CART', payload: product })}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cart Section */}
        <section className="cart-section">
          <h2>Your Cart</h2>
          
          {state.cart.length === 0 ? (
            <div className="empty-cart">Your cart is empty.</div>
          ) : (
            <>
              <div className="cart-items">
                {state.cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>${item.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="item-controls">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity - 1 } })}
                        >-</button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity + 1 } })}
                        >+</button>
                      </div>
                      <button 
                        className="btn-remove"
                        onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="order-summary">
                <h3>Order Summary</h3>
                
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {state.couponApplied && (
                  <div className="summary-row discount">
                    <span>Discount ({state.discountPercentage}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="summary-row">
                  <span>GST (18%)</span>
                  <span>${gst.toFixed(2)}</span>
                </div>
                
                <div className="summary-row total">
                  <span>Grand Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>

                {/* Coupon Code Form */}
                <div className="coupon-section">
                  {state.couponApplied ? (
                    <div className="applied-coupon">
                      <span>✅ Coupon Applied!</span>
                      <button onClick={handleRemoveCoupon} className="btn-remove-coupon">Remove</button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="coupon-form">
                      <input 
                        type="text" 
                        placeholder="Enter Code (e.g. SAVE20)" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <button type="submit" className="btn-apply">Apply</button>
                    </form>
                  )}
                  {couponError && <p className="coupon-error">{couponError}</p>}
                </div>

                <button className="btn-checkout">Proceed to Checkout</button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
