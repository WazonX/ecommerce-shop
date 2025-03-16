import type { Metadata } from "next";
import "./globals.css";
import Navbar from './Common/Navbar/Navbar'

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
    <html lang="pl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="">
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
