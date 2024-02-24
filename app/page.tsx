'use client';

import React, { useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Papa from 'papaparse';
import ThemeSwitch from './components/ThemeSwitch';
import { getChartOptions, CsvData } from './components/chartConfig';
import { useDropzone } from 'react-dropzone';
import { useTheme } from "next-themes";
import { lightModeColors, darkModeColors } from './styles/themecolours';

// Registering the chart.js components we're going to use
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
ChartJS.defaults.font.family = 'Consolas, "Menlo", "Monaco", "Courier New", monospace';
ChartJS.defaults.font.size = 14;


export default function Page() {
	const { theme, resolvedTheme } = useTheme();

	useEffect(() => {
		// theme-specific configurations here
		const currentTheme = resolvedTheme || theme; // fallback to 'theme' if 'resolvedTheme' is not available
		ChartJS.defaults.color = currentTheme === 'dark' ? lightModeColors.textColor : darkModeColors.textColor;
	}, [resolvedTheme, theme]); // depend on 'resolvedTheme' and 'theme' to re-apply when theme changes




	const [csvData, setCsvData] = React.useState<CsvData[]>([]);
	const [chartData, setChartData] = React.useState({
		labels: [],
		datasets: [
			{
				label: 'Gauge Pressure',
				data: [],
				borderColor: 'rgb(99, 255, 161)',
				backgroundColor: 'rgba(99, 255, 161, 0.5)',
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
				const wgdcData = parsedData.map((data) => data.wgdc);

				console.log('Gauge Pressure Data:', gaugePressureData);
				console.log('WGDC Data:', wgdcData);

				setChartData({
					labels,
					datasets: [
						{ ...chartData.datasets[0], data: gaugePressureData },
						{ ...chartData.datasets[1], data: wgdcData },
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
				<div className="overlay flex justify-center items-center absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-60 z-50">
					<p>Drop the files here...</p>
				</div>
			)}
			<div className="container mx-auto px-4">
				<ThemeSwitch />
				{csvData.length > 0 && <Line options={getChartOptions(resolvedTheme)} data={chartData} />}
			</div>
		</div>
	);
}