import apiClient from "./client";

// Dashboard API endpoints
export const dashboardApi = {
  // Get all dashboards
  getAllDashboards: () => apiClient.get("/dashboards/"),

  // Get dashboard by ID
  getDashboard: (id) => apiClient.get(`/dashboard/${id}`),

  // Search dashboards
  searchDashboards: (query) =>
    apiClient.get(`/dashboards/search/?q=${encodeURIComponent(query)}`),

  // Create new dashboard
  createDashboard: (dashboardData) =>
    apiClient.post("/dashboard/", dashboardData),

  // Update dashboard
  updateDashboard: (id, dashboardData) =>
    apiClient.put(`/dashboard/${id}`, dashboardData),

  // Delete dashboard
  deleteDashboard: (id) => apiClient.delete(`/dashboard/${id}`),

  // Get dashboards by workspace
  getDashboardsByWorkspace: (workspaceId) =>
    apiClient.get(`/dashboards/workspace/${workspaceId}`),
};

// User API endpoints
export const userApi = {
  // Get all users
  getAllUsers: () => apiClient.get("/users/"),

  // Get user by ID
  getUser: (id) => apiClient.get(`/user/${id}`),

  // Search users
  searchUsers: (name) =>
    apiClient.get(`/user/search/?name=${encodeURIComponent(name)}`),

  // Create user
  createUser: (userData) => apiClient.post("/user/", userData),

  // Update user
  updateUser: (id, userData) => apiClient.put(`/user/${id}`, userData),

  // Patch user
  patchUser: (id, userData) => apiClient.patch(`/user/${id}`, userData),

  // Delete user
  deleteUser: (id) => apiClient.delete(`/user/${id}`),

  // Login
  login: (credentials) => apiClient.post("/login", credentials),

  // Register
  register: (userData) => apiClient.post("/register", userData),
};

// Group API endpoints
export const groupApi = {
  // Get all groups
  getAllGroups: () => apiClient.get("/groups/"),

  // Get group by ID
  getGroup: (id) => apiClient.get(`/group/${id}`),

  // Search groups
  searchGroups: (name) =>
    apiClient.get(`/groups/search/?name=${encodeURIComponent(name)}`),

  // Create group
  createGroup: (groupData) => apiClient.post("/group/", groupData),

  // Update group
  updateGroup: (id, groupData) => apiClient.put(`/group/${id}`, groupData),

  // Patch group
  patchGroup: (id, groupData) => apiClient.patch(`/group/${id}`, groupData),

  // Delete group
  deleteGroup: (id) => apiClient.delete(`/group/${id}`),
};

// Health check
export const healthApi = {
  checkHealth: () => apiClient.get("/health"),
};
