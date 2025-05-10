# backend/app/routes.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, condecimal
from backend.utils import decrypt_card_data, process_payment
from app.auth import create_access_token
from fastapi import Depends

router = APIRouter()

# Define a Payment model using Pydantic
class Payment(BaseModel):
    card_number: str
    expiration_date: str
    cvv: str
    amount: condecimal(gt=0)  # Ensure amount is greater than 0

# Define the POST request handler for processing payments
@router.post("/payment")
async def process_payment_request(payment: Payment):
    try:
        # Decrypt card data
        decrypted_card_number = decrypt_card_data(payment.card_number)
        decrypted_expiration_date = decrypt_card_data(payment.expiration_date)
        decrypted_cvv = decrypt_card_data(payment.cvv)

        # Process the payment (you can connect this to a real payment processor)
        success = process_payment(decrypted_card_number, decrypted_expiration_date, decrypted_cvv, payment.amount)

        if success:
            return {"message": "Payment processed successfully"}
        else:
            raise HTTPException(status_code=400, detail="Payment failed")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
        
@router.post("/api/login")
def login(username: str, password: str):
    if username == "admin" and password == "secure123":
        access_token = create_access_token(data={"sub": username})
        return {"access_token": access_token}
    raise HTTPException(status_code=401, detail="Invalid credentials")
