import json

from fastapi import APIRouter, HTTPException, status

from ..database import get_db
from ..schemas import OrderSchema, OrderStatusUpdateSchema
from ..serializers import order_to_dict

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("")
def get_orders():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [order_to_dict(row) for row in rows]


@router.post("", status_code=status.HTTP_201_CREATED)
def create_order(order: OrderSchema):
    conn = get_db()
    cursor = conn.cursor()

    # if any item in the cart needs a prescription, there has to be an
    # approved one attached to the order - otherwise reject it up front
    item_ids = [item.get("id") or item.get("medicineId") for item in order.items]
    if item_ids:
        placeholders = ",".join("?" * len(item_ids))
        cursor.execute(f"SELECT id FROM medicines WHERE id IN ({placeholders}) AND requires_prescription = 1", item_ids)
        needs_prescription = cursor.fetchall()

        if needs_prescription:
            if not order.prescriptionId:
                conn.close()
                raise HTTPException(status_code=400, detail="This order contains prescription-only medicine - a prescription is required")

            cursor.execute("SELECT status FROM prescriptions WHERE id = ?", (order.prescriptionId,))
            presc = cursor.fetchone()
            if not presc or presc["status"] != "Approved":
                conn.close()
                raise HTTPException(status_code=400, detail="The attached prescription hasn't been approved yet")

    order_id = f"ORD-{int(cursor.execute('SELECT COUNT(*) FROM orders').fetchone()[0]) + 7001}"
    cursor.execute("""
        INSERT INTO orders (id, user_id, user_name, user_address, user_phone, items, prescription_id,
                             subtotal, delivery_fee, total_amount, payment_method, status,
                             estimated_delivery_time, courier_name, courier_phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        order_id, order.userId, order.userName, order.userAddress, order.userPhone,
        json.dumps(order.items), order.prescriptionId, order.subtotal, order.deliveryFee,
        order.totalAmount, order.paymentMethod, order.status, order.estimatedDeliveryTime,
        "MediGo Rider", "+1 (555) 900-2200"
    ))
    for item in order.items:
        m_id = item.get("id") or item.get("medicineId")
        qty = item.get("quantity", 1)
        if m_id:
            cursor.execute("UPDATE medicines SET stock = MAX(0, stock - ?) WHERE id = ?", (qty, m_id))

    conn.commit()
    conn.close()
    return {**order.dict(), "id": order_id}


@router.put("/{order_id}")
def update_order_status(order_id: str, payload: OrderStatusUpdateSchema):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE orders SET status = ? WHERE id = ?", (payload.status, order_id))
    conn.commit()
    conn.close()
    return {"id": order_id, "status": payload.status}


@router.delete("/{order_id}")
def cancel_order(order_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE orders SET status = 'Cancelled' WHERE id = ?", (order_id,))
    conn.commit()
    conn.close()
    return {"id": order_id, "status": "Cancelled"}
