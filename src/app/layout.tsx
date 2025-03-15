import type { Metadata } from "next";
import "./globals.css";


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
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
