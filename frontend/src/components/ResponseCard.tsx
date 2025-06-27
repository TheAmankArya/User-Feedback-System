import type { UserResponse } from '../types/feedback';
import { Calendar, User, Mail, Tag } from 'lucide-react';

interface ResponseCardProps {
    response: UserResponse;
}

const ResponseCard = ({ response }: ResponseCardProps) => {
    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'bug-report':
                return 'bg-red-100 text-red-800';
            case 'feature-request':
                return 'bg-blue-100 text-blue-800';
            case 'suggestion':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'reviewed':
                return 'bg-blue-100 text-blue-800';
            case 'resolved':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatCategoryText = (category: string) => {
        return category.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(response.category)}`}>
                        <Tag className="w-3 h-3 mr-1" />
                        {formatCategoryText(response.category)}
                    </span>
                    {response.status && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(response.status)}`}>
                            {response.status.charAt(0).toUpperCase() + response.status.slice(1)}
                        </span>
                    )}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(response.timestamp)}
                </div>
            </div>

            <div className="mb-4">
                <p className="text-gray-800 leading-relaxed">{response.responseText}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <User className="w-4 h-4 mr-1" />
                        {response.userName}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-1" />
                        {response.email}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResponseCard;
