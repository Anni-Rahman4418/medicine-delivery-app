import React from 'react';
import { useApp } from '../context/AppContext';
import { PlusIcon, TrashIcon } from './Icons';

export const PharmacyManager: React.FC = () => {
  const { currentUser, medicines, setEditingMedicine, setIsMedicineFormOpen, deleteMedicine, orders } = useApp();

  const myMedicines = medicines.filter((m) => m.pharmacyId === currentUser?.id);
  const myOrders = orders.filter((o) => o.items.some((item) => myMedicines.some((m) => m.id === item.medicineId)));

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="font-serif" style={{ fontSize: '1.6rem' }}>{currentUser?.pharmacyName || currentUser?.name}'s inventory</h1>
        <button className="btn btn-primary" onClick={() => { setEditingMedicine(null); setIsMedicineFormOpen(true); }}>
          <PlusIcon size={16} /> Add medicine
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 40 }}>
        {myMedicines.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>You haven't listed any medicines yet.</p>
        ) : (
          myMedicines.map((m) => (
            <div key={m.id} className="glass-card" style={{ padding: 14 }}>
              <img src={m.imageUrl} alt={m.name} style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }} />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{m.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0' }}>${m.price.toFixed(2)} · {m.stock} in stock</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="btn btn-sm btn-secondary" style={{ flex: 1 }} onClick={() => { setEditingMedicine(m); setIsMedicineFormOpen(true); }}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => deleteMedicine(m.id)}>
                  <TrashIcon size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <h2 className="font-serif" style={{ fontSize: '1.3rem', marginBottom: 16 }}>Orders containing your medicines</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {myOrders.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No orders yet.</p>
        ) : (
          myOrders.map((o) => (
            <div key={o.id} className="glass-card" style={{ padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 700 }}>{o.id}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{o.userName} · {o.items.length} item(s)</p>
              </div>
              <span className="badge badge-info">{o.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
