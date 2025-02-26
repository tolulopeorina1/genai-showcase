'use client';
import { useEffect, useState } from 'react';
import React from 'react';
import QuickSightEmbed from '@/app/components/places/QuickSightEmbed';

export default function Response() {
	const [url, setUrl] = useState('');

	const handleGenerate = async () => {
		// if (!prompt.trim()) return;
		console.log('Generating');

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
	};
	useEffect(() => {
		handleGenerate();
	}, []);

	return (
		<>
			<div className=''>
				<div className=' px-4 sm:px-6'>
					<div className=' my-[1rem] mx-auto  p-4'>
						<div className='w-full'>
							<QuickSightEmbed quickSightUrl={url} />
							<div className='flex items-center justify-center bg-gray-100 p-4'></div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
