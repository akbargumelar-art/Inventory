import React from 'react';
import { Item } from '../../types';
import { BarcodeIcon, QrCodeIcon } from '../../constants/icons';
import { formatCurrency } from '../../utils/formatter';
// For real barcode generation, a library like bwip-js or jsbarcode would be used.
// Here we use placeholders.

// Placeholder for Code128 barcode SVG
const Code128Barcode: React.FC<{ value: string }> = ({ value }) => (
  <svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="200" height="60" fill="white" />
    <g fill="black">
      {[...value].map((_, i) => (
        i % 2 === 0 && <rect key={i} x={10 + i * 2} y={10} width={Math.random() * 2 + 1} height="40" />
      ))}
    </g>
    <text x="100" y="55" fontFamily="monospace" fontSize="10" textAnchor="middle">{value}</text>
  </svg>
);

// Placeholder for QR code SVG
const QRCode: React.FC<{ value: string }> = ({ value }) => (
  <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="100" height="100" fill="white" />
    <g fill="black">
      {Array.from({ length: 100 }).map((_, i) => (
        Math.random() > 0.5 && <rect key={i} x={(i % 10) * 10} y={Math.floor(i / 10) * 10} width="10" height="10" />
      ))}
    </g>
  </svg>
);


interface BarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item;
}

const BarcodeModal: React.FC<BarcodeModalProps> = ({ isOpen, onClose, item }) => {
  if (!isOpen) return null;

  const handleBrowserPrint = () => {
    const printContent = document.getElementById('printable-label')?.innerHTML;
    if (printContent) {
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow?.document.write('<html><head><title>Cetak Label</title>');
        printWindow?.document.write('<style>@media print { body { margin: 0; } .label { border: 1px dashed #ccc; padding: 10px; margin: 10px; break-inside: avoid; } }</style>');
        printWindow?.document.write('</head><body>');
        printWindow?.document.write(printContent);
        printWindow?.document.write('</body></html>');
        printWindow?.document.close();
        printWindow?.focus();
        printWindow?.print();
        printWindow?.close();
    }
  };

  const handleBluetoothPrint = async () => {
    alert("Fitur Cetak Bluetooth sedang dalam pengembangan.\nIni akan menggunakan Web Bluetooth API untuk mengirim command ESC/POS ke printer thermal.");
    // Placeholder for actual Web Bluetooth API logic
    // try {
    //   const device = await navigator.bluetooth.requestDevice({ ... });
    //   const server = await device.gatt.connect();
    //   const service = await server.getPrimaryService(...);
    //   const characteristic = await service.getCharacteristic(...);
    //   const escposCommands = generateEscPosCommands(item);
    //   await characteristic.writeValue(escposCommands);
    //   console.log('Berhasil mencetak via Bluetooth');
    // } catch (error) {
    //   console.error('Gagal mencetak via Bluetooth:', error);
    // }
  };
  
  const labelContent = (
    <div className="label text-center p-2 border border-dashed border-gray-400 break-inside-avoid-page">
      <p className="font-bold text-sm truncate">{item.name}</p>
      <div className="flex justify-center my-1">
         <Code128Barcode value={item.barcode} />
      </div>
      <p className="text-xs">{formatCurrency(item.price)}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="relative w-full max-w-lg mx-auto my-6 bg-white rounded-lg shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between p-5 border-b border-solid rounded-t">
          <h3 className="text-xl font-semibold">Cetak Label Barcode</h3>
          <button onClick={onClose} className="p-1 ml-auto bg-transparent border-0 text-black opacity-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none">
            <span className="text-2xl">×</span>
          </button>
        </div>
        <div className="relative p-6 flex-auto">
          <h4 className="font-semibold">{item.name}</h4>
          <p className="text-sm text-gray-500">SKU: {item.sku}</p>

          <div id="printable-label" className="my-4">
            {labelContent}
          </div>

          <div className="flex justify-around items-center my-4 p-4 bg-gray-100 rounded-lg">
            <div>
              <p className="text-center font-semibold flex items-center"><BarcodeIcon className="mr-2"/> Code128</p>
              <div className="p-2 bg-white rounded"><Code128Barcode value={item.barcode} /></div>
              <p className="text-center text-xs font-mono mt-1">{item.barcode}</p>
            </div>
            <div>
              <p className="text-center font-semibold flex items-center"><QrCodeIcon className="mr-2"/> QR Code</p>
              <div className="p-2 bg-white rounded"><QRCode value={item.sku} /></div>
              <p className="text-center text-xs font-mono mt-1">{item.sku}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end p-6 border-t border-solid rounded-b space-x-2">
          <button onClick={handleBluetoothPrint} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none">Cetak via Bluetooth</button>
          <button onClick={handleBrowserPrint} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none">Cetak</button>
        </div>
      </div>
    </div>
  );
};

export default BarcodeModal;
