# backend/app/crypto_utils.py

from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes
import base64

SECRET_KEY = get_random_bytes(16)  # AES key (16 bytes for AES-128)
IV = get_random_bytes(16)  # Initialization vector

def encrypt_data(data: str) -> str:
    cipher = AES.new(SECRET_KEY, AES.MODE_CBC, IV)
    padded_data = pad(data.encode(), AES.block_size)
    encrypted_data = cipher.encrypt(padded_data)
    return base64.b64encode(encrypted_data).decode('utf-8')

def decrypt_data(encrypted_data: str) -> str:
    cipher = AES.new(SECRET_KEY, AES.MODE_CBC, IV)
    encrypted_data_bytes = base64.b64decode(encrypted_data)
    decrypted_data = unpad(cipher.decrypt(encrypted_data_bytes), AES.block_size)
    return decrypted_data.decode('utf-8')
