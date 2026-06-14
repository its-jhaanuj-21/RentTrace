# 🏠 RentTrace (Rent Tracker & Utility Ledger)

RentTrace is a modern, premium fullstack utility tracking and rent ledger system designed to simplify rent management. By combining custom billing configurations, dynamic consumption tracking, and verified receipt generation with digital payment proofs, RentTrace brings clarity, convenience, and transparency to landlords and tenants alike.

The application features a sleek, dark-themed responsive user interface built with **React** and **Vanilla CSS** on the frontend, and a robust REST API powered by **Express.js**, **Node.js**, and **MongoDB** on the backend.

---

## ✨ Core Features

*   **📊 Utility Flow Overview (Dashboard):** A comprehensive visual dashboard showing billing summaries, outstanding dues, payment status metrics, and quick action links.
*   **⚡ Smart Utility consumption Tracking:** Calculate electricity bills automatically based on previous and current meter readings using customized rates.
*   **📷 Camera Proof Integration:** Utilize integrated device cameras via HTML5 Canvas to capture instant image proofs of physical meter readings and payment success screens.
*   **💰 Custom Expense Logger:** Seamlessly log additional custom utility costs such as LPG gas cylinder refills, Wi-Fi bills, water jars, and other custom amenities.
*   **🧾 Verified Invoices & Archives:** Generate detailed downloadable and printable billing statements/receipts complete with payment breakdowns, UPI information, landlord digital signature details, and payment screenshot proof attachments.
*   **⚙️ Setup & Rates Config (Settings):** Easily update default house rent, electricity per-unit rates, base water rates, custom service listings, landlord name, and landlord UPI ID for QR code payment generation.
*   **👤 Premium Profile & Security:** Secure JWT-based registration and authentication system with personal profile customizations (credentials, contact details, profile avatar).

---

## 🛠️ Technology Stack

RentTrace is built on the MERN stack with modern developer tooling:

### Frontend
*   **Library:** React.js (v19)
*   **Bundler:** Vite
*   **Styling:** Vanilla CSS (curated harmonious dark theme with glassmorphism effects)
*   **Libraries:** `html2canvas` (for receipt screenshot capture and export)

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB & Mongoose ORM
*   **Security & Auth:** JSON Web Tokens (JWT) & bcryptjs (password hashing)
*   **Development Tools:** Nodemon (auto-reload)

---

## 📂 Project Structure

```text
RentTrace/
├── backend/                  # Node.js + Express API
│   ├── config/               # Database configurations (MongoDB Connection)
│   ├── middleware/           # JWT Authentication Middlewares
│   ├── models/               # Mongoose Schemas (User, Settings, Payment)
│   ├── routes/               # API Routes (Auth, Settings, Payments)
│   ├── server.js             # Main server entrypoint
│   └── package.json          # Backend dependencies & scripts
│
├── frontend/                 # React + Vite Client
│   ├── public/               # Static assets & Manifest files
│   ├── src/
│   │   ├── assets/           # SVG/Image assets
│   │   ├── components/       # UI Components
│   │   │   ├── About.jsx            # System and developer info screen
│   │   │   ├── AddExpenseForm.jsx   # Custom utility logs
│   │   │   ├── AddPaymentForm.jsx   # Calculate rent & electricity bills
│   │   │   ├── Auth.jsx             # Login & Registration views
│   │   │   ├── CameraModal.jsx      # Device camera capture interface
│   │   │   ├── Dashboard.jsx        # Overview statistics & actions
│   │   │   ├── MobileSettingsHub.jsx# Mobile responsive setup navigation
│   │   │   ├── PaymentHistory.jsx   # Transaction ledger history
│   │   │   ├── Profile.jsx          # Profile details & avatar editor
│   │   │   ├── ReceiptModal.jsx     # Invoice builder & receipt exporter
│   │   │   ├── Settings.jsx         # House and utility rate settings
│   │   │   └── Sidebar.jsx          # Sidebar navigation layout
│   │   ├── App.css           # Global layout styles
│   │   ├── index.css         # Reset & CSS utility variables
│   │   ├── App.jsx           # Main state controller & router
│   │   └── main.jsx          # Application mounting point
│   ├── vite.config.js        # Vite build configurations
│   └── package.json          # Frontend dependencies & scripts
│
├── package.json              # Monorepo/Root execution scripts
└── README.md                 # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (v16+ recommended)
*   [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas URI)

### Installation Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/its-jhaanuj-21/RentTrace.git
    cd RentTrace
    ```

2.  **Install all dependencies:**
    Run the following command at the root directory to install packages for both the backend and frontend simultaneously:
    ```bash
    npm run install-all
    ```

3.  **Environment Variable Setup:**
    Create a `.env` file in the `backend` and `frontend` directories based on the respective `.env.example` templates.

    *   **Backend (`backend/.env`):**
        ```env
        PORT=5000
        MONGODB_URI=mongodb://127.0.0.1:27017/rent_tracker
        FRONTEND_URL=http://localhost:5173
        NODE_ENV=development
        JWT_SECRET=your_jwt_secret_token_here
        ```

    *   **Frontend (`frontend/.env`):**
        ```env
        VITE_API_URL=http://localhost:5000/api
        ```

4.  **Run the Applications:**
    You can run the frontend and backend servers concurrently from the root directory using individual commands:
    *   To run the backend server (runs on `http://localhost:5000`):
        ```bash
        npm run backend
        ```
    *   To run the frontend client (runs on `http://localhost:5173`):
        ```bash
        npm run frontend
        ```

---

## 📜 API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/signup` | Registers a new tenant/user account | No |
| **POST** | `/api/auth/login` | Authenticates user credentials & returns a JWT | No |
| **PUT** | `/api/auth/profile` | Updates user details, password, and avatar | Yes |
| **GET** | `/api/settings` | Fetches tenant-configured utility rates & landlord info | Yes |
| **POST** | `/api/settings` | Updates configuration options | Yes |
| **POST** | `/api/settings/reset` | Resets settings to empty system defaults | Yes |
| **GET** | `/api/payments` | Retrieves all payment/ledger records | Yes |
| **POST** | `/api/payments` | Records a new payment/utility receipt entry | Yes |
| **DELETE** | `/api/payments/:id` | Deletes a payment/ledger entry by ID | Yes |
| **GET** | `/health` | Server health check endpoint | No |

---

## 👤 Developer

**Anuj Kumar Jha**
*   Email: [anujjha2106@gmail.com](mailto:anujjha2106@gmail.com)
*   LinkedIn: [itsjhaanuj21](https://www.linkedin.com/in/itsjhaanuj21/)
*   GitHub: [its-jhaanuj-21](https://github.com/its-jhaanuj-21)
*   X / Twitter: [@its_jhaanuj_21](https://x.com/its_jhaanuj_21)

---

## 📄 License
This project is licensed under the MIT License.
