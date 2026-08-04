import React from 'react';
import { useApp } from '../context/AppContext';
import { CartIcon, UserIcon, PillIcon, BellIcon } from './Icons';

export const Navbar: React.FC = () => {
  const { currentUser, cart, orders, setActiveOrder, setIsCartOpen, setIsAuthOpen, logout, activeView, setActiveView, isBackendOnline } = useApp();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const latestActiveOrder = orders.find((o) => o.status !== 'Delivered' && o.status !== 'Cancelled');

  return (
    <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 50, padding: '14px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setActiveView('marketplace')}>
          <PillIcon size={26} color="var(--accent-teal)" />
          <span className="font-serif" style={{ fontWeight: 800, fontSize: '1.4rem' }}>MediGo</span>
          <span
            title={isBackendOnline ? 'Backend connected' : 'Running on local fallback data'}
            style={{
              width: 8, height: 8, borderRadius: '50%',
              background: isBackendOnline ? 'var(--accent-green)' : 'var(--accent-amber)',
              marginLeft: 4,
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {currentUser?.role === 'pharmacy' && (
            <button
              className={`btn btn-sm ${activeView === 'pharmacy' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveView('pharmacy')}
            >
              My Pharmacy
            </button>
          )}
          {currentUser?.role === 'admin' && (
            <button
              className={`btn btn-sm ${activeView === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveView('admin')}
            >
              Admin
            </button>
          )}
          {(currentUser?.role === 'pharmacy' || currentUser?.role === 'admin') && (
            <button
              className={`btn btn-sm ${activeView === 'marketplace' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveView('marketplace')}
            >
              Marketplace
            </button>
          )}

          {activeOrdersCount > 0 && (
            <button
              className="btn btn-icon btn-secondary"
              title="Track active order"
              onClick={() => latestActiveOrder && setActiveOrder(latestActiveOrder)}
              style={{ position: 'relative' }}
            >
              <BellIcon size={18} color="var(--accent-teal)" />
              <span style={{
                position: 'absolute', top: -4, right: -4, background: 'var(--accent-amber)', color: '#04140f',
                borderRadius: '50%', width: 18, height: 18, fontSize: 11, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {activeOrdersCount}
              </span>
            </button>
          )}

          <button className="btn btn-icon btn-secondary" onClick={() => setIsCartOpen(true)} style={{ position: 'relative' }}>
            <CartIcon size={18} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4, background: 'var(--accent-teal)', color: '#04140f',
                borderRadius: '50%', width: 18, height: 18, fontSize: 11, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {cartCount}
              </span>
            )}
          </button>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <UserIcon size={16} /> {currentUser.name.split(' ')[0]}
              </div>
              <button className="btn btn-sm btn-secondary" onClick={logout}>Log out</button>
            </div>
          ) : (
            <button className="btn btn-sm btn-primary" onClick={() => setIsAuthOpen(true)}>Sign In</button>
          )}
        </div>
      </div>
    </nav>
  );
};
