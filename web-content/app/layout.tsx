import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { HeroUIProviders } from "./providers";
import { AppProviderComponent } from "./context/StoreContext";
import ScreenSizeChecker from "./components/places/ScreenSizeChecker";
const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
});
const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
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
        className={`${jakartaSans.variable} ${robotoMono.variable} antialiased font-[family-name:var(--font-jakarta-sans)] customScrollBar`}
      >
        <AppProviderComponent>
          <HeroUIProviders>
            <div>
              {children}
              <ScreenSizeChecker />
            </div>
          </HeroUIProviders>
        </AppProviderComponent>
      </body>
    </html>
  );
}
