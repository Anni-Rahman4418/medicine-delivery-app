"""Request/response models used by the routers."""

from typing import List, Optional
from pydantic import BaseModel


class UserRegisterSchema(BaseModel):
    name: str
    email: str
    password: str = "123456"
    role: str = "customer"
    pharmacyName: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None


class UserLoginSchema(BaseModel):
    email: str
    password: str


class MedicineSchema(BaseModel):
    name: str
    description: str
    price: float
    category: str
    manufacturer: Optional[str] = None
    imageUrl: str
    stock: int = 10
    requiresPrescription: bool = False
    pharmacyId: str = "user-2"
    pharmacyName: str = "GreenLeaf Pharmacy"
    rating: float = 5.0


class MedicineUpdateSchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    manufacturer: Optional[str] = None
    imageUrl: Optional[str] = None
    stock: Optional[int] = None
    requiresPrescription: Optional[bool] = None
    pharmacyName: Optional[str] = None
    rating: Optional[float] = None


class PrescriptionSchema(BaseModel):
    userId: str
    userName: str
    imageUrl: str


class PrescriptionStatusUpdateSchema(BaseModel):
    status: str  # "Approved" | "Rejected" | "Pending"
    notes: Optional[str] = None


class OrderSchema(BaseModel):
    userId: str
    userName: str
    userAddress: str
    userPhone: str
    items: List[dict]
    prescriptionId: Optional[str] = None
    subtotal: float
    deliveryFee: float
    totalAmount: float
    paymentMethod: str
    status: str = "Placed"
    estimatedDeliveryTime: str = "45 mins"


class OrderStatusUpdateSchema(BaseModel):
    status: str


class PaymentSchema(BaseModel):
    orderId: str
    paymentMethod: str
    amount: float
