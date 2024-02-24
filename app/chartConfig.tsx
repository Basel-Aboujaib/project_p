import { ChartOptions } from 'chart.js';

export interface CsvData {
    time: number;
    gaugepressure: number;
    manifoldpressure: number;
    wgdc: number;
}

export const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    plugins: {
        title: {
            display: true,
            text: 'Graph',
        },
    },
    scales: {
        x: {
            type: 'linear',
            title: {
                display: true,
                text: 'Time (s)',
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
                drawOnChartArea: true,
                color: function (context) {
                    if (context.tick.value !== 0) {
                        return 'rgb(125, 125, 125, 0.1)';
                    } else {
                        return 'rgb(125, 125, 125)';
                    }
                },
                tickBorderDash: [1],
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
};
