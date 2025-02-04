"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "@/public/images/logo.png";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const getText = (page: string) => {
    switch (true) {
      case page.startsWith("/features/fraud-detection"):
        return "Automated Fraud Detection and Prevention";
      case page.startsWith("/features/financial-advice"):
        return "Personalized Financial Advice and Wealth Management";
      case page.startsWith("/features/marketing-content"):
        return "Dynamic Content Generation for Marketing Campaigns";
      case page.startsWith("/features/ai-inventory"):
        return "AI-Powered Inventory Management and Demand Forecasting";
      case page.startsWith("/features/vr/response"):
        return "Virtual Try-On and Personalized Shopping Experiences";
      default:
        return "Page Not Found";
    }
  };

  return (
    <div className=" ">
      <div className=" px-8 bg-gray-slate-200 py-6 flex justify-between items-center border-b border-solid border-b-gray-slate-100">
        <Image src={logo} alt="logo" />
        {pathname !== "/features/vr" && (
          <h4 className=" text-black-slate-900 font-semibold text-2xl">
            {getText(pathname)}
          </h4>
        )}
        <div></div>
      </div>

      <div className=" px-8">{children}</div>
      <div className=" text-gray-slate-500 text-lg text-center my-4 mx-8">
        This is an AI-generated advice and not a substitute for a human advisor
      </div>
    </div>
  );
}
