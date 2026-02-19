import type { Metadata } from "next";
import Navbar from "@/components/navbar/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "World News",
  description: "Stay updated with the latest world news from reliable sources.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="children">{children}</div>
      </body>
    </html>
  );
}
