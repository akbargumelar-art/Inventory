
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional for security
  role: 'Administrator' | 'Input Data' | 'Viewer';
}

export interface Location {
  id: string;
  code: string;
  name: string;
  address: string;
  description: string;
}

export interface Category {
  id: string;
  name:string;
  parentId: string | null;
}

export interface Media {
  id: string;
  url: string;
  type: 'image' | 'video';
  name: string;
}

export interface Item {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  description: string;
  media: Media[];
  categoryId: string;
  defaultLocationId: string;
  unit: 'pcs' | 'kg' | 'liter' | 'meter';
  stock: number;
  minStock: number;
  price: number;
  currency: 'IDR';
  active: boolean;
  createdAt: string;
}

export interface StockHistory {
  id: string;
  timestamp: string;
  user: User;
  type: 'Penerimaan' | 'Penjualan' | 'Transfer' | 'Koreksi' | 'Retur' | 'Dipinjamkan' | 'Dikembalikan' | 'Dijual' | 'Hilang' | 'Diberikan';
  quantityChange: number;
  fromLocation?: Location;
  toLocation?: Location;
  reason: string;
  relatedItem: Pick<Item, 'id' | 'name' | 'sku'>;
}

export interface Stat {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
}

export interface Borrowing {
  id: string;
  itemId: string;
  borrowerName: string;
  borrowDate: string;
  expectedReturnDate: string;
  actualReturnDate: string | null;
  status: 'Dipinjam' | 'Kembali';
  notes: string;
}
