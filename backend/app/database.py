"""
sqlite connection, schema, and seed data for MediGo.
Kept separate from the routes so the storage layer can be swapped out
later (e.g. for Postgres) without touching any API code.
"""

import sqlite3
import json

DB_PATH = "medigo.db"


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'customer',
            pharmacy_name TEXT,
            address TEXT,
            phone TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS medicines (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            price REAL NOT NULL,
            category TEXT NOT NULL,
            manufacturer TEXT,
            image_url TEXT NOT NULL,
            stock INTEGER NOT NULL DEFAULT 0,
            requires_prescription BOOLEAN DEFAULT 0,
            pharmacy_id TEXT NOT NULL,
            pharmacy_name TEXT NOT NULL,
            rating REAL DEFAULT 5.0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS prescriptions (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            user_name TEXT NOT NULL,
            image_url TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Pending',
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            user_name TEXT NOT NULL,
            user_address TEXT NOT NULL,
            user_phone TEXT NOT NULL,
            items JSON NOT NULL,
            prescription_id TEXT,
            subtotal REAL NOT NULL,
            delivery_fee REAL NOT NULL,
            total_amount REAL NOT NULL,
            payment_method TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Placed',
            estimated_delivery_time TEXT NOT NULL,
            courier_name TEXT,
            courier_phone TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS payments (
            id TEXT PRIMARY KEY,
            order_id TEXT NOT NULL,
            payment_method TEXT NOT NULL,
            amount REAL NOT NULL,
            status TEXT NOT NULL DEFAULT 'Success',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    _seed_if_empty(cursor, conn)
    conn.close()


def _seed_if_empty(cursor, conn):
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        cursor.executemany("""
            INSERT INTO users (id, name, email, password, role, pharmacy_name, address, phone)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, [
            ('user-1', 'Anni Rahman', 'anni@medigo.com', '123456', 'customer', None, '742 Evergreen Terrace', '+1 555-0101'),
            ('user-2', 'GreenLeaf Pharmacy', 'contact@greenleaf.com', '123456', 'pharmacy', 'GreenLeaf Pharmacy', '12 Health Ave', '+1 555-0102'),
            ('user-3', 'MediGo Admin', 'admin@medigo.com', '123456', 'admin', None, 'MediGo HQ', '+1 555-0100'),
        ])

    cursor.execute("SELECT COUNT(*) FROM medicines")
    if cursor.fetchone()[0] == 0:
        cursor.executemany("""
            INSERT INTO medicines (id, name, description, price, category, manufacturer, image_url,
                                    stock, requires_prescription, pharmacy_id, pharmacy_name, rating)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, [
            (
                'med-101', 'Paracetamol 500mg (20 tablets)',
                'For relief of mild to moderate pain and fever.',
                3.99, 'Pain Relief', 'HealWell Pharma',
                'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
                150, 0, 'user-2', 'GreenLeaf Pharmacy', 4.7
            ),
            (
                'med-102', 'Amoxicillin 500mg (10 capsules)',
                'Antibiotic used to treat a number of bacterial infections.',
                8.50, 'Antibiotics', 'CurePoint Labs',
                'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80',
                60, 1, 'user-2', 'GreenLeaf Pharmacy', 4.6
            ),
            (
                'med-103', 'Cetirizine 10mg (10 tablets)',
                'Antihistamine for allergy relief - sneezing, itching, runny nose.',
                4.25, 'Allergy', 'HealWell Pharma',
                'https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=800&q=80',
                90, 0, 'user-2', 'GreenLeaf Pharmacy', 4.8
            ),
        ])

    conn.commit()
