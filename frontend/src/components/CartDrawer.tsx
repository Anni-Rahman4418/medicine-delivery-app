import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CloseIcon, PlusIcon, MinusIcon, TrashIcon, RxIcon } from './Icons';
import { Order } from '../types';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen, setIsCartOpen, cart, updateCartQuantity, removeFromCart, cartTotal,
    cartRequiresPrescription, myApprovedPrescription, currentUser, setIsAuthOpen,
    setIsPrescriptionModalOpen, placeOrder, showToast,
  } = useApp();

  const [address, setAddress] = useState(currentUser?.address || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('Cash on Delivery');
  const [isPlacing, setIsPlacing] = useState(false);

  if (!isCartOpen) return null;

  const deliveryFee = 2.5;
  const canCheckout = cart.length > 0 && (!cartRequiresPrescription || myApprovedPrescription) && address && phone;

  const handlePlaceOrder = async () => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    setIsPlacing(true);
    try {
      await placeOrder(paymentMethod, address, phone);
      setIsCartOpen(false);
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Could not place order', 'error');
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ justifyContent: 'flex-end', padding: 0 }} onClick={() => setIsCartOpen(false)}>
      <div
        className="glass animate-fade-in"
        style={{ width: 420, maxWidth: '100%', height: '100vh', padding: 24, overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 className="font-serif" style={{ fontSize: '1.3rem' }}>Your Cart</h2>
          <button className="btn btn-icon btn-secondary" onClick={() => setIsCartOpen(false)}>
            <CloseIcon size={16} />
          </button>
        </div>

        {cart.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>Your cart is empty.</p>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {cart.map((item) => (
                <div key={item.medicine.id} className="glass-card" style={{ padding: 12, display: 'flex', gap: 10 }}>
                  <img src={item.medicine.imageUrl} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.medicine.name}</span>
                      <button onClick={() => removeFromCart(item.medicine.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <TrashIcon size={15} color="var(--text-dim)" />
                      </button>
                    </div>
                    {item.medicine.requiresPrescription && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <RxIcon size={11} /> Rx required
                      </span>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button className="btn btn-icon btn-secondary" style={{ width: 26, height: 26 }} onClick={() => updateCartQuantity(item.medicine.id, item.quantity - 1)}>
                          <MinusIcon size={12} />
                        </button>
                        <span>{item.quantity}</span>
                        <button className="btn btn-icon btn-secondary" style={{ width: 26, height: 26 }} onClick={() => updateCartQuantity(item.medicine.id, item.quantity + 1)}>
                          <PlusIcon size={12} />
                        </button>
                      </div>
                      <span style={{ fontWeight: 700 }}>${(item.medicine.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {cartRequiresPrescription && !myApprovedPrescription && (
              <div className="glass-card" style={{ padding: 14, marginBottom: 16, border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--accent-amber)', marginBottom: 10 }}>
                  This order needs an approved prescription before you can check out.
                </p>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => {
                    if (!currentUser) { setIsAuthOpen(true); return; }
                    setIsPrescriptionModalOpen(true);
                  }}
                >
                  Upload prescription
                </button>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Delivery address</label>
              <input className="form-input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, city" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone number</label>
              <input className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555-0100" />
            </div>
            <div className="form-group">
              <label className="form-label">Payment method</label>
              <select className="form-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as Order['paymentMethod'])}>
                <option>Cash on Delivery</option>
                <option>Credit Card</option>
                <option>Mobile Wallet</option>
              </select>
            </div>

            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: 16, marginTop: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                <span>Subtotal</span><span>${cartTotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                <span>Delivery fee</span><span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', marginBottom: 16 }}>
                <span>Total</span><span>${(cartTotal + deliveryFee).toFixed(2)}</span>
              </div>

              <button className="btn btn-primary" style={{ width: '100%' }} disabled={!canCheckout || isPlacing} onClick={handlePlaceOrder}>
                {isPlacing ? 'Placing order...' : currentUser ? 'Place order' : 'Sign in to check out'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
