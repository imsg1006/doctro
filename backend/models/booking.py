from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.orm import relationship
from models.base import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    slot_id = Column(Integer, ForeignKey("slots.id"))
    patient_id = Column(Integer, ForeignKey("users.id"))
    payment_id = Column(String, nullable=True)
    meet_link = Column(String, nullable=True)

    slot = relationship("Slot")
