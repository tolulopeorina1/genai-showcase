'use client';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import AlertComponent from '@/app/components/places/AlertComponent';
import { useRouter } from 'next/navigation';
import FooterComponent from '@/app/components/places/Footer';
import QuickSightEmbed from '@/app/components/places/QuickSightEmbed';

export default function Response() {
	const [errors, setErrors] = React.useState({});
	const [loading, setLoading] = useState(false);
	const [isOpenRes, setIsOpenRes] = useState(false);
	const [response, setResponse] = useState({
		responseType: '',
		responseMessage: '',
	});
	const navigate = useRouter();

	const [url, setUrl] = useState('');

	const handleGenerate = async () => {
		// if (!prompt.trim()) return;
		console.log('Generating');

		setLoading(true);
		// Send request to backend
		const response = await fetch(
			'https://y8zhxgsk38.execute-api.us-east-1.amazonaws.com/dev/get-dashboard',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					dashboard_name:
						'AI-Powered Inventory Management and Demand Forecasting',
				}),
			}
		);

		console.log('the response', response);
		const data = await response.json();

		console.log('the data', data.body);
		setUrl(data.body);
		setLoading(false);
	};
	useEffect(() => {
		handleGenerate();
	}, []);

	const wrapperStyle = [
		'bg-white',
		'placeholder:text-gray-slate-400 dark:placeholder:text-white/60',
		'border border-solid border-gray-slate-300 rounded-[168px]',
	];
	const selectInput = [
		'placeholder:text-black-slate-900',
		'border border-solid border-gray-slate-100 rounded-[168px] bg-gray-slate-200',
	];

	return (
		<>
			<div className=''>
				<div className=' px-4 sm:px-6'>
					<div className=' my-[1rem] mx-auto  p-4'>
						<div className='w-full'>
							<QuickSightEmbed quickSightUrl={url} />
							<div className='flex items-center justify-center min-h-screen bg-gray-100 p-4'></div>
						</div>
					</div>

					{/* <AlertComponent
						isOpenRes={isOpenRes}
						toggleNotification={toggleNotification}
						responseType={response.responseType}
						responseMessage={response.responseMessage}
					/> */}
				</div>
			</div>

			<FooterComponent
			// selectedFile={selectedFile}
			// handleClear={handleClear}
			// fileInputRef={fileInputRef}
			// handleFileChange={handleFileChange}
			// handleButtonClick={handleButtonClick}
			// setPrompt={setPrompt}
			// handleGenerate={handleGenerate}
			/>
		</>
	);
}
