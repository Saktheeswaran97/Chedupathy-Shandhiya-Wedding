import type { Metadata, Viewport } from "next";
import { asset } from "@/lib/basePath";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chedupathy & Shandhiya | 16 November 2026",
  description:
    "Join us for the wedding of C. Chedupathy & N. Shandhiya on 16 November 2026. Muhurtham: 6–7:30 AM, Thiruthani. Reception: 7 PM onwards, Anna Nagar, Chennai.",
  openGraph: {
    title: "Chedupathy & Shandhiya — You’re invited",
    description:
      "16 November 2026 · A sacred morning in Thiruthani. A joyful evening in Chennai.",
    type: "website",
    images: [
      {
        url: asset("/photos/chedupathy-shandhiya.jpg"),
        width: 853,
        height: 1280,
        alt: "C. Chedupathy and N. Shandhiya",
      },
    ],
  },
  icons: { icon: asset("/icon.svg") },
};
export const viewport: Viewport = {
  themeColor: "#722f40",
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
