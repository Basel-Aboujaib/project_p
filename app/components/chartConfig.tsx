import { ChartOptions } from 'chart.js';
import { lightModeColors, darkModeColors } from '../styles/themecolours';

export interface CsvData {
    time: number;
    gaugepressure: number;
    wgdc: number;
}

// chartOptions is now a function that accepts theme as a param
export const getChartOptions = (theme: string): ChartOptions<'line'> => ({
    responsive: true,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    plugins: {
        title: {
            display: true,
            text: 'Project P',
            padding: 30,
            color: theme === 'dark' ? darkModeColors.titleColor : lightModeColors.titleColor,

        },
    },

    scales: {
        x: {
            type: 'linear',
            title: {
                display: true,
                text: 'Time (ms)',
            },
        },
        y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
                display: true,
                text: 'Pressure (psi)',
            },
            grid: {
                color: function (context) {
                    if (context.tick.value !== 0) {
                        return theme === 'dark' ? darkModeColors.gridColor : lightModeColors.gridColor;
                    } else {
                        return 'rgb(125, 125, 125)';
                    }
                },
            },
            border: {
                dash: function (context) {
                if (context.tick.value !== 0) {
                        return [0];
                    } else {
                        return [6];
                    }
                }

            },



        },
        y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
                display: true,
                text: 'WGDC (%)',
            },
            grid: {
                drawOnChartArea: false,
            },
        },
    },
});