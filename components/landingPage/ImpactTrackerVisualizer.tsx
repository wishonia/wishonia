"use client"
import { TrendingUp, TrendingDown, RefreshCw, AlertTriangle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Metric {
    name: string;
    value: number;
    trend: 'up' | 'down' | 'stable';
    impact: 'positive' | 'negative' | 'neutral';
}

interface DataSource {
    name: string;
    reliability: number;
}

const ImpactTrackerVisualizer: React.FC = () => {
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [dataSources, setDataSources] = useState<DataSource[]>([]);
    const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
    const [historicalData, setHistoricalData] = useState<any[]>([]);

    useEffect(() => {
        // Simulated initial data
        const initialMetrics: Metric[] = [
            { name: 'Drug candidates identified', value: 150, trend: 'up', impact: 'positive' },
            { name: 'Clinical trials initiated', value: 12, trend: 'up', impact: 'positive' },
            { name: 'Average drug development time (months)', value: 60, trend: 'down', impact: 'positive' },
            { name: 'Research collaborations', value: 45, trend: 'up', impact: 'positive' },
            { name: 'Publications cited', value: 230, trend: 'up', impact: 'positive' },
        ];
        setMetrics(initialMetrics);

        const initialDataSources: DataSource[] = [
            { name: 'Clinical trial databases', reliability: 0.95 },
            { name: 'Scientific journals', reliability: 0.9 },
            { name: 'Patent offices', reliability: 0.85 },
            { name: 'Research institutions', reliability: 0.8 },
            { name: 'Industry reports', reliability: 0.75 },
        ];
        setDataSources(initialDataSources);
    }, []);

    const generateHistoricalData = (metricName: string) => {
        const data = [];
        let value = Math.floor(Math.random() * 100);
        for (let i = 12; i > 0; i--) {
            value += Math.floor(Math.random() * 20) - 10;
            data.push({
                month: i,
                [metricName]: Math.max(0, value),
            });
        }
        setHistoricalData(data.reverse());
    };

    const handleMetricClick = (metricName: string) => {
        setSelectedMetric(metricName);
        generateHistoricalData(metricName);
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up':
                return <TrendingUp size={16} className="text-green-500" />;
            case 'down':
                return <TrendingDown size={16} className="text-red-500" />;
            default:
                return <RefreshCw size={16} className="text-yellow-500" />;
        }
    };

    const getImpactColor = (impact: string) => {
        switch (impact) {
            case 'positive':
                return 'text-green-500';
            case 'negative':
                return 'text-red-500';
            default:
                return 'text-yellow-500';
        }
    };

    return (
        <div className="p-4 rounded-lg shadow-md max-w-4xl mx-auto my-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Impact Monitor Agents</h2>
            <div className="mb-4 p-2 bg-blue-100 dark:bg-blue-900 rounded">
                <h3 className="font-bold flex items-center"><AlertTriangle size={16} className="mr-2" /> Real-time Impact Analysis</h3>
                <p className="text-sm">Our AI agents continuously analyze data from various sources to track key metrics and measure the real-world impact of our efforts.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <h3 className="font-bold mb-2">Key Metrics</h3>
                    {metrics.map(metric => (
                        <div
                            key={metric.name}
                            className="p-2 mb-2 bg-gray-100 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                            onClick={() => handleMetricClick(metric.name)}
                        >
                            <div className="flex justify-between items-center">
                                <span>{metric.name}</span>
                                <span className="font-bold">{metric.value}</span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                <span className="flex items-center">
                  {getTrendIcon(metric.trend)}
                    <span className="ml-1 text-sm">{metric.trend}</span>
                </span>
                                <span className={`text-sm ${getImpactColor(metric.impact)}`}>
                  Impact: {metric.impact}
                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    <h3 className="font-bold mb-2">Data Sources</h3>
                    {dataSources.map(source => (
                        <div key={source.name} className="p-2 mb-2 bg-gray-100 dark:bg-gray-700 rounded">
                            <div className="flex justify-between items-center">
                                <span>{source.name}</span>
                                <span className="text-sm">Reliability: {(source.reliability * 100).toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600 mt-1">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${source.reliability * 100}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {selectedMetric && (
                <div>
                    <h3 className="font-bold mb-2">Historical Data: {selectedMetric}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={historicalData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey={selectedMetric} fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default ImpactTrackerVisualizer;