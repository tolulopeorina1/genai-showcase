import Image from "next/image";
import logo from "@/public/images/cil-logo.png";

import awsPartner from "@/public/images/aws-partner.png";
export default function HeaderComponent({ header }: { header: string }) {
  return (
    <header className=" flex-col md:flex md:flex-row bg-gray-slate-200 py-4 flex justify-between items-center border-b border-solid border-b-gray-slate-100 px-8">
      <h1 className=" text-black-slate-900 font-semibold text-xl">{header}</h1>
      <div className=" flex gap-x-4 items-center">
        <Image src={logo} alt="logo" width={38} height={38} />
        <Image src={awsPartner} alt="logo" width={38} height={38} />
      </div>
    </header>
  );
}
