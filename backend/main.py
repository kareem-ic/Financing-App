import os
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import openai
import firebase_admin
from firebase_admin import credentials, auth, firestore
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")
cred = credentials.Certificate(os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))
firebase_admin.initialize_app(cred)
db = firestore.client()

app = FastAPI()

# Allow CORS for frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/ai-chat")
async def ai_chat(request: Request):
    data = await request.json()
    user_message = data.get("message")
    id_token = data.get("idToken")
    chat_history = data.get("history", [])

    if not user_message or not id_token:
        raise HTTPException(status_code=400, detail="Missing message or idToken")

    # Verify Firebase token
    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token["uid"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Firebase token")

    # Fetch user data from Firestore
    user_doc = db.collection("users").document(uid).get()
    user_data = user_doc.to_dict() if user_doc.exists else {}

    # Compose prompt for GPT-4
    system_prompt = (
        "You are a high-IQ financial advisor for students and young adults. "
        "Give actionable, personalized advice based on the user's goals, budget, and profile. "
        "If the user asks for a goal analysis or budget review, use their data to provide insights and suggestions."
    )
    context = f"User data: {user_data}\n"
    messages = [{"role": "system", "content": system_prompt + context}]
    for msg in chat_history:
        messages.append(msg)
    messages.append({"role": "user", "content": user_message})

    # Call OpenAI GPT-4
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messages,
        max_tokens=500,
        temperature=0.7,
    )
    ai_reply = response.choices[0].message["content"]

    return {"reply": ai_reply} 