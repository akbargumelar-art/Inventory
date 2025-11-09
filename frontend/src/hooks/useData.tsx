
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Item, Location, Category, User, StockHistory, Borrowing } from '../types';
import { useAuth } from './useAuth';
import { apiClient } from '../services/apiClient';

interface DataContextType {
    items: Item[];
    locations: Location[];
    categories: Category[];
    users: User[];
    borrowings: Borrowing[];
    stockHistory: StockHistory[];
    isLoading: boolean;
    addItem: (item: Partial<Item>) => Promise<void>;
    updateItem: (item: Item) => Promise<void>;
    deleteItem: (itemId: string) => Promise<void>;
    adjustItemStock: (itemId: string, quantityChange: number, type: StockHistory['type'], reason: string) => Promise<void>;
    addLocation: (location: Partial<Location>) => Promise<void>;
    updateLocation: (location: Location) => Promise<void>;
    deleteLocation: (locationId: string) => Promise<void>;
    addCategory: (category: Partial<Category>) => Promise<void>;
    updateCategory: (category: Category) => Promise<void>;
    deleteCategory: (categoryId: string) => Promise<void>;
    addUser: (user: Partial<User>) => Promise<void>;
    updateUser: (user: User) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
    addBorrowing: (borrowing: Partial<Borrowing>) => Promise<void>;
    returnBorrowing: (borrowingId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [items, setItems] = useState<Item[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
    const [stockHistory, setStockHistory] = useState<StockHistory[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (isAuthenticated) {
                setIsLoading(true);
                try {
                    const [itemsData, locationsData, categoriesData, usersData, borrowingsData, stockHistoryData] = await Promise.all([
                        apiClient.get<Item[]>('/items'),
                        apiClient.get<Location[]>('/locations'),
                        apiClient.get<Category[]>('/categories'),
                        apiClient.get<User[]>('/users'),
                        apiClient.get<Borrowing[]>('/borrowings'),
                        apiClient.get<StockHistory[]>('/stock-history'),
                    ]);
                    setItems(itemsData);
                    setLocations(locationsData);
                    setCategories(categoriesData);
                    setUsers(usersData);
                    setBorrowings(borrowingsData);
                    setStockHistory(stockHistoryData);
                } catch (error) {
                    console.error("Failed to fetch initial data:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                 // Fix: Clear data on logout to prevent showing stale data.
                setItems([]);
                setLocations([]);
                setCategories([]);
                setUsers([]);
                setBorrowings([]);
                setStockHistory([]);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [isAuthenticated]);
    
    // Items
    const addItem = async (item: Partial<Item>) => {
        const newItem = await apiClient.post<Item>('/items', item);
        setItems(prev => [newItem, ...prev]);
    };
    const updateItem = async (updatedItem: Item) => {
        const result = await apiClient.put<Item>(`/items/${updatedItem.id}`, updatedItem);
        setItems(prev => prev.map(item => item.id === result.id ? result : item));
    };
    const deleteItem = async (itemId: string) => {
        await apiClient.delete(`/items/${itemId}`);
        setItems(prev => prev.filter(item => item.id !== itemId));
    };
    const adjustItemStock = async (itemId: string, quantityChange: number, type: StockHistory['type'], reason: string) => {
        const { updatedItem, newHistory } = await apiClient.post<{updatedItem: Item, newHistory: StockHistory}>(`/items/${itemId}/adjust`, { quantityChange, type, reason });
        setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
        setStockHistory(prev => [newHistory, ...prev]);
    };

    // Locations
    const addLocation = async (location: Partial<Location>) => {
        const newLocation = await apiClient.post<Location>('/locations', location);
        setLocations(prev => [newLocation, ...prev]);
    };
    const updateLocation = async (updatedLocation: Location) => {
        const result = await apiClient.put<Location>(`/locations/${updatedLocation.id}`, updatedLocation);
        setLocations(prev => prev.map(loc => loc.id === result.id ? result : loc));
    };
    const deleteLocation = async (locationId: string) => {
        await apiClient.delete(`/locations/${locationId}`);
        setLocations(prev => prev.filter(loc => loc.id !== locationId));
    };

    // Categories
    const addCategory = async (category: Partial<Category>) => {
        const newCategory = await apiClient.post<Category>('/categories', category);
        setCategories(prev => [newCategory, ...prev]);
    };
    const updateCategory = async (updatedCategory: Category) => {
        const result = await apiClient.put<Category>(`/categories/${updatedCategory.id}`, updatedCategory);
        setCategories(prev => prev.map(cat => cat.id === result.id ? result : cat));
    };
    const deleteCategory = async (categoryId: string) => {
        await apiClient.delete(`/categories/${categoryId}`);
        setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    };

    // Users
    const addUser = async (user: Partial<User>) => {
        const newUser = await apiClient.post<User>('/users', user);
        setUsers(prev => [newUser, ...prev]);
    };
    const updateUser = async (updatedUser: User) => {
        const result = await apiClient.put<User>(`/users/${updatedUser.id}`, updatedUser);
        setUsers(prev => prev.map(u => u.id === result.id ? result : u));
    };
    const deleteUser = async (userId: string) => {
        await apiClient.delete(`/users/${userId}`);
        setUsers(prev => prev.filter(u => u.id !== userId));
    };

    // Borrowings
    const addBorrowing = async (borrowing: Partial<Borrowing>) => {
        // Fix: Properly handle the API response to update all relevant states.
        const { newBorrowing, newHistory, updatedItem } = await apiClient.post<{newBorrowing: Borrowing, newHistory: StockHistory, updatedItem: Item}>('/borrowings', borrowing);
        setBorrowings(prev => [newBorrowing, ...prev].sort((a, b) => new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime()));
        setStockHistory(prev => [newHistory, ...prev]);
        setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    };
    const returnBorrowing = async (borrowingId: string) => {
        // Fix: Properly handle the API response to update all relevant states.
        const { updatedBorrowing, newHistory, updatedItem } = await apiClient.put<{updatedBorrowing: Borrowing, newHistory: StockHistory, updatedItem: Item}>(`/borrowings/${borrowingId}/return`, {});
        setBorrowings(prev => prev.map(b => b.id === updatedBorrowing.id ? updatedBorrowing : b));
        setStockHistory(prev => [newHistory, ...prev]);
        setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    };

    return (
        <DataContext.Provider value={{ 
            items, locations, categories, users, borrowings, stockHistory, isLoading,
            addItem, updateItem, deleteItem, adjustItemStock,
            addLocation, updateLocation, deleteLocation,
            addCategory, updateCategory, deleteCategory,
            addUser, updateUser, deleteUser,
            addBorrowing, returnBorrowing
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};