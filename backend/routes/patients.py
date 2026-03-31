from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from datetime import datetime, timezone

from db.deps import get_db
from core.deps import get_current_user
from models.Slot import Slot
from models.booking import Booking

from core.email import fastmail
from fastapi_mail import MessageSchema

router = APIRouter(prefix="/patient", tags=["Patient"])

 
# View Available Slots 
@router.get("/available-slots")
def get_available_slots(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    slots = (
        db.query(Slot)
        .options(joinedload(Slot.doctor))
        .filter(Slot.is_booked == False)
        .filter(Slot.start_time > datetime.utcnow())
        .all()
    )
    
    result = []
    for slot in slots:
        result.append({
            "id": slot.id,
            "start_time": slot.start_time,
            "end_time": slot.end_time,
            "is_booked": slot.is_booked,
            "doctor": {
                "id": slot.doctor.id,
                "name": slot.doctor.name,
                "specialization": slot.doctor.specialization
            } if slot.doctor else None
        })
        
    return result

 
# Book Slot (with Meet + Email) 
@router.post("/book-slot/{slot_id}")
async def book_slot(
    slot_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role != "patient":
        raise HTTPException(status_code=403, detail="Only patients can book slots")

    slot = db.query(Slot).filter(Slot.id == slot_id).first()

    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")

    # Ensure timezone info is stripped for comparison (using naive UTC)
    now = datetime.utcnow()
    slot_time = slot.start_time.replace(tzinfo=None) if slot.start_time.tzinfo else slot.start_time
    
    if slot_time <= now:
        raise HTTPException(
            status_code=400,
            detail="Cannot book expired slot"
        )

    if slot.is_booked:
        raise HTTPException(status_code=400, detail="Slot already booked")

    # Generate Google Meet link
    meet_link = "https://meet.google.com/new"

    slot.is_booked = True

    booking = Booking(
        slot_id=slot.id,
        patient_id=current_user.id,
        meet_link=meet_link
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)
 
    # Send Email Notification 
    message = MessageSchema(
        subject="Doctor Consultation Booking Confirmed",
        recipients=[current_user.email],
        body=f"""
Your consultation is confirmed.

Google Meet Link:
{meet_link}

Please join on time.
""",
        subtype="plain"
    )

    try:
        await fastmail.send_message(message)
    except Exception as e:
        print(f"Failed to send email: {e}")

    return {
        "message": "Slot booked successfully",
        "booking_id": booking.id,
        "meet_link": meet_link
    }

 
# Patient Booking History 
@router.get("/my-bookings")
def my_bookings(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role != "patient":
        raise HTTPException(status_code=403, detail="Only patients allowed")

    bookings = (
        db.query(Booking)
        .filter(Booking.patient_id == current_user.id)
        .all()
    )

    return bookings
