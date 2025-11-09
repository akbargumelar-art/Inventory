import React from 'react';
import { StockHistory } from '../../types';

interface RecentActivityProps {
  activities: StockHistory[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getActivityMessage = (activity: StockHistory) => {
    const quantity = Math.abs(activity.quantityChange);
    const itemName = activity.relatedItem.name;
    const user = activity.user.name;

    switch (activity.type) {
      case 'Penerimaan':
        return `${user} menerima ${quantity} unit ${itemName}.`;
      case 'Penjualan':
        return `${user} menjual ${quantity} unit ${itemName}.`;
      case 'Koreksi':
        return `${user} mengoreksi stok ${itemName} sejumlah ${activity.quantityChange} unit.`;
      case 'Transfer':
        return `${user} mentransfer ${quantity} unit ${itemName} dari ${activity.fromLocation?.name} ke ${activity.toLocation?.name}.`;
      // Fix: Add cases for borrowing and returning items
      case 'Dipinjamkan':
        return `${quantity} unit ${itemName} dipinjamkan.`;
      case 'Dikembalikan':
        return `${quantity} unit ${itemName} dikembalikan.`;
      default:
        return `${user} melakukan: ${activity.type} ${quantity} unit ${itemName}.`;
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-lg shadow-xs">
      <h4 className="px-4 py-3 font-semibold text-gray-800 bg-white border-b">
        Aktivitas Terbaru
      </h4>
      <div className="w-full overflow-x-auto">
        <table className="w-full whitespace-no-wrap">
          <tbody className="bg-white divide-y">
            {activities.map(activity => (
              <tr key={activity.id} className="text-gray-700">
                <td className="px-4 py-3">
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">{getActivityMessage(activity)}</p>
                      <p className="text-xs text-gray-600">
                        {new Date(activity.timestamp).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 font-semibold leading-tight rounded-full ${
                      activity.quantityChange > 0
                        ? 'text-green-700 bg-green-100'
                        : 'text-red-700 bg-red-100'
                    }`}
                  >
                    {activity.quantityChange > 0 ? `+${activity.quantityChange}` : activity.quantityChange}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentActivity;