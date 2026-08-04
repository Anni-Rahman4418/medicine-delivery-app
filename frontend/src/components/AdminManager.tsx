import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { Prescription } from '../types';
import { CheckIcon, CloseIcon, TrashIcon } from './Icons';

export const AdminManager: React.FC = () => {
  const { users, deleteUser, orders, reviewPrescription, updateOrderStatus } = useApp();
  const [allPrescriptions, setAllPrescriptions] = useState<Prescription[]>([]);

  useEffect(() => {
    apiService.getPrescriptions().then(setAllPrescriptions);
  }, []);

  const handleReview = async (id: string, status: 'Approved' | 'Rejected') => {
    await reviewPrescription(id, status);
    setAllPrescriptions((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const pending = allPrescriptions.filter((p) => p.status === 'Pending');

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      <h1 className="font-serif" style={{ fontSize: '1.6rem', marginBottom: 24 }}>Admin dashboard</h1>

      <section style={{ marginBottom: 40 }}>
        <h2 className="font-serif" style={{ fontSize: '1.2rem', marginBottom: 14 }}>
          Prescriptions awaiting review {pending.length > 0 && <span className="badge badge-rx">{pending.length}</span>}
        </h2>
        {pending.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Nothing to review right now.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pending.map((p) => (
              <div key={p.id} className="glass-card" style={{ padding: 14, display: 'flex', gap: 14, alignItems: 'center' }}>
                <img src={p.imageUrl} alt="prescription" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700 }}>{p.userName}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Submitted {new Date(p.createdAt).toLocaleString()}</p>
                </div>
                <button className="btn btn-sm" style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' }} onClick={() => handleReview(p.id, 'Approved')}>
                  <CheckIcon size={14} /> Approve
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleReview(p.id, 'Rejected')}>
                  <CloseIcon size={14} /> Reject
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 className="font-serif" style={{ fontSize: '1.2rem', marginBottom: 14 }}>All orders</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {orders.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No orders yet.</p>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="glass-card" style={{ padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  <p style={{ fontWeight: 700 }}>{o.id}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{o.userName} · ${o.totalAmount.toFixed(2)}</p>
                </div>
                <select
                  className="form-select"
                  style={{ width: 'auto', padding: '6px 12px' }}
                  value={o.status}
                  onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                >
                  <option>Placed</option>
                  <option>Confirmed</option>
                  <option>Packed</option>
                  <option>Out For Delivery</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="font-serif" style={{ fontSize: '1.2rem', marginBottom: 14 }}>Users</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {users.map((u) => (
            <div key={u.id} className="glass-card" style={{ padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: 600 }}>{u.name}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginLeft: 8 }}>{u.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="badge badge-info">{u.role}</span>
                {u.role !== 'admin' && (
                  <button className="btn btn-icon btn-danger" style={{ width: 30, height: 30 }} onClick={() => deleteUser(u.id)}>
                    <TrashIcon size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
