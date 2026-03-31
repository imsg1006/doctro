from db.database import engine
from db.base import Base
from models import user, Slot , booking
 
Base.metadata.create_all(bind=engine)
