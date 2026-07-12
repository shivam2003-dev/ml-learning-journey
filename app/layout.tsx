import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "ML Learning Journey",
  description: "A gamified, project-first machine learning roadmap.",
  metadataBase: new URL("https://ml.shivam2003.com"),
  manifest: "/manifest.webmanifest",
  openGraph: { title: "ML Learning Journey", description: "Master machine learning, one project at a time.", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
