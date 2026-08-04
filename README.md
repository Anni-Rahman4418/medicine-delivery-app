# MediGo - On-Demand Medicine Delivery Platform 💊🚚

**MediGo** is an end-to-end digital healthcare marketplace connecting customers, local pharmacies, and administrators. Users can search and purchase medicines, upload medical prescriptions for verification, place orders, complete payments, and track live delivery status in real-time.

---

## 🌟 Key Features

### 🛒 Customer Experience
- **Medicine Search & Filtering**: Instant search by name/description and category filtering (Pain Relief, Antibiotics, Allergy, First Aid, etc.).
- **Prescription Upload & Approval**: Securely upload prescription images for prescription-only medicines (`requires_prescription`).
- **Interactive Cart & Checkout**: Real-time total calculation, delivery address input, and prescription validation.
- **Live Order Tracking**: Track order status (Placed ➔ Confirmed ➔ Out for Delivery ➔ Delivered) with estimated delivery time and courier contact.

### 🏥 Pharmacy Management
- **Inventory Control**: Add new medicines, edit details (price, stock, category), and remove products.
- **Prescription Verification**: Review pending customer prescriptions and approve/reject with feedback notes.
- **Order Fulfillment**: Update customer order status as fulfillment progresses.

### 🛡️ Admin Dashboard
- **Platform Analytics**: Total orders, revenue metrics, registered user count, and active inventory stats.
- **User Management**: View and manage customer and pharmacy accounts.
- **Order Overview**: Monitor all platform transactions and delivery statuses.

---

## 🏗️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Lucide Icons, Tailwind CSS |
| **Backend** | Python 3, FastAPI, Uvicorn, SQLite3 |
| **State & API** | React Context API, Axios, LocalStorage Fallback |

---

## 📁 Repository Structure

```
medicine-delivery-app/
├── backend/                  # FastAPI REST API Backend
│   ├── app/
│   │   ├── routers/          # API Route Controllers (auth, medicines, orders, etc.)
│   │   ├── database.py       # SQLite connection, tables schema & seed data
│   │   ├── main.py           # FastAPI application entry point & CORS
│   │   ├── schemas.py        # Pydantic data validation schemas
│   │   └── serializers.py    # Database row to JSON converters
│   ├── requirements.txt      # Python dependencies
│   └── run.py                # Server launcher script
├── frontend/                 # React + TypeScript Frontend Client
│   ├── src/
│   │   ├── components/       # UI Components (Navbar, CartDrawer, Modals, etc.)
│   │   ├── context/          # React Context Provider (AppContext)
│   │   ├── data/             # Initial mock data fallbacks
│   │   ├── services/         # Axios API Client (api.ts)
│   │   └── types/            # TypeScript Interface Definitions
│   └── package.json          # Dependencies & npm scripts
└── doc/                      # Project Specification & Requirement Docs
    └── 1.IDEA & BUSINESS/   # PRD, Stakeholder Analysis, Interviews, Surveys
```

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js (v18+)
- Python (3.9+)

### 1. Run the Backend API Server
```bash
cd backend
pip install -r requirements.txt
python run.py
```
*The FastAPI server will start at `http://localhost:8000`. Swagger documentation is available at `http://localhost:8000/docs`.*

### 2. Run the Frontend App
```bash
cd frontend
npm install
npm run dev
```
*Open your browser and navigate to `http://localhost:5173`.*

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/login` | Authenticate user credentials |
| `POST` | `/api/register` | Register a new customer or pharmacy account |
| `GET` | `/api/medicines` | Fetch all medicines (supports `category` & `search` query parameters) |
| `POST` | `/api/medicines` | Add a new medicine item (Pharmacy/Admin) |
| `PUT` | `/api/medicines/{id}` | Update medicine information |
| `DELETE` | `/api/medicines/{id}` | Remove a medicine item |
| `GET` | `/api/prescriptions` | List user prescriptions |
| `POST` | `/api/prescriptions` | Upload a new prescription image |
| `PUT` | `/api/prescriptions/{id}` | Review prescription status (`Approved`/`Rejected`) |
| `GET` | `/api/orders` | Retrieve order list |
| `POST` | `/api/orders` | Place a new order with prescription verification |
| `PUT` | `/api/orders/{id}` | Update order status |

---

## 👨‍💻 Author & Maintainer

Developed by **Anni-Rahman4418** ([anisharahman12345@gmail.com](mailto:anisharahman12345@gmail.com)).
