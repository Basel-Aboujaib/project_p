// app/page.tsx
'use client';

import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Papa from 'papaparse';
import ThemeSwitch from './components/ThemeSwitch';
import { useDropzone } from 'react-dropzone';

// Registering the chart.js components we're going to use
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface CsvData {
	time: number;
	gaugepressure: number;
	manifoldpressure: number;
	wgdc: number;
}

// Updated options for the chart with multi-axis configuration
const options = {
	responsive: true,
	interaction: {
		mode: 'index' as const,
		intersect: false,
	},
	stacked: true,
	plugins: {
		title: {
			display: true,
			text: 'CSV Data Chart - Multi Axis',
		},
	},
	scales: {
		x: {
			type: 'linear' as const,
			title: {
				display: true,
				text: 'Time (s)', // Label for the X-axis
			},
		},
		y: {
			type: 'linear' as const,
			display: true,
			position: 'left' as const,
			title: {
				display: true,
				text: 'Pressure (psi)',
			},
		},
		y1: {
			type: 'linear' as const,
			display: true,
			position: 'right' as const,
			title: {
				display: true,
				text: 'WGDC (%)',
			},
			grid: {
				drawOnChartArea: false, // to only draw the grid lines for one axis
			},
		},
	},
};

export default function Page() {
	const [csvData, setCsvData] = React.useState<CsvData[]>([]);
	const [chartData, setChartData] = React.useState({
		labels: [],
		datasets: [
			{
				label: 'Gauge Pressure',
				data: [],
				borderColor: 'rgb(255, 99, 132)',
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
				yAxisID: 'y',
			},
			{
				label: 'Manifold Pressure',
				data: [],
				borderColor: 'rgb(53, 162, 235)',
				backgroundColor: 'rgba(53, 162, 235, 0.5)',
				yAxisID: 'y',
			},
			{
				label: 'WGDC',
				data: [],
				borderColor: 'rgb(75, 192, 192)',
				backgroundColor: 'rgba(75, 192, 192, 0.5)',
				yAxisID: 'y1',
			},
		],
	});

	const onDrop = React.useCallback((acceptedFiles: File[]) => {
		const file = acceptedFiles[0];
		console.log('File selected for upload:', file.name);
		const reader = new FileReader();
		reader.onload = (e: ProgressEvent<FileReader>) => {
			const text = e.target?.result;
			console.log('File content:', text);
			parseCsv(text as string);
		};
		reader.readAsText(file);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: { 'text/csv': ['.csv'] },
		noClick: true,
		noKeyboard: true,
	});

	const parseCsv = (data: string) => {
		Papa.parse(data, {
			header: true,
			dynamicTyping: true,
			complete: (results) => {
				console.log('Parsed CSV data:', results.data);
				const parsedData = results.data as CsvData[];
				setCsvData(parsedData);

				const labels = parsedData.map((data) => data.time);
				const gaugePressureData = parsedData.map((data) => data.gaugepressure);
				const manifoldPressureData = parsedData.map((data) => data.manifoldpressure);
				const wgdcData = parsedData.map((data) => data.wgdc);

				console.log('Gauge Pressure Data:', gaugePressureData);
				console.log('Manifold Pressure Data:', manifoldPressureData);
				console.log('WGDC Data:', wgdcData);

				setChartData({
					labels,
					datasets: [
						{ ...chartData.datasets[0], data: gaugePressureData },
						{ ...chartData.datasets[1], data: manifoldPressureData },
						{ ...chartData.datasets[2], data: wgdcData },
					],
				});
			},
		});
	};

// this div needs to expand to the whole viewport for dropzone to work everywhere

	return (
		<div {...getRootProps()} className="min-h-screen w-full"> 
			<input {...getInputProps()} />
			{isDragActive && (
				<div className="overlay flex justify-center items-center absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50">
					<p>Drop the files here...</p>
				</div>
			)}
			<div className="container mx-auto px-4">
				<ThemeSwitch />
				{csvData.length > 0 && <Line options={options} data={chartData} />}
			</div>
		</div>
	);
}