import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Agendei — Serviços na palma da mão",
  description: "Agende serviços de beleza e bem-estar com os melhores profissionais da sua região.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Agendei",
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a1210",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-dark-950 text-dark-50 font-body antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#2d1f1a",
                color: "#f8f7f4",
                border: "1px solid rgba(249, 115, 22, 0.2)",
                borderRadius: "12px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
              },
              success: {
                iconTheme: { primary: "#f97316", secondary: "#1a1210" },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
