import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CloseIcon, UploadIcon } from './Icons';

export const PrescriptionModal: React.FC = () => {
  const { isPrescriptionModalOpen, setIsPrescriptionModalOpen, uploadPrescription, showToast } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isPrescriptionModalOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setIsSubmitting(true);
    try {
      await uploadPrescription(file);
      setFile(null);
      setPreviewUrl('');
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
            <label className="form-label">Prescription photo</label>
            <input
              type="file"
              accept="image/*"
              className="form-input"
              required
              onChange={handleFileChange}
            />
          </div>

          {previewUrl && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>Prescription Preview:</p>
              <img
                src={previewUrl}
                alt="Prescription preview"
                style={{ width: '100%', maxHeight: 150, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
          )}

          <button className="btn btn-primary" style={{ width: '100%' }} disabled={isSubmitting || !file}>
            <UploadIcon size={16} /> {isSubmitting ? 'Uploading...' : 'Submit for review'}
          </button>
        </form>
      </div>
    </div>
  );
};
