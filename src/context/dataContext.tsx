import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { getAllDocuments } from "../firebase/firebaseUtils";
import { APP_CONSTANTS } from "../constants/app.constants";
import { handleError } from "../utils/error.utils";
import { Client } from "../interfaces/client.interface";
import { Invoice } from "../interfaces/invoice.interface";
import { Item } from "../interfaces/item.interface";
import { Project } from "../interfaces/project.interface";

const DUMMY_PROJECTS: Project[] = [
    { id: '1', name: 'Billety-web', category: 'Production', plan: 'Pro' },
    { id: '2', name: 'Billety-app', category: 'Production', plan: 'Free' },
    { id: '3', name: 'Billety-admin', category: 'Development', plan: 'Enterprise' },
    { id: '4', name: 'Billety-store', category: 'Production', plan: 'Pro' },
];

interface DataContextType {
    clients: Client[];
    invoices: Invoice[];
    items: Item[];
    projects: Project[];
    currentProject: Project | null;
    loading: boolean;
    refreshData: () => Promise<void>;
    setProject: (project: Project) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [clients, setClients] = useState<Client[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [items, setItems] = useState<Item[]>([]);

    // Project State
    const [projects] = useState<Project[]>(DUMMY_PROJECTS);
    const [currentProject, setCurrentProject] = useState<Project | null>(DUMMY_PROJECTS[0]);

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

    const setProject = (project: Project) => {
        setCurrentProject(project);
    };

    return (
        <DataContext.Provider value={{
            clients,
            invoices,
            items,
            projects,
            currentProject,
            loading,
            refreshData: fetchData,
            setProject
        }}>
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
