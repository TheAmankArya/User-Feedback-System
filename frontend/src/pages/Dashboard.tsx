import { useState, useMemo, useEffect } from 'react';
import type { Feedback, FeedbackFilters } from '../types/feedback';
import FeedbackCard from '../components/FeedbackCard';
import { Search, Filter, SortDesc, BarChart } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4444';

const Dashboard = () => {
    const [filters, setFilters] = useState<FeedbackFilters>({
        category: '',
        status: '',
        sortBy: 'newest',
        searchTerm: ''
    });

    const [feedback, setFeedback] = useState<Feedback[]>([]);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/feedback?limit=100&page=1&sortBy=newest`);
                const json = await res.json();
                if (json.success) {
                    setFeedback(json.data.feedback);
                }
            } catch (err) {
                console.error('Failed to fetch feedback', err);
            }
        };
        fetchFeedback();
    }, []);

    const handleFilterChange = (key: keyof FeedbackFilters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const filteredAndSortedFeedback = useMemo(() => {
        let filtered = [...feedback];

        // Apply category filter
        if (filters.category) {
            filtered = filtered.filter(feedback => feedback.category === filters.category);
        }

        // Apply status filter
        if (filters.status) {
            filtered = filtered.filter(feedback => feedback.status === filters.status);
        }

        // Apply search filter
        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(feedback =>
                feedback.userName.toLowerCase().includes(searchLower) ||
                feedback.email.toLowerCase().includes(searchLower) ||
                feedback.feedbackText.toLowerCase().includes(searchLower)
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (filters.sortBy) {
                case 'newest':
                    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                case 'oldest':
                    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
                case 'category':
                    return a.category.localeCompare(b.category);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [filters, feedback]);

    const getCategoryStats = () => {
        const stats = feedback.reduce((acc, feedback) => {
            acc[feedback.category] = (acc[feedback.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            total: feedback.length,
            suggestions: stats['suggestion'] || 0,
            bugReports: stats['bug-report'] || 0,
            featureRequests: stats['feature-request'] || 0,
            general: stats['general'] || 0
        };
    };

    const stats = getCategoryStats();

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback Dashboard</h1>
                    <p className="text-gray-600">
                        Monitor and manage all user feedback submissions
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center">
                            <BarChart className="w-8 h-8 text-blue-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Suggestions</p>
                            <p className="text-2xl font-bold text-green-600">{stats.suggestions}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Bug Reports</p>
                            <p className="text-2xl font-bold text-red-600">{stats.bugReports}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Feature Requests</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.featureRequests}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">General</p>
                            <p className="text-2xl font-bold text-gray-600">{stats.general}</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                    <div className="flex items-center mb-4">
                        <Filter className="w-5 h-5 text-gray-500 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900">Filters & Search</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search
                            </label>
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search feedback..."
                                    value={filters.searchTerm || ''}
                                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                value={filters.category || ''}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Categories</option>
                                <option value="suggestion">Suggestion</option>
                                <option value="bug-report">Bug Report</option>
                                <option value="feature-request">Feature Request</option>
                                <option value="general">General</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={filters.status || ''}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sort By
                            </label>
                            <div className="relative">
                                <SortDesc className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => handleFilterChange('sortBy', e.target.value as 'newest' | 'oldest' | 'category')}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="category">By Category</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="mb-4 flex justify-between items-center">
                    <p className="text-gray-600">
                        Showing {filteredAndSortedFeedback.length} of {feedback.length} feedback items
                    </p>
                </div>

                {/* Feedback List */}
                {filteredAndSortedFeedback.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <Search className="w-12 h-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
                        <p className="text-gray-600">
                            Try adjusting your filters or search terms to find more results.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredAndSortedFeedback.map(feedback => (
                            <FeedbackCard key={feedback.id} feedback={feedback} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard; 