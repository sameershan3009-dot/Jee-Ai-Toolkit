import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "JEE AI Toolkit",
  description:
    "A focused AI study dashboard for Class 11 and 12 JEE aspirants with doubt simplification, planners, revision tools, PYQ analysis, and credits.",
  openGraph: {
    title: "JEE AI Toolkit",
    description:
      "AI-assisted JEE preparation tools for doubt simplification, revision, planning, PYQ analysis, and study discipline.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-9379640844971000" />
      </head>
      <body>{children}</body>
    </html>
  );
}
