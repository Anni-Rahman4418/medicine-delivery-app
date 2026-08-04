from fastapi import APIRouter

from ..database import get_db
from ..schemas import PaymentSchema

router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("")
def process_payment(pay: PaymentSchema):
    conn = get_db()
    cursor = conn.cursor()
    pay_id = f"PAY-{int(cursor.execute('SELECT COUNT(*) FROM payments').fetchone()[0]) + 501}"
    cursor.execute(
        "INSERT INTO payments (id, order_id, payment_method, amount, status) VALUES (?, ?, ?, ?, ?)",
        (pay_id, pay.orderId, pay.paymentMethod, pay.amount, "Success")
    )
    conn.commit()
    conn.close()
    # no real payment gateway wired up yet, so this always succeeds
    return {"paymentId": pay_id, "orderId": pay.orderId, "status": "Success"}
