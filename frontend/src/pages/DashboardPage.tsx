import React from 'react';
import StatCard from '../components/dashboard/StatCard';
import StockChart from '../components/dashboard/StockChart';
import RecentActivity from '../components/dashboard/RecentActivity';
import ItemsByCategory from '../components/dashboard/ItemsByCategory';
import ItemsByLocation from '../components/dashboard/ItemsByLocation';
import { ClipboardListIcon } from '../constants/icons';
import { formatCurrency } from '../utils/formatter';
import { useData } from '../hooks/useData';

const DashboardPage: React.FC = () => {
    const { items, locations, categories, stockHistory, borrowings } = useData();

    const totalInventoryValue = items.reduce((acc, item) => acc + item.price * item.stock, 0);
    const borrowedItemsCount = borrowings.filter(b => b.status === 'Dipinjam').length;

    const stats = [
        { title: 'Total Nilai Inventori', value: formatCurrency(totalInventoryValue), icon: <span className="text-3xl">Rp</span> },
        { title: 'Barang Sedang Dipinjam', value: borrowedItemsCount.toString(), icon: <ClipboardListIcon /> },
    ];

    return (
        <>
            <h2 className="my-6 text-2xl font-semibold text-gray-700">
                Dashboard
            </h2>
            
            <div className="grid gap-6 mb-8 md:grid-cols-2">
                {stats.map((stat, i) => (
                    <StatCard key={i} title={stat.title} value={stat.value} icon={stat.icon} />
                ))}
            </div>

            <div className="grid gap-6 mb-8 md:grid-cols-1 xl:grid-cols-2">
                 <ItemsByCategory items={items} categories={categories} />
                 <ItemsByLocation items={items} locations={locations} />
            </div>

            <div className="grid gap-6 mb-8 md:grid-cols-1 xl:grid-cols-2">
                 <StockChart data={stockHistory} />
                 <RecentActivity activities={stockHistory.slice(0, 5)} />
            </div>
        </>
    );
};

export default DashboardPage;
