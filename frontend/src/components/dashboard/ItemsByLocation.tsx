import React from 'react';
import { Item, Location } from '../../types';
import { LocationIcon } from '../../constants/icons';

interface ItemsByLocationProps {
  items: Item[];
  locations: Location[];
}

const ItemsByLocation: React.FC<ItemsByLocationProps> = ({ items, locations }) => {
  const itemsCount = locations.map(location => ({
    ...location,
    count: items.filter(item => item.defaultLocationId === location.id).length,
  }));

  return (
    <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs">
      <h4 className="mb-4 font-semibold text-gray-800">
        Barang per Lokasi
      </h4>
       <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
        {itemsCount.map(loc => (
          <li key={loc.id} className="py-3 flex justify-between items-center">
             <div className="flex items-center space-x-3">
               <div className="p-2 bg-emerald-100 rounded-full">
                 <LocationIcon className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-sm font-medium text-gray-900">
                {loc.name}
              </p>
            </div>
            <p className="text-sm font-semibold text-gray-700">
              {loc.count} Barang
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemsByLocation;