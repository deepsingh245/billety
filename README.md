# Billety

Billety is a cross‑platform billing and invoicing system built with React, Electron, and Capacitor. It supports desktop (Windows/macOS/Linux) via Electron and mobile (Android) via Capacitor. Billety automatically generates and emails invoices to your clients.

---

## 🚀 Features

- **Cross‑Platform**

  - Desktop app using Electron
  - Android app via Capacitor

- **Client Management**

  - Add, edit, delete clients
  - Store contact info and receivables

- **Invoice Management**

  - Create, update, delete invoices
  - Attach line‑item details (rate by weight or piece)
  - Track statuses: Paid / Unpaid / Partially Paid

- **Automatic Delivery**

  - Scheduled invoice emailing
  - Customizable email templates

- **Real‑Time Sync**

  - Firestore back‑end for real‑time data updates
  - Offline support on mobile

- **Theming & Localization**

  - Light/Dark mode
  - Pluggable language packs

---

## 🛠️ Tech Stack

| Layer          | Technology            |
| -------------- | --------------------- |
| UI Library     | React + TypeScript    |
| Desktop Shell  | Electron              |
| Mobile Shell   | Capacitor (Android)   |
| State & Sync   | Firebase Firestore    |
| Email Delivery | NodeMailer / SendGrid |
| Bundler        | Vite                  |

---

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your‑org/billety.git
   cd billety
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**

   - Copy `firebase.config.example.ts` to `firebase.config.ts`
   - Populate your Firebase project credentials

4. **Configure Email**

   - Copy `.env.example` to `.env`
   - Set SMTP or SendGrid API keys

---

## ⚙️ Development

### Desktop (Electron)

```bash
npm run dev:electron
```

- Spins up a Vite dev server for React UI
- Launches Electron with hot‑reload

### Mobile (Android via Capacitor)

```bash
npm run build
npx cap sync android
npx cap open android
```

- Builds web assets
- Syncs with Capacitor
- Opens Android Studio

### Shared Commands

| Command         | Description                         |
| --------------- | ----------------------------------- |
| `npm run dev`   | Run React in browser (for UI dev)   |
| `npm run build` | Build web assets (production ready) |
| `npm run test`  | Run unit & integration tests        |
| `npm run lint`  | Lint with ESLint + Prettier         |

---

<!-- ## 📂 Project Structure

```
billety/
├── android/                # Capacitor Android project
├── electron/               # Electron main process
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable React components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # Firebase & email utilities
│   ├── store/              # Zustand/Redux state management
│   ├── styles/             # Tailwind & theming
│   ├── App.tsx             # Entry point for React
│   └── main.tsx            # Electron bootstrapper
├── firebase.config.example.ts
├── .env.example
├── package.json
└── README.md
``` -->

---

## 🔒 Security & Permissions

- **Desktop**

  - File‑system access for exports/imports
  - No elevated privileges required

- **Mobile (Android)**

  - Network permission for Firestore & email delivery
  - File‑write permission for PDF exports

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/awesome‐feature`)
3. Commit your changes (`git commit -m "feat: add awesome feature"`)
4. Push to your branch (`git push origin feat/awesome‐feature`)
5. Open a Pull Request

Please follow the [Conventional Commits](https://www.conventionalcommits.org/) style.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Electron](https://www.electronjs.org/)
- [Capacitor](https://capacitorjs.com/)
- [Firebase](https://firebase.google.com/)

Feel free to open issues or reach out on Discord if you need help!
