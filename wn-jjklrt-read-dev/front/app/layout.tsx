import "./globals.css";
import { Junge, Puritan, Share } from "next/font/google";
import Header from "./component/layout/Header";

const share = Share({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-share",
});

const puritan = Puritan({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-puritan",
});

const junge = Junge({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-junge",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${share.variable} ${puritan.variable} ${junge.variable}`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
