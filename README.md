# NephroGuard — Bedside Mobile Nurse App (`Graduation-Project-Mobile`)

> **Platform Hub:** [`NephroGuard.vercel.app`](https://nephroguard.vercel.app)  
> **Related Repositories:**  
> - **Desktop Workstation:** [`AhmedNasser-bug/Graduation-Project-Desktop`](https://github.com/AhmedNasser-bug/Graduation-Project-Desktop)  
> - **Backend Engine (`.NET 9`):** [`xByteA/Graduation-Project-Backend`](https://github.com/xByteA/Graduation-Project-Backend)  
> - **Master Documentation Hub:** [`xByteA/Graduation-Project-Documentation`](https://github.com/xByteA/Graduation-Project-Documentation)

Offline-first hemodialysis bedside nurse application built with **React 18 + Vite 6 + TypeScript + Tailwind CSS + `sql.js` (in-browser SQLite WASM)** and **Capacitor 8 Android**.

---

## Option 1 — One-Command Native Setup (`Node >= 20`)

**Windows (PowerShell):**

```powershell
git clone https://github.com/AhmedNasser-bug/Graduation-Project-Mobile.git
cd Graduation-Project-Mobile
.\setup.ps1 -Dev
```

**macOS / Linux:**

```bash
git clone https://github.com/AhmedNasser-bug/Graduation-Project-Mobile.git
cd Graduation-Project-Mobile
chmod +x setup.sh
./setup.sh --dev
```

Then open **`http://localhost:5173`** in Chrome/Edge (toggle DevTools mobile view `390x844` for the full bedside phone frame).

Verify TypeScript compilation + Vite production bundle without starting the server:

```powershell
.\setup.ps1 -VerifyOnly
```

---

## Option 2 — Docker Container (Zero Host Node Install)

```bash
docker build -t nephroguard-mobile .
docker run --rm -p 5173:80 nephroguard-mobile
```

*(If Docker Compose is installed, `docker compose up --build` also runs directly.)*

---

## Option 3 — Android Studio / APK Sync (Capacitor)

```bash
npm ci && npm run build
npx cap sync android
npx cap open android
```

---

## Environment Configuration (Optional)

The mobile prototype runs **100% locally offline** by default using embedded `sql.js` (`public/sql-wasm.wasm`) and browser `BroadcastChannel` / local SSE telemetry.  
To connect optional Firebase Cloud telemetry overrides, copy `.env.example` to `.env.local` and supply your project keys (never commit `.env` or `.env.local`).
