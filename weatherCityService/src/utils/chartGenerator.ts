import {ChartJSNodeCanvas} from 'chartjs-node-canvas';
import {ChartConfiguration} from 'chart.js'

export class ChartGenerator {
    private chartJSNodeCanvas: ChartJSNodeCanvas;

    constructor() {
        this.chartJSNodeCanvas = new ChartJSNodeCanvas({
            width: 1280,
            height: 720,
        });
    }

    async generateTemperatureChart(labels: string[], temperatures: number[], location: string): Promise<Buffer> {
        const configuration: ChartConfiguration = {
            type: "bar",
            data: {
                labels: labels.slice(0, 24),
                datasets: [{
                    label: `Температура в ${location}`,
                    data: temperatures.slice(0, 24),
                    borderColor: 'rgb(44,104,164)',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    tension: 0.1,
                    fill: true
                }]
            },
            options: {
                responsive: false,
                plugins: {
                    title: {
                        display: true,
                        text: `Изменение температуры в ${location} за 24 часа`
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Температура'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Время'
                        }
                    }
                }
            }
        };

        return await this.chartJSNodeCanvas.renderToBuffer(configuration);
    }
}