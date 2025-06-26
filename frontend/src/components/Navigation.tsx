import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, BarChart3 } from 'lucide-react';

const Navigation = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <h1 className="text-xl font-bold text-gray-800">Feedback System</h1>
                        </div>
                    </div>
                    <div className="flex space-x-8">
                        <Link
                            to="/"
                            className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${isActive('/')
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Submit Feedback
                        </Link>
                        <Link
                            to="/dashboard"
                            className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${isActive('/dashboard')
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation; 