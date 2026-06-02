import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RECAFCO Requirement Portal",
  description: "Maintenance system requirement collection portal"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
