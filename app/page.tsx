// app/page.tsx
'use client';

import React from 'react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
} from 'chart.js';
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

// The updated options for our chart with multi-axis configuration
const options = {
	responsive: true,
	interaction: {
		mode: 'index' as const,
		intersect: false
	},
	stacked: true,
	plugins: {
		title: {
			display: true,
			text: 'CSV Data Chart - Multi Axis'
		}
	},
	scales: {
		x: {
			type: 'linear' as const,
			title: {
				display: true,
				text: 'Time (s)' // Label for the X-axis
			}
		},
		y: {
			type: 'linear' as const,
			display: true,
			position: 'left' as const,
			title: {
				display: true,
				text: 'Pressure (psi)'
			}
		},
		y1: {
			type: 'linear' as const,
			display: true,
			position: 'right' as const,
			title: {
				display: true,
				text: 'WGDC (%)'
			},
			grid: {
				drawOnChartArea: false // to only draw the grid lines for one axis
			}
		}
	}
};

export default function Page() {
	const [csvData, setCsvData] = React.useState<CsvData[]>([]);
	const [maxPressure, setMaxPressure] = React.useState(0); // State to hold the max pressure
	const [chartData, setChartData] = React.useState({
		labels: [],
		datasets: [
			{
				label: 'Gauge Pressure',
				data: [],
				borderColor: 'rgb(255, 99, 132)',
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
				yAxisID: 'y'
			},
			{
				label: 'Manifold Pressure',
				data: [],
				borderColor: 'rgb(53, 162, 235)',
				backgroundColor: 'rgba(53, 162, 235, 0.5)',
				yAxisID: 'y'
			},
			{
				label: 'WGDC',
				data: [],
				borderColor: 'rgb(75, 192, 192)',
				backgroundColor: 'rgba(75, 192, 192, 0.5)',
				yAxisID: 'y1'
			}
		]
	});


	const onDrop = React.useCallback((acceptedFiles: File[]) => {
		const file = acceptedFiles[0]; // Assuming only one file is uploaded
		console.log('File selected for upload:', file.name); // Log file name
		const reader = new FileReader();
		reader.onload = (e: ProgressEvent<FileReader>) => {
			const text = e.target?.result;
			console.log('File content:', text); // Log raw file content
			parseCsv(text as string);
		};
		reader.readAsText(file);
	}, []);


	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			'text/csv': ['.csv']
		}
	});

	// Function to parse CSV data and update chart data
	const parseCsv = (data: string) => {
		Papa.parse(data, {
			header: true,
			dynamicTyping: true,
			complete: (results) => {
				console.log('Parsed CSV data:', results.data); // Log parsed CSV data
				const parsedData = results.data as CsvData[];
				setCsvData(parsedData);

				const labels = parsedData.map((data) => data.time);
				const gaugePressureData = parsedData.map((data) => data.gaugepressure);
				const manifoldPressureData = parsedData.map((data) => data.manifoldpressure);
				const wgdcData = parsedData.map((data) => data.wgdc);

				console.log('Gauge Pressure Data:', gaugePressureData); // Log gauge pressure data
				console.log('Manifold Pressure Data:', manifoldPressureData); // Log manifold pressure data
				console.log('WGDC Data:', wgdcData); // Log WGDC data

				const maxGaugePressure = Math.max(...gaugePressureData);
				const maxManifoldPressure = Math.max(...manifoldPressureData);
				const newMaxPressure = Math.max(maxGaugePressure, maxManifoldPressure) * 1.05;

				console.log('Calculated Max Pressure:', newMaxPressure); // Log max pressure
				setMaxPressure(newMaxPressure);

				setChartData((prevChartData) => {
					const newChartData = {
						labels,
						datasets: [
							{ ...prevChartData.datasets[0], data: gaugePressureData },
							{ ...prevChartData.datasets[1], data: manifoldPressureData },
							{ ...prevChartData.datasets[2], data: wgdcData }
						]
					};
					console.log('Updated Chart Data:', newChartData); // Log updated chart data
					return newChartData;
				});
			}
		});
	};

	// Updated options with dynamic max value for y-axis
	const updatedOptions = {
		...options,
		maintainAspectRatio: true,
		scales: {
			...options.scales,
			y: {
				...options.scales.y,
				max: maxPressure // Set the dynamic max value
			}
		}
	};

	// This renders a file input element for uploading CSV files and a theme switch button.
	// The file input element allows users to select a CSV file for data upload, triggering the handleUpload function.
	// The ThemeSwitch component is used to toggle between light and dark themes.
	// Below the file input and theme switch, a Line chart is displayed if CSV data is available,
	// using the updatedOptions and chartData state variables to configure the chart's options and data.
	// The chart is set to be 80% wide and 700px high when CSV data is available, or an empty div is rendered otherwise.
	return (
		<div>
			<div className={csvData.length > 0 ? 'flex justify-between px-8 mb-4 py-4 rounded-lg ring-1 ring-slate-900/5 shadow-xl' : 'flex justify-between'}>
				<div {...getRootProps()} className="dropzone">
					<input {...getInputProps()} />
					{isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
				</div>
				<ThemeSwitch />
			</div>
			<div>
				{csvData.length > 0 ? <Line options={options} data={chartData} /> : <div></div>} {}
			</div>
		</div>

	);
}