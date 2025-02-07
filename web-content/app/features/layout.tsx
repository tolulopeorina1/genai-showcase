'use client';
import { usePathname } from 'next/navigation';
import HeaderComponent from '../components/places/HeaderComponent';
import {
	Breadcrumbs,
	BreadcrumbItem,
	Button,
	Input,
	Select,
	SelectItem,
} from '@heroui/react';
import {
	Cpu,
	Money,
	Box,
	DocumentText,
	UserSquare,
	User,
	CloudConnection,
	AttachCircle,
	Microphone2,
	Send2,
	TableDocument,
	Global,
	Add,
} from 'iconsax-react';
import { models } from '../constants/mock-data';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useAppContext } from '../context/StoreContext';

const wrapperStyle = [
	'bg-white',
	'placeholder:text-gray-slate-400 dark:placeholder:text-white/60',
	'border border-solid border-gray-slate-300 rounded-[168px]',
];
const selectInput = [
	'placeholder:text-black-slate-900',
	'border border-solid border-gray-slate-100 rounded-[168px] bg-gray-slate-200',
];
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	const segments = pathname.split('/').filter(Boolean);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const { appState } = useAppContext();

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedFile(file);
		}
	};

	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};

	const handleClear = () => {
		setSelectedFile(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};
	const getText = (page: string) => {
		switch (true) {
			case page.startsWith('/features/fraud-detection'):
				return 'Automated Fraud Detection and Prevention';
			case page.startsWith('/features/financial-advice'):
				return 'Personalized Financial Advice and Wealth Management';
			case page === '/features/marketing-content':
				return 'Dynamic Content Generation for Marketing Campaigns';
			case page === '/features/marketing-content/response':
				return 'Dynamic Content Generation for Marketing Campaigns';
			case page.startsWith('/features/ai-inventory'):
				return 'AI-Powered Inventory Management and Demand Forecasting';
			case page.startsWith('/features/vr/response'):
				return 'Virtual Try-On and Personalized Shopping Experiences';
			case page === '/features/employee-training':
				return 'Employee Training and Onboarding with AI Tutors';
			case page === '/features/employee-training/response':
				return 'Employee Training and Onboarding with AI Tutors';
			case page === '/features/virtual-tryon':
				return 'Personalized Product Images';
			case page === '/features/employee-training/response':
				return 'Employee Training and Onboarding with AI Tutors';
			case page === '/features/document-processing':
				return 'Automated Document Processing and Summarization';
			case page === '/features/predictive-maintenance':
				return 'Predictive Maintenance for Operational Efficiency';
			case page === '/features/predictive-maintenance/response':
				return 'Predictive Maintenance for Operational Efficiency';
			case page === '/features/ai-compliance':
				return 'AI-Driven Compliance and Risk Management';

			default:
				return 'Page Not Found';
		}
	};
	const getPath = (index: number) => {
		return segments
			.slice(0, index + 1)
			.map((item) => `/${item}`)
			.join('');
	};

	return (
		<div className='flex flex-col max-h-dvh font-[family-name:var(--font-jakarta-sans)] min-h-dvh'>
			{/* <div className=" px-8 bg-gray-slate-200 py-6 flex justify-between items-center border-b border-solid border-b-gray-slate-100">
        <Image src={logo} alt="logo" />
        {pathname !== "/features/vr" && (
          <h4 className=" text-black-slate-900 font-semibold text-2xl">
            {getText(pathname)}
          </h4>
        )}
        <div></div>
      </div> */}
			<>
				<HeaderComponent
					header={'Cecure Intelligence Limited - Gen AI Showcase'}
				/>
				<div className=' px-8 py-1'>
					<Breadcrumbs
						itemClasses={{
							separator: 'px-2',
						}}
						separator='/'
					>
						{/* <BreadcrumbItem className=" text-blue-slate-500 font-medium">
              Home
            </BreadcrumbItem> */}
						{segments.map((item, i) => (
							<BreadcrumbItem
								className={` text-blue-slate-500 font-medium ${
									i === segments.length - 1 &&
									'text-crumb-slate-500'
								} `}
								key={item}
							>
								<Link href={i === 0 ? '/' : getPath(i)}>
									{i === 0
										? 'Home'
										: item === 'response'
										? 'Chat'
										: getText(pathname)}
								</Link>
							</BreadcrumbItem>
						))}
					</Breadcrumbs>
				</div>
			</>

			<div className=' px-8 py-4 overflow-y-auto pb-[100px] customScrollBar'>
				<div className=' px-8 mb-3'>{children}</div>
			</div>
		</div>
	);
}
