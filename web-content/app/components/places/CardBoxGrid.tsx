import { ReactNode } from 'react';

export default function CardBox({
	header,
	children,
}: {
	header: string;
	children: React.ReactNode;
}) {
	return (
		<div className=' border border-solid border-gray-slate-300 rounded-lg overflow-hidden  min-w-[300px] col-span-1'>
			<div className=' bg-blue-slate-250 p-[10px] border-b border-solid border-b-gray-slate-300 '>
				<h4 className=' text-black-slate-900 text-sm font-semibold '>
					{header}
				</h4>
			</div>
			<div className='p-[10px] max-h-[180px] overflow-y-auto customScrollBar overflow-hidden'>
				{children}
			</div>
		</div>
	);
}
