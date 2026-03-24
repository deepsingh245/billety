import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { getAllDocuments, createDocument } from "../firebase/firebaseUtils";
import { APP_CONSTANTS } from "../constants/app.constants";
import { handleError } from "../utils/error.utils";
import { Client } from "../interfaces/client.interface";
import { Invoice } from "../interfaces/invoice.interface";
import { Item } from "../interfaces/item.interface";
import { Project } from "../interfaces/project.interface";
import i18n from '../i18n';
import { useAuth } from './AuthContext';
import { getUserCollectionPath } from '../utils/firestorePath.utils';

export interface Settings {
    currency: string;
    language: string;
    notifications: {
        email: boolean;
        push: boolean;
    };
}

interface DataContextType {
    clients: Client[];
    invoices: Invoice[];
    items: Item[];
    projects: Project[];
    currentProject: Project | null;
    currentTheme: string;
    loading: boolean;
    refreshData: () => Promise<void>;
    setProject: (project: Project) => void;
    updateProjectTheme: (theme: string) => void;
    dateRange: { startDate: Date | null; endDate: Date | null };
    setDateRange: (range: { startDate: Date | null; endDate: Date | null }) => void;
    filteredInvoices: Invoice[];
    settings: Settings;
    updateSettings: (newSettings: Partial<Settings>) => void;
    addProject: (project: Omit<Project, 'id'>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [clients, setClients] = useState<Client[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [items, setItems] = useState<Item[]>([]);

    // Project State
    const [projects, setProjects] = useState<Project[]>([]);
    const [currentProject, setCurrentProject] = useState<Project | null>(null);

    // Theme State
    const [siteThemes, setSiteThemes] = useState<Record<string, string>>(() => {
        const saved = localStorage.getItem('SITE_THEMES');
        return saved ? JSON.parse(saved) : {};
    });

    const currentTheme = currentProject ? (siteThemes[currentProject.id] || 'Blue') : 'Blue';

    const updateProjectTheme = (theme: string) => {
        if (!currentProject) return;
        const newThemes = { ...siteThemes, [currentProject.id]: theme };
        setSiteThemes(newThemes);
        localStorage.setItem('SITE_THEMES', JSON.stringify(newThemes));
    };

    // Date Range State
    const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
        startDate: null,
        endDate: null
    });

    const [loading, setLoading] = useState<boolean>(true);

    const { user } = useAuth();

    // Settings State
    const [settings, setSettings] = useState<Settings>({
        currency: 'USD',
        language: 'en',
        notifications: {
            email: true,
            push: true
        }
    });

    const fetchData = useCallback(async () => {
        if (!user || !user.uid) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const [clientsData, invoicesData, itemsData, projectsData] = await Promise.all([
                getAllDocuments<Client>(getUserCollectionPath(user.uid, APP_CONSTANTS.COLLECTIONS.CLIENTS)),
                getAllDocuments<Invoice>(getUserCollectionPath(user.uid, APP_CONSTANTS.COLLECTIONS.INVOICES)),
                getAllDocuments<Item>(getUserCollectionPath(user.uid, APP_CONSTANTS.COLLECTIONS.ITEMS)),
                getAllDocuments<Project>(getUserCollectionPath(user.uid, APP_CONSTANTS.COLLECTIONS.SITES)),
            ]);

            setClients(clientsData);
            setInvoices(invoicesData);
            setItems(itemsData);
            setProjects(projectsData);

            if (projectsData.length > 0 && !currentProject) {
                setCurrentProject(projectsData[0]);
            }
        } catch (error) {
            handleError(error, "Error fetching data");
        } finally {
            setLoading(false);
        }
    }, [user, currentProject]); // Added currentProject to deps to avoid resetting if already set, but logic inside handles it

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        i18n.changeLanguage(settings.language);
    }, [settings.language]);

    const setProject = (project: Project) => {
        setCurrentProject(project);
    };

    const filteredInvoices = React.useMemo(() => {
        if (!dateRange.startDate && !dateRange.endDate) {
            return invoices;
        }

        return invoices.filter((invoice) => {
            const invoiceDate = new Date(invoice.date);
            const { startDate, endDate } = dateRange;

            if (startDate && invoiceDate < startDate) return false;
            if (endDate) {
                const endOfDay = new Date(endDate);
                endOfDay.setHours(23, 59, 59, 999);
                if (invoiceDate > endOfDay) return false;
            }

            return true;
        });
    }, [invoices, dateRange]);

    const updateSettings = (newSettings: Partial<Settings>) => {
        setSettings(prev => ({
            ...prev,
            ...newSettings
        }));
    };

    const addProject = async (projectData: Omit<Project, 'id'>) => {
        if (!user) return;
        try {
            setLoading(true);
            const path = getUserCollectionPath(user.uid, APP_CONSTANTS.COLLECTIONS.SITES);
            const newDocId = await createDocument(path, projectData);

            if (newDocId) {
                const newProject = { ...projectData, id: newDocId };
                setProjects(prev => [...prev, newProject]);
                if (!currentProject) {
                    setCurrentProject(newProject);
                }
            }
        } catch (error) {
            handleError(error, "Error creating project");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <DataContext.Provider value={{
            clients,
            invoices,
            items,
            projects,
            currentProject,
            currentTheme,
            loading,
            refreshData: fetchData,
            setProject,
            updateProjectTheme,
            dateRange,
            setDateRange,
            filteredInvoices,
            settings,
            updateSettings,
            addProject
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
