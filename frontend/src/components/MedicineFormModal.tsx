import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CloseIcon } from './Icons';
import { Medicine } from '../types';

const CATEGORIES: Medicine['category'][] = ['Pain Relief', 'Antibiotics', 'Allergy', 'Vitamins', 'Diabetes Care', 'Skin Care', 'First Aid'];

const emptyForm = {
  name: '', description: '', price: 0, category: 'Pain Relief' as Medicine['category'],
  manufacturer: '', imageUrl: '', stock: 10, requiresPrescription: false,
};

export const MedicineFormModal: React.FC = () => {
  const { isMedicineFormOpen, setIsMedicineFormOpen, editingMedicine, setEditingMedicine, addMedicine, updateMedicine, currentUser } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingMedicine) {
      setForm({
        name: editingMedicine.name,
        description: editingMedicine.description,
        price: editingMedicine.price,
        category: editingMedicine.category,
        manufacturer: editingMedicine.manufacturer || '',
        imageUrl: editingMedicine.imageUrl,
        stock: editingMedicine.stock,
        requiresPrescription: editingMedicine.requiresPrescription,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingMedicine, isMedicineFormOpen]);

  if (!isMedicineFormOpen) return null;

  const close = () => {
    setIsMedicineFormOpen(false);
    setEditingMedicine(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingMedicine) {
        await updateMedicine(editingMedicine.id, form);
      } else {
        await addMedicine({
          ...form,
          pharmacyId: currentUser?.id || 'user-2',
          pharmacyName: currentUser?.pharmacyName || currentUser?.name || 'GreenLeaf Pharmacy',
          rating: 5.0,
        });
      }
      close();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <button className="btn btn-icon btn-secondary" style={{ position: 'absolute', top: 16, right: 16 }} onClick={close}>
          <CloseIcon size={16} />
        </button>

        <h2 className="font-serif" style={{ fontSize: '1.3rem', marginBottom: 20 }}>
          {editingMedicine ? 'Edit medicine' : 'Add a new medicine'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="form-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" rows={3} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Price ($)</label>
              <input className="form-input" type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })} />
            </div>
            <div className="form-group">
              <label className="form-label">Stock</label>
              <input className="form-input" type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value, 10) })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Medicine['category'] })}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Manufacturer (optional)</label>
            <input className="form-input" value={form.manufacturer} onChange={(e) => setForm({ ...form, manufacturer: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input className="form-input" required value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="checkbox"
              id="rx"
              checked={form.requiresPrescription}
              onChange={(e) => setForm({ ...form, requiresPrescription: e.target.checked })}
              style={{ width: 18, height: 18 }}
            />
            <label htmlFor="rx" style={{ fontSize: '0.9rem' }}>Requires a prescription</label>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : editingMedicine ? 'Save changes' : 'Add medicine'}
          </button>
        </form>
      </div>
    </div>
  );
};
