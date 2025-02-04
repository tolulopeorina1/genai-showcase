import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { HeroUIProviders } from "./providers";
const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CecureGPT",
  description:
    "Generative AI (Artificial Intelligence) app by Cecure Intelligence Limited CIL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${jakartaSans.variable} antialiased font-[family-name:var(--font-jakarta-sans)]`}
      >
        <HeroUIProviders>{children}</HeroUIProviders>
      </body>
    </html>
  );
}
