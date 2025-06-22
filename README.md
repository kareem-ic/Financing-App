# Coincise - Personal Finance & Budgeting App

Coincise is a modern, responsive web application designed to help young adults and college students take control of their financial lives. It provides intuitive tools for budgeting, goal tracking, and personalized financial advice through an intelligent AI assistant.

## ✨ Features

- **Interactive Budget Calculator**: Implements the 50/30/20 rule to help users allocate their monthly income into needs, wants, and savings.
- **Dynamic Goal Tracking**: Users can create, update, delete, and filter financial goals (e.g., saving for a new laptop, building an emergency fund). Progress is visually tracked with progress bars.
- **AI Financial Assistant**: An intelligent chatbot that provides personalized financial advice by learning about the user's habits, goals, and financial situation. User data is stored locally for a persistent, tailored experience.
- **Secure User Authentication**: Full login, sign-up, and logout functionality using Firebase Authentication, ensuring user data is secure.
- **Multi-Page Interface**: A clean and modern multi-page layout including Home, About, Budget Calculator, Goals, and Contact pages.
- **Fully Responsive Design**: A mobile-first design that works beautifully across all devices, from desktops to smartphones.

## 🛠️ Tech Stack

- **Frontend**:
  - **Framework**: React
  - **Language**: TypeScript
  - **Build Tool**: Vite
  - **Styling**: CSS (with modern layout techniques like Flexbox and Grid)
  - **Routing**: React Router
- **Backend**:
  - **Framework**: FastAPI
  - **Language**: Python
- **Database & Authentication**:
  - **Service**: Google Firebase
  - **Products**: Firebase Authentication, Firestore
- **AI Integration**:
  - **Service**: OpenAI API (GPT-4)

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [Python](https://www.python.org/) (v3.8 or later) & `pip`

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Financing-App.git
cd Financing-App
```

### 2. Frontend Setup

Navigate to the `frontend` directory and install the necessary dependencies.

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory and add your Firebase project configuration keys.

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

To run the frontend development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### 3. Backend Setup

Navigate to the `backend` directory and install the Python dependencies.

```bash
cd ../backend
pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory. Add your OpenAI API key and the path to your Firebase service account credentials.

```env
# Your secret key from OpenAI
OPENAI_API_KEY=your_openai_api_key

# Path to the JSON file with your Firebase service account credentials
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/firebase-credentials.json
```

To run the backend development server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at `http://localhost:8000`.