# backend/app/database.py

import psycopg2
from psycopg2.extras import RealDictCursor
from typing import List

DATABASE_URL = "postgresql://user:password@localhost:5432/payment_db"

def get_db_connection():
    connection = psycopg2.connect(DATABASE_URL)
    return connection

def save_payment(card: str, expiration: str, cvv: str, amount: float):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        query = """
        INSERT INTO payments (card_number, expiration_date, cvv, amount)
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (card, expiration, cvv, amount))
        connection.commit()
        cursor.close()
        connection.close()
    except Exception as e:
        raise Exception(f"Error saving payment: {str(e)}")
