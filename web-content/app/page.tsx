import Image from "next/image";
import logo from "@/public/images/logo.png";
import Link from "next/link";

const homepageItems = [
  {
    text: "Automated Fraud Detection and Prevention",
    link: "/features/fraud-detection",
  },
  {
    text: "Personalized Financial Advice and Wealth Management",
    link: "/features/financial-advice",
  },
  {
    text: "Dynamic Content Generation for Marketing Campaigns",
    link: "/features/marketing-content",
  },
  {
    text: "AI Inventory Management and Demand Forecasting",
    link: "/features/ai-inventory",
  },
  {
    text: "Virtual Try-On and Personalized Shopping Experiences",
    link: "/features/vr",
  },
  { text: "Automated Document Processing and Summarization", link: "/" },
  { text: "Employee Training and Onboarding with AI Tutors", link: "/" },
  { text: "Predictive Maintenance for Operational Efficiency", link: "/" },
  { text: "AI-Driven Compliance and Risk Management", link: "/" },
];
export default function Home() {
  return (
    <div className=" bg-cs-bg font-[family-name:var(--font-jakarta-sans)] min-h-dvh bg-cover bg-top ">
      <main className="p-8">
        <div>
          <Image src={logo} alt="logo" />
        </div>

        <div className=" flex  h-full flex-col justify-between gap-y-12">
          <div className=" text-center">
            <h1 className=" text-black font-medium text-[70px] ">
              CIL Gen AI Solutions for Modern Enterprisers
            </h1>
            <h4>
              Explore 10 Industry-Leading AI Use Cases Designed for Security,
              Efficiency, and Innovation.
            </h4>
          </div>
          <div className=" grid grid-cols-3 gap-4">
            {homepageItems.map((item, index) => (
              <Link
                className=" backdrop-blur-sm bg-white-slate-100/70 border border-solid border-gray-slate-900/8 rounded-[7px] py-[20px] px-[12px] flex items-center justify-center text-black text-[14px] font-medium "
                key={item.text}
                href={item.link}
              >
                {item.text}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
