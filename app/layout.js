import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import "../styles/professional.css";
import "../styles/global.css";
import "../styles/enhanced.css";
import "../styles/animations.css";
import Sidebar from "../components/Layout/Sidebar";

export const metadata = {
  title: "Scooter Service - Professional Dashboard",
  description: "Enterprise-grade scooter service management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="el">
      <body>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
