import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StockHistory } from '../../types';

interface StockChartProps {
    data: StockHistory[];
}

const processDataForChart = (data: StockHistory[]) => {
    const monthlyData: { [key: string]: { name: string; masuk: number; keluar: number } } = {};

    data.forEach(item => {
        const date = new Date(item.timestamp);
        const monthYear = date.toLocaleString('id-ID', { month: 'short', year: 'numeric' });
        
        if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = { name: monthYear, masuk: 0, keluar: 0 };
        }

        if (item.quantityChange > 0) {
            monthlyData[monthYear].masuk += item.quantityChange;
        } else {
            monthlyData[monthYear].keluar += Math.abs(item.quantityChange);
        }
    });

    return Object.values(monthlyData).reverse();
};

const StockChart: React.FC<StockChartProps> = ({ data }) => {
    const chartData = processDataForChart(data);

    return (
        <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs">
            <h4 className="mb-4 font-semibold text-gray-800">
                Pergerakan Stok
            </h4>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderColor: 'rgba(204, 204, 204, 1)',
                            color: '#333',
                        }}
                    />
                    <Legend />
                    <Bar dataKey="masuk" fill="#10b981" name="Stok Masuk" />
                    <Bar dataKey="keluar" fill="#f43f5e" name="Stok Keluar" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StockChart;
