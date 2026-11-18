# QueryGen AI - Intelligent Text-to-SQL Studio

> **College Major Project**: AI-Powered Natural Language Database Interface  
> **Frontend Architecture**: React 18, Vite, Modern Modular CSS, JavaScript (ES Modules)  
> **Target Backend**: Python FastAPI, LangChain, PostgreSQL  

---

## 🚀 Quick Start

### 1. Prerequisites
Ensure you have **Node.js (v18+)** and **npm** installed on your system.

### 2. Installation
```bash
# Clone or navigate to the project directory
cd "Major project"

# Install project dependencies
npm install
```

### 3. Launch the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 📁 Project Architecture & Directory Structure

```
Major project/
├── .env                  # Active environment variables
├── .env.example          # Template with VITE_API_BASE_URL
├── .gitignore            # Git exclusion rules
├── index.html            # HTML entry point with Plus Jakarta Sans & JetBrains Mono
├── package.json          # Project metadata and clean scripts
├── vite.config.js        # Vite build configuration (Port 3000)
└── src/
    ├── main.jsx          # React DOM root mounting
    ├── App.jsx           # Main layout router and provider wiring
    ├── index.css         # SaaS design system, light/dark themes, responsive layout
    ├── context/
    │   └── AppContext.jsx # Global state (DB session, history, toasts, active view)
    ├── services/
    │   ├── api.js         # Centralized API service with FastAPI endpoint signatures
    │   └── mockService.js # High-fidelity demo data (schemas, SQL queries, table data)
    ├── components/
    │   ├── layout/
    │   │   ├── Sidebar.jsx   # Collapsible sidebar with quick database telemetry
    │   │   └── TopNavbar.jsx # Top navigation, theme toggle, connection badges
    │   └── common/
    │       ├── Badge.jsx     # Status indicator badges (success, warning, error, info)
    │       ├── Toast.jsx     # Non-blocking animated alert notifications
    │       ├── Modal.jsx     # Accessible dialogs for confirmations & query inspection
    │       ├── SqlViewer.jsx # Syntax-highlighted SQL viewer with Copy & Edit modes
    │       └── DataTable.jsx # Dynamic data table with search, sorting & JS CSV export
    └── pages/
        ├── DashboardPage.jsx          # Welcome hero, metrics, recent query audit log
        ├── WorkspacePage.jsx          # Core NL prompt, prompt chips, SQL generator, data table
        ├── DatabaseConnectionPage.jsx # PostgreSQL configuration, test/connect flows
        ├── SchemaExplorerPage.jsx     # Accordion table tree with PK/FK indicators
        ├── QueryHistoryPage.jsx       # Historical query search, details & reuse actions
        └── SettingsPage.jsx           # Preferences, theme switch, FastAPI backend contract
```

---

## 🔌 API Endpoints Contract (For Backend Team)

The frontend's [`src/services/api.js`](file:///c:/Users/HP/Desktop/Major%20project/src/services/api.js) is already pre-configured to communicate with the FastAPI backend at `VITE_API_BASE_URL`:

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/api/v1/database/test` | `POST` | Validates host, port, credentials without keeping connection open |
| `/api/v1/database/connect` | `POST` | Establishes connection pool and returns database session metadata |
| `/api/v1/database/disconnect` | `POST` | Safely terminates database connection pool |
| `/api/v1/database/schema` | `GET` | Returns introspected tables, columns, datatypes, PKs, and FKs |
| `/api/v1/query/generate` | `POST` | Accepts `{ prompt: string }` and returns LLM-generated SQL + explanation |
| `/api/v1/query/execute` | `POST` | Accepts `{ sql: string }`, validates read-only safety, executes, and returns rows |
| `/api/v1/query/history` | `GET` | Returns persistent user execution history |

---

## 🔒 Security & Usability Guardrails

1. **Zero Credential Persistence**: Database passwords are never committed to `localStorage`, `sessionStorage`, or logs.
2. **Separation of Concerns**: SQL generation and SQL execution are strictly two distinct actions. Queries are never auto-executed without explicit user review.
3. **Safety Sandbox**: Queries are visually labeled as Read-Only `SELECT` operations.
4. **Interactive Demo Mode**: All 5 sample prompts and arbitrary custom prompts generate valid PostgreSQL queries and dynamic result tables with CSV export directly in the browser.
