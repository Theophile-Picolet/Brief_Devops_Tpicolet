import "./globals.css";
import Header from "./component/layout/Header";
import { Share, Puritan, Junge } from "next/font/google";

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
      <body className={`${share.variable} ${puritan.variable} ${junge.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
