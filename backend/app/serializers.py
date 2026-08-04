"""snake_case db columns -> camelCase API responses, in one place."""

import json


def medicine_to_dict(row) -> dict:
    item = dict(row)
    return {
        "id": item["id"],
        "name": item["name"],
        "description": item["description"],
        "price": item["price"],
        "category": item["category"],
        "manufacturer": item["manufacturer"],
        "imageUrl": item["image_url"],
        "stock": item["stock"],
        "requiresPrescription": bool(item["requires_prescription"]),
        "pharmacyId": item["pharmacy_id"],
        "pharmacyName": item["pharmacy_name"],
        "rating": item["rating"],
        "createdAt": item["created_at"],
    }


def prescription_to_dict(row) -> dict:
    item = dict(row)
    return {
        "id": item["id"],
        "userId": item["user_id"],
        "userName": item["user_name"],
        "imageUrl": item["image_url"],
        "status": item["status"],
        "notes": item["notes"],
        "createdAt": item["created_at"],
    }


def order_to_dict(row) -> dict:
    item = dict(row)
    return {
        "id": item["id"],
        "userId": item["user_id"],
        "userName": item["user_name"],
        "userAddress": item["user_address"],
        "userPhone": item["user_phone"],
        "items": json.loads(item["items"]),
        "prescriptionId": item["prescription_id"],
        "subtotal": item["subtotal"],
        "deliveryFee": item["delivery_fee"],
        "totalAmount": item["total_amount"],
        "paymentMethod": item["payment_method"],
        "status": item["status"],
        "estimatedDeliveryTime": item["estimated_delivery_time"],
        "courierName": item["courier_name"],
        "courierPhone": item["courier_phone"],
        "createdAt": item["created_at"],
    }
