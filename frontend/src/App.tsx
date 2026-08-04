import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CustomerMarketplace } from './components/CustomerMarketplace';
import { PharmacyManager } from './components/PharmacyManager';
import { AdminManager } from './components/AdminManager';
import { MedicineDetailModal } from './components/MedicineDetailModal';
import { MedicineFormModal } from './components/MedicineFormModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { PrescriptionModal } from './components/PrescriptionModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';

const MainContent: React.FC = () => {
  const { activeView, toast } = useApp();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Navbar />

      {toast && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 200,
            background: toast.type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(15, 29, 26, 0.95)',
            border: `1px solid ${toast.type === 'error' ? 'var(--accent-red)' : 'var(--accent-teal)'}`,
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 'var(--radius-full)',
            boxShadow: 'var(--shadow-glow)',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          {toast.message}
        </div>
      )}

      <main style={{ flex: 1 }}>
        {activeView === 'pharmacy' ? <PharmacyManager /> : activeView === 'admin' ? <AdminManager /> : <CustomerMarketplace />}
      </main>

      <footer className="glass" style={{ marginTop: 'auto', borderTop: '1px solid var(--border-glass)', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <span className="font-serif" style={{ fontWeight: 800, fontSize: '1.2rem' }}>MediGo</span>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: 500 }}>
            Connecting local pharmacies with customers who need their medicines quickly and safely.
          </p>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 8 }}>
            © {new Date().getFullYear()} MediGo. All rights reserved.
          </div>
        </div>
      </footer>

      <MedicineFormModal />
      <MedicineDetailModal />
      <CartDrawer />
      <AuthModal />
      <PrescriptionModal />
      <OrderTrackerModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
