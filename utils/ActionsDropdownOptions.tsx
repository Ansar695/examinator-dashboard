import { Download, Edit, Eye } from "lucide-react";

export interface ChaptersDropdownOption {
    icon: React.ReactNode;
    title: string;
    action?: () => void;
}

export const chaptersDoprdownOptions: ChaptersDropdownOption[] = [
    {
        icon: <Eye className="mr-1 h-4 w-4" />,
        title: 'View PDF'
    },
    {
        icon: <Download className="mr-1 h-4 w-4" />,
        title: 'Download PDF'
    },
    {
        icon: <Edit className="mr-1 h-4 w-4" />,
        title: 'Edit'
    }
]