import StandardTemplate from './StandardTemplate';
import MinimalTemplate from './MinimalTemplate';
import { Invoice } from '../../../interfaces/invoice.interface';

export interface TemplateDefinition {
    id: string;
    name: string;
    thumbnail: string; // Helper for UI (could be path or color)
    component: React.ComponentType<{ invoice: Invoice }>;
}

export const INVOICE_TEMPLATES: Record<string, TemplateDefinition> = {
    'standard': {
        id: 'standard',
        name: 'Standard Blue',
        thumbnail: 'linear-gradient(135deg, #fff 0%, #e3f2fd 100%)', // CSS representation for now
        component: StandardTemplate,
    },
    'minimal': {
        id: 'minimal',
        name: 'Clean Minimal',
        thumbnail: 'linear-gradient(135deg, #fff 0%, #fafafa 100%)',
        component: MinimalTemplate,
    }
};

export const DEFAULT_TEMPLATE_ID = 'standard';
