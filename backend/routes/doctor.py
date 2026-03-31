from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime , timezone

from db.deps import get_db
from core.deps import get_current_user
from models.Slot import Slot
from models.booking import Booking

router = APIRouter(prefix="/doctor", tags=["Doctor"])


@router.post("/create-slot")
def create_slot(
    start_time: datetime,
    end_time: datetime,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Only doctors can create slots")

    start_time_naive = start_time.astimezone(timezone.utc).replace(tzinfo=None) if start_time.tzinfo else start_time
    if start_time_naive <= datetime.utcnow():
       raise HTTPException(
        status_code=400,
        detail="Cannot create slot in the past"
    )

    if start_time >= end_time:
        raise HTTPException(status_code=400, detail="Invalid time range")

    slot = Slot(
        doctor_id=current_user.id,
        start_time=start_time,
        end_time=end_time
    )

    db.add(slot)
    db.commit()
    db.refresh(slot)

    return {"message": "Slot created successfully", "slot_id": slot.id}

@router.get("/my-slots")
def get_my_slots(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Only doctors allowed")

    slots = (
        db.query(Slot)
        .filter(Slot.doctor_id == current_user.id)
        .order_by(Slot.start_time)
        .all()
    )

    return slots    

@router.get("/slot-bookings/{slot_id}")
def get_slot_bookings(
    slot_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Only doctors allowed")

    slot = db.query(Slot).filter(Slot.id == slot_id).first()

    if not slot or slot.doctor_id != current_user.id:
        raise HTTPException(status_code=404, detail="Slot not found")

    bookings = (
        db.query(Booking)
        .filter(Booking.slot_id == slot_id)
        .all()
    )

    return bookings

@router.delete("/cancel-slot/{slot_id}")
def cancel_slot(
    slot_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Only doctors allowed")

    slot = db.query(Slot).filter(Slot.id == slot_id).first()

    if not slot or slot.doctor_id != current_user.id:
        raise HTTPException(status_code=404, detail="Slot not found")

    if slot.is_booked:
        raise HTTPException(status_code=400, detail="Cannot cancel a booked slot")

    db.delete(slot)
    db.commit()

    return {"message": "Slot cancelled successfully"}