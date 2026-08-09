import os
import shutil
import time

from fastapi import APIRouter, HTTPException, status, UploadFile, File, Form

from ..database import get_db
from ..schemas import PrescriptionSchema, PrescriptionStatusUpdateSchema
from ..serializers import prescription_to_dict

router = APIRouter(prefix="/prescriptions", tags=["prescriptions"])

UPLOAD_DIR = "uploads/prescriptions"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("")
def get_prescriptions(user_id: str = None):
    conn = get_db()
    cursor = conn.cursor()
    if user_id:
        cursor.execute("SELECT * FROM prescriptions WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
    else:
        cursor.execute("SELECT * FROM prescriptions ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [prescription_to_dict(row) for row in rows]


@router.post("", status_code=status.HTTP_201_CREATED)
def upload_prescription(prescription: PrescriptionSchema):
    conn = get_db()
    cursor = conn.cursor()
    presc_id = f"presc-{int(cursor.execute('SELECT COUNT(*) FROM prescriptions').fetchone()[0]) + 301}"

    cursor.execute(
        "INSERT INTO prescriptions (id, user_id, user_name, image_url, status) VALUES (?, ?, ?, ?, 'Pending')",
        (presc_id, prescription.userId, prescription.userName, prescription.imageUrl)
    )
    conn.commit()
    conn.close()
    # a pharmacist/admin has to approve this before it can be used on an order
    return {"id": presc_id, "status": "Pending", **prescription.dict()}


@router.post("/upload", status_code=status.HTTP_201_CREATED)
def upload_prescription_file(
    userId: str = Form(...),
    userName: str = Form(...),
    file: UploadFile = File(...)
):
    filename = f"{userId}_{int(time.time())}_{file.filename}"
    path = os.path.join(UPLOAD_DIR, filename)
    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    image_url = f"/uploads/prescriptions/{filename}"

    conn = get_db()
    cursor = conn.cursor()
    presc_id = f"presc-{int(cursor.execute('SELECT COUNT(*) FROM prescriptions').fetchone()[0]) + 301}"
    cursor.execute(
        "INSERT INTO prescriptions (id, user_id, user_name, image_url, status) VALUES (?, ?, ?, ?, 'Pending')",
        (presc_id, userId, userName, image_url)
    )
    conn.commit()
    conn.close()
    return {"id": presc_id, "status": "Pending", "imageUrl": image_url}


@router.put("/{prescription_id}")
def review_prescription(prescription_id: str, payload: PrescriptionStatusUpdateSchema):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM prescriptions WHERE id = ?", (prescription_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Prescription not found")

    cursor.execute(
        "UPDATE prescriptions SET status = ?, notes = ? WHERE id = ?",
        (payload.status, payload.notes, prescription_id)
    )
    conn.commit()
    cursor.execute("SELECT * FROM prescriptions WHERE id = ?", (prescription_id,))
    row = cursor.fetchone()
    conn.close()
    return prescription_to_dict(row)
