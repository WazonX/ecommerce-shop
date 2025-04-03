import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./Common/Navbar/Navbar";
import Footer from "./Common/Footer/Footer";
import { AuthProvider } from "./Common/Auth/AuthContext";

export const metadata: Metadata = {
  title: "SSW Shop",
  description: "Project Shop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="caret-transparent min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="@container">
            <div
            className="bg-zinc-900 w-3/4 mx-auto min-h-[75vh] my-5 rounded-lg @max-6xl:p-0 @max-6xl:w-full @max-xl:px-5"
            >
            {children}
            </div>
          </main>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
