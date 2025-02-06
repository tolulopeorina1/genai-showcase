import React from 'react';

const QuickSightEmbed: React.FC = ({
	quickSightUrl,
}: {
	quickSightUrl?: string;
}) => {
	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100 p-4'>
			<div className='w-full h-[100vh] shadow-lg rounded-lg overflow-hidden'>
				<iframe
					src={quickSightUrl}
					className='w-full h-full border-none'
					allowFullScreen
				></iframe>
			</div>
		</div>
	);
};

export default QuickSightEmbed;
