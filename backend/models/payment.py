# from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
# from app.models.base import Base

# class Payment(Base):
#     __tablename__ = "payments"

#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, ForeignKey("users.id"))
#     slot_id = Column(Integer, ForeignKey("slots.id"))
#     razorpay_order_id = Column(String, nullable=False)
#     razorpay_payment_id = Column(String, nullable=True)
#     is_paid = Column(Boolean, default=False)
