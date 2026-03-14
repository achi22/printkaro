# 🖨️ PrintKaro - Online Print Store

A modern print-on-demand store with PDF upload, Razorpay/UPI payments, and delivery tracking.

---

## 🚀 Quick Start (3 commands)

### Prerequisites
You need **Node.js** installed on your computer.

**Check if you have it:**
```bash
node --version
```
If you see a version number (like `v20.x.x`), you're good! If not, install it:

- **Windows**: Download from https://nodejs.org (click the big green button)
- **Mac**: `brew install node` (or download from https://nodejs.org)
- **Linux**: `sudo apt install nodejs npm`

### Run the store locally

Open your terminal (Command Prompt / PowerShell on Windows, Terminal on Mac/Linux):

```bash
# Step 1: Go into the project folder
cd printkaro-local

# Step 2: Install dependencies (only needed once)
npm install

# Step 3: Start the dev server
npm run dev
```

Your browser will automatically open at **http://localhost:3000** 🎉

---

## 📁 Project Structure

```
printkaro-local/
├── index.html              ← Entry HTML file
├── package.json            ← Dependencies & scripts
├── vite.config.js          ← Dev server config
├── tailwind.config.js      ← Tailwind CSS config
├── postcss.config.js       ← PostCSS config
├── README.md               ← This file
└── src/
    ├── main.jsx            ← React entry point
    ├── index.css           ← Global styles + Tailwind
    └── App.jsx             ← PrintKaro store (all components)
```

## 🧪 What You Can Test

1. **Browse Services** - Click on B&W, Color, or Booklet cards
2. **Upload PDF** - Drag & drop or click to upload any PDF file
3. **Configure Options** - Paper size, copies, binding, single/double sided
4. **Live Pricing** - Watch the price update in real-time
5. **Cart System** - Add multiple items, remove items
6. **Checkout Flow** - Enter address, see delivery charges
7. **Payment Buttons** - Razorpay & UPI buttons (simulated)
8. **Order Tracking** - View sample orders with progress bars

## 🛠️ Useful Commands

| Command           | What it does                              |
|-------------------|-------------------------------------------|
| `npm run dev`     | Start development server (localhost:3000) |
| `npm run build`   | Build for production (creates `dist/`)    |
| `npm run preview` | Preview the production build locally      |

## ❓ Troubleshooting

**"npm is not recognized"**
→ Node.js is not installed. Download from https://nodejs.org

**"Port 3000 already in use"**
→ Change the port in `vite.config.js` or kill the process using port 3000

**Blank page / errors in console**
→ Make sure you ran `npm install` first

---

Built with React + Vite + Tailwind CSS
