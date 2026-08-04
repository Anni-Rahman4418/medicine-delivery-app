import React from 'react';
import { useApp } from '../context/AppContext';
import { CloseIcon, TruckIcon, CheckIcon } from './Icons';
import { OrderStatus } from '../types';

const STEPS: OrderStatus[] = ['Placed', 'Confirmed', 'Packed', 'Out For Delivery', 'Delivered'];

export const OrderTrackerModal: React.FC = () => {
  const { activeOrder, setActiveOrder } = useApp();
  if (!activeOrder) return null;

  const currentStepIndex = STEPS.indexOf(activeOrder.status);

  return (
    <div className="modal-overlay" onClick={() => setActiveOrder(null)}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
        <button className="btn btn-icon btn-secondary" style={{ position: 'absolute', top: 16, right: 16 }} onClick={() => setActiveOrder(null)}>
          <CloseIcon size={16} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <TruckIcon size={36} color="var(--accent-teal)" />
          <h2 className="font-serif" style={{ fontSize: '1.3rem', marginTop: 10 }}>Order {activeOrder.id}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Estimated delivery: {activeOrder.estimatedDeliveryTime}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 24 }}>
          {STEPS.map((step, i) => (
            <div key={step} style={{ display: 'flex', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: i <= currentStepIndex ? 'var(--accent-teal)' : 'rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {i <= currentStepIndex && <CheckIcon size={14} color="#04140f" />}
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: 2, flex: 1, minHeight: 24, background: i < currentStepIndex ? 'var(--accent-teal)' : 'rgba(255,255,255,0.08)' }} />
                )}
              </div>
              <div style={{ paddingBottom: 20 }}>
                <span style={{ fontWeight: i === currentStepIndex ? 700 : 500, color: i <= currentStepIndex ? 'var(--text-main)' : 'var(--text-dim)' }}>
                  {step}
                </span>
              </div>
            </div>
          ))}
        </div>

        {activeOrder.courierName && activeOrder.status !== 'Delivered' && activeOrder.status !== 'Cancelled' && (
          <div className="glass-card" style={{ padding: 14, marginBottom: 16 }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Delivery partner</p>
            <p style={{ fontWeight: 700 }}>{activeOrder.courierName}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{activeOrder.courierPhone}</p>
          </div>
        )}

        <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: 14 }}>
          {activeOrder.items.map((item) => (
            <div key={item.medicineId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 6 }}>
              <span>{item.quantity}x {item.name}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, marginTop: 8 }}>
            <span>Total</span><span>${activeOrder.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
