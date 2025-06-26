export interface Feedback {
  id: string;
  userName: string;
  email: string;
  feedbackText: string;
  category: "suggestion" | "bug-report" | "feature-request" | "general";
  timestamp: string;
  status?: "pending" | "reviewed" | "resolved";
}

export interface FeedbackFormData {
  userName: string;
  email: string;
  feedbackText: string;
  category: "suggestion" | "bug-report" | "feature-request" | "general";
}

export interface FeedbackFilters {
  category?: string;
  status?: string;
  sortBy: "newest" | "oldest" | "category";
  searchTerm?: string;
}
