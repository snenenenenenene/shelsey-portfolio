import type { Metadata } from "next";
import "./globals.css";
import SmoothScrolling from "./components/SmoothScrolling";

export const metadata: Metadata = {
  title: "Shelsey Portfolio",
  description: "Shelsey Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-screen h-screen overflow-x-hidden">
        <SmoothScrolling>
          {children}
        </SmoothScrolling>
      </body>
    </html>
  );
}
