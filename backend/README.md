# MediGo backend

FastAPI + sqlite, built following the same modular layout used on the
FashionPanda project rather than one big file:

```
backend/
├── run.py                 # entry point, run this
├── requirements.txt
└── app/
    ├── main.py             # creates the app, sets up CORS, mounts the routers
    ├── database.py         # sqlite connection, table creation, seed data
    ├── schemas.py           # pydantic request/response models
    ├── serializers.py       # turns db rows into the camelCase shape the frontend expects
    └── routers/
        ├── auth.py          # /api/register, /api/login
        ├── medicines.py     # /api/medicines - browse/search/CRUD
        ├── prescriptions.py # /api/prescriptions - upload + admin approve/reject
        ├── orders.py        # /api/orders - checkout, blocks orders that need
        │                    #   an approved prescription and don't have one
        ├── payments.py      # /api/payments
        └── users.py         # /api/users
```

## Running it

```bash
pip install -r requirements.txt
python run.py
```

Server comes up on `http://localhost:8000`. It uses a local `medigo.db`
sqlite file, created and seeded with a few sample medicines/users on first
run - delete it for a clean slate.

## A few notes on what's here vs. what's next

- Prescription images are just stored as a URL string (`imageUrl`) for now -
  there's no actual file upload/storage wired up. That's the natural next
  piece to add (e.g. save to disk or S3 and return the URL).
- Payments always succeed - there's no real payment gateway integration yet.
- Auth is deliberately simple (plaintext password match, no JWTs/sessions).
  Fine for prototyping, not for production - swap in proper password
  hashing and token-based auth before this goes anywhere real.
