import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { getAllDocuments } from "../firebase/firebaseUtils";
import { APP_CONSTANTS } from "../constants/app.constants";
import { handleError } from "../utils/error.utils";
import { Client } from "../interfaces/client.interface";
import { Invoice } from "../interfaces/invoice.interface";
import { Item } from "../interfaces/item.interface";

interface DataContextType {
    clients: Client[];
    invoices: Invoice[];
    items: Item[];
    loading: boolean;
    refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [clients, setClients] = useState<Client[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [clientsData, invoicesData, itemsData] = await Promise.all([
                getAllDocuments<Client>(APP_CONSTANTS.COLLECTIONS.CLIENTS),
                getAllDocuments<Invoice>(APP_CONSTANTS.COLLECTIONS.INVOICES),
                getAllDocuments<Item>(APP_CONSTANTS.COLLECTIONS.ITEMS),
            ]);

            setClients(clientsData);
            setInvoices(invoicesData);
            setItems(itemsData);
        } catch (error) {
            handleError(error, "Error fetching data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <DataContext.Provider value={{ clients, invoices, items, loading, refreshData: fetchData }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
};
