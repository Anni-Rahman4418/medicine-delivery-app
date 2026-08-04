import React from 'react';
import { useApp } from '../context/AppContext';
import { CloseIcon, CartIcon } from './Icons';

export const MedicineDetailModal: React.FC = () => {
  const { selectedMedicineDetail, setSelectedMedicineDetail, addToCart } = useApp();
  if (!selectedMedicineDetail) return null;
  const medicine = selectedMedicineDetail;

  return (
    <div className="modal-overlay" onClick={() => setSelectedMedicineDetail(null)}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
        <button
          className="btn btn-icon btn-secondary"
          style={{ position: 'absolute', top: 16, right: 16 }}
          onClick={() => setSelectedMedicineDetail(null)}
        >
          <CloseIcon size={16} />
        </button>

        <img
          src={medicine.imageUrl}
          alt={medicine.name}
          style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: 20 }}
        />

        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          <span className={`badge ${medicine.requiresPrescription ? 'badge-rx' : 'badge-otc'}`}>
            {medicine.requiresPrescription ? 'Prescription Required' : 'Over the Counter'}
          </span>
          <span className="badge badge-info">{medicine.category}</span>
        </div>

        <h2 className="font-serif" style={{ fontSize: '1.4rem', marginBottom: 8 }}>{medicine.name}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>{medicine.description}</p>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: 20 }}>
          {medicine.manufacturer && <span>By {medicine.manufacturer}</span>}
          <span>Sold by {medicine.pharmacyName}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 800, fontSize: '1.6rem' }}>${medicine.price.toFixed(2)}</span>
          <button
            className="btn btn-primary"
            disabled={medicine.stock <= 0}
            onClick={() => {
              addToCart(medicine);
              setSelectedMedicineDetail(null);
            }}
          >
            <CartIcon size={16} /> {medicine.stock <= 0 ? 'Out of stock' : 'Add to cart'}
          </button>
        </div>

        {medicine.requiresPrescription && (
          <p style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--accent-amber)' }}>
            This medicine requires an approved prescription before checkout. You'll be asked to upload one at checkout if you don't already have one approved.
          </p>
        )}
      </div>
    </div>
  );
};
