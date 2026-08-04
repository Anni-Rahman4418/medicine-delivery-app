import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CloseIcon, UploadIcon } from './Icons';

export const PrescriptionModal: React.FC = () => {
  const { isPrescriptionModalOpen, setIsPrescriptionModalOpen, uploadPrescription, showToast } = useApp();
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isPrescriptionModalOpen) return null;

  // there's no real file storage wired up in the backend yet, so for now
  // this takes an image URL - swap for an actual file upload once that
  // piece exists (see backend/README.md)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;
    setIsSubmitting(true);
    try {
      await uploadPrescription(imageUrl);
      setImageUrl('');
      setIsPrescriptionModalOpen(false);
    } catch (err) {
      showToast('Could not upload prescription', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsPrescriptionModalOpen(false)}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
        <button className="btn btn-icon btn-secondary" style={{ position: 'absolute', top: 16, right: 16 }} onClick={() => setIsPrescriptionModalOpen(false)}>
          <CloseIcon size={16} />
        </button>

        <h2 className="font-serif" style={{ fontSize: '1.3rem', marginBottom: 8 }}>Upload prescription</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 20 }}>
          A pharmacist will review it. Once approved, you'll be able to check out with prescription-only medicines.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Prescription image URL</label>
            <input
              className="form-input"
              required
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          {imageUrl && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>Prescription Preview:</p>
              <img
                src={imageUrl}
                alt="Prescription preview"
                style={{ width: '100%', maxHeight: 150, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
          )}

          <button className="btn btn-primary" style={{ width: '100%' }} disabled={isSubmitting}>
            <UploadIcon size={16} /> {isSubmitting ? 'Uploading...' : 'Submit for review'}
          </button>
        </form>
      </div>
    </div>
  );
};
