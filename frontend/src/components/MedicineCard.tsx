import React from 'react';
import { Medicine } from '../types';
import { useApp } from '../context/AppContext';
import { CartIcon } from './Icons';

export const MedicineCard: React.FC<{ medicine: Medicine }> = ({ medicine }) => {
  const { addToCart, setSelectedMedicineDetail } = useApp();

  return (
    <div className="glass-card animate-fade-in" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{ height: 160, cursor: 'pointer', overflow: 'hidden' }}
        onClick={() => setSelectedMedicineDetail(medicine)}
      >
        <img
          src={medicine.imageUrl}
          alt={medicine.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <span className={`badge ${medicine.requiresPrescription ? 'badge-rx' : 'badge-otc'}`}>
            {medicine.requiresPrescription ? 'Rx Required' : 'OTC'}
          </span>
          <span className="badge badge-info">{medicine.category}</span>
        </div>

        <h3
          style={{ fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}
          onClick={() => setSelectedMedicineDetail(medicine)}
        >
          {medicine.name}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', flex: 1 }}>
          {medicine.description.length > 70 ? medicine.description.slice(0, 70) + '...' : medicine.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>${medicine.price.toFixed(2)}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{medicine.pharmacyName}</span>
        </div>

        <button
          className="btn btn-primary btn-sm"
          style={{ marginTop: 8 }}
          onClick={() => addToCart(medicine)}
          disabled={medicine.stock <= 0}
        >
          <CartIcon size={15} /> {medicine.stock <= 0 ? 'Out of stock' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
};
