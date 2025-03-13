import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dig Drip",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
