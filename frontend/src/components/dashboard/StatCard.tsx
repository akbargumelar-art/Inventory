import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
    return (
        <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
            <div className="p-3 mr-4 text-emerald-500 bg-emerald-100 rounded-full">
                {icon}
            </div>
            <div>
                <p className="mb-2 text-sm font-medium text-gray-600">
                    {title}
                </p>
                <p className="text-lg font-semibold text-gray-700">
                    {value}
                </p>
            </div>
        </div>
    );
};

export default StatCard;
