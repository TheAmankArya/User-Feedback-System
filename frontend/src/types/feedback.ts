export interface UserResponse {
  id: string;
  userName: string;
  email: string;
  responseText: string;
  category: "suggestion" | "bug-report" | "feature-request" | "general";
  timestamp: string;
  status?: "pending" | "reviewed" | "resolved";
}

export interface UserResponseForm {
  userName: string;
  email: string;
  responseText: string;
  category: "suggestion" | "bug-report" | "feature-request" | "general";
}

export interface ResponseFilters {
  category?: string;
  status?: string;
  sortBy: "newest" | "oldest" | "category";
  searchTerm?: string;
}
