'use client';
import {
	Button,
	Input,
	Select,
	SelectItem,
	useDisclosure,
} from '@heroui/react';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import AlertComponent from '@/app/components/places/AlertComponent';
import { loginUserApi } from '@/app/services/userServices';
import { useRouter } from 'next/navigation';
import {
	Add,
	ArrowLeft,
	AttachCircle,
	Cpu,
	Global,
	Microphone2,
	Refresh,
	Send2,
	User,
} from 'iconsax-react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/app/context/StoreContext';
import { models } from '@/app/constants/mock-data';
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

	const toggleNotification = () => {
		setIsOpenRes(!isOpenRes);
	};
	const { appState } = useAppContext();
	const { inputPrompt } = appState.forms;
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const data = Object.fromEntries(new FormData(e.currentTarget));
		// Initialize an empty errors object
		const newErrors: Record<string, string> = {};

		// Check for missing fields and set errors for specific fields
		if (!data.email) newErrors.email = 'Email is required';
		if (!data.password) newErrors.password = 'Password is required';

		// If there are errors, update the state and stop submission
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}
		setLoading(true);

		// Clear errors if validation passes
		setErrors({});

		const payload = {
			email: data.email,
			password: data.password,
		};
		try {
			const loginUser = await loginUserApi(payload);
			if (loginUser?.data?.success) {
				setResponse({
					responseType: 'success',
					responseMessage: 'Login Successful',
				});
				setIsOpenRes(true);
				//route to login
			} else {
				setResponse({
					responseType: 'fail',
					responseMessage: loginUser?.response?.data?.message,
				});
				setIsOpenRes(true);
			}
			if (loginUser?.data?.success) {
				navigate.push('/');
			}
		} catch (error) {
			setLoading(false);
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
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

					<AlertComponent
						isOpenRes={isOpenRes}
						toggleNotification={toggleNotification}
						responseType={response.responseType}
						responseMessage={response.responseMessage}
					/>
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
