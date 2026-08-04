from typing import Optional

from fastapi import APIRouter, HTTPException, status

from ..database import get_db
from ..schemas import MedicineSchema, MedicineUpdateSchema
from ..serializers import medicine_to_dict

router = APIRouter(prefix="/medicines", tags=["medicines"])


@router.get("")
def get_medicines(category: Optional[str] = None, search: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT * FROM medicines WHERE 1=1"
    params = []
    if category and category != "All":
        query += " AND category = ?"
        params.append(category)
    if search:
        query += " AND (name LIKE ? OR description LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%"])
    query += " ORDER BY created_at DESC"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    return [medicine_to_dict(row) for row in rows]


@router.get("/{medicine_id}")
def get_medicine_by_id(medicine_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM medicines WHERE id = ?", (medicine_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return medicine_to_dict(row)


@router.post("", status_code=status.HTTP_201_CREATED)
def create_medicine(medicine: MedicineSchema):
    conn = get_db()
    cursor = conn.cursor()
    med_id = f"med-{int(cursor.execute('SELECT COUNT(*) FROM medicines').fetchone()[0]) + 101}"

    cursor.execute("""
        INSERT INTO medicines (id, name, description, price, category, manufacturer, image_url,
                                stock, requires_prescription, pharmacy_id, pharmacy_name, rating)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        med_id, medicine.name, medicine.description, medicine.price, medicine.category,
        medicine.manufacturer, medicine.imageUrl, medicine.stock, int(medicine.requiresPrescription),
        medicine.pharmacyId, medicine.pharmacyName, medicine.rating
    ))
    conn.commit()
    conn.close()
    return {**medicine.dict(), "id": med_id}


@router.put("/{medicine_id}")
def update_medicine(medicine_id: str, updates: MedicineUpdateSchema):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM medicines WHERE id = ?", (medicine_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Medicine not found")

    update_dict = updates.dict(exclude_unset=True)
    if not update_dict:
        conn.close()
        return get_medicine_by_id(medicine_id)

    FIELD_MAP = {
        "imageUrl": "image_url",
        "requiresPrescription": "requires_prescription",
        "pharmacyId": "pharmacy_id",
        "pharmacyName": "pharmacy_name",
    }

    set_clauses = []
    params = []
    for key, val in update_dict.items():
        if key == "requiresPrescription" and val is not None:
            val = int(val)

        col_name = FIELD_MAP.get(key, key)
        set_clauses.append(f"{col_name} = ?")
        params.append(val)

    params.append(medicine_id)
    cursor.execute(f"UPDATE medicines SET {', '.join(set_clauses)} WHERE id = ?", params)
    conn.commit()
    conn.close()
    return get_medicine_by_id(medicine_id)


@router.delete("/{medicine_id}")
def delete_medicine(medicine_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM medicines WHERE id = ?", (medicine_id,))
    conn.commit()
    conn.close()
    return {"success": True, "message": f"Medicine {medicine_id} deleted"}
