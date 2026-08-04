# MediGo frontend

React 18 + TypeScript + Vite. Structured the same way as the FashionPanda
frontend:

```
frontend/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
└── src/
    ├── main.tsx           # entry point
    ├── App.tsx            # layout + view switcher (marketplace/pharmacy/admin)
    ├── index.css          # design tokens + shared utility classes
    ├── types/             # shared TS types
    ├── data/mockData.ts   # fallback data used when the backend is offline
    ├── services/api.ts    # talks to the FastAPI backend, falls back to
    │                        localStorage if it can't reach it
    ├── context/AppContext.tsx  # global state: auth, cart, medicines, orders, prescriptions
    └── components/
        ├── Navbar.tsx
        ├── HeroBanner.tsx
        ├── CustomerMarketplace.tsx   # browse/search/filter medicines
        ├── MedicineCard.tsx
        ├── MedicineDetailModal.tsx
        ├── MedicineFormModal.tsx     # pharmacy: add/edit a medicine
        ├── CartDrawer.tsx            # cart + inline checkout
        ├── AuthModal.tsx             # login/register
        ├── PrescriptionModal.tsx     # upload a prescription for review
        ├── OrderTrackerModal.tsx     # order confirmation + live status
        ├── PharmacyManager.tsx       # pharmacy dashboard: inventory + orders
        ├── AdminManager.tsx          # admin: approve prescriptions, manage orders/users
        └── Icons.tsx
```

## Running it

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173` and expects the backend at
`http://localhost:8000` (see `../backend/README.md`). If the backend isn't
running, the app still works using local mock data / localStorage, so you
can poke around the UI without it - just note that things like the
prescription-approval requirement on checkout only work correctly once the
backend is connected.

Demo accounts (password `123456` for all):
- `anni@medigo.com` - customer
- `contact@greenleaf.com` - pharmacy
- `admin@medigo.com` - admin

## Known gaps / next steps

- Prescription upload takes an image **URL**, not an actual file - there's
  no file storage backing this yet.
- No real payment integration - checkout always "succeeds".
- No client-side route guarding on the pharmacy/admin views - anyone who
  logs in as that role sees the dashboard, but there's no token-based auth
  behind it. Fine for a prototype, not for anything customer-facing yet.
