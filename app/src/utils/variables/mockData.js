const dashboards_list = [
  {
    id: 1,
    workspaceId: "22eff978-155c-4454-a002-30b3de540b32",
    workspace: "Sales",
    dashboardId: "9f971e88-c287-4286-976d-ab24a3f1e112",
    title: "Sales Teams Quarterly Performance",
    description: "Quarterly performance metrics for sales teams",
    category: "Sales",
    categoryColor: "blue",
  },
  {
    id: 2,
    workspaceId: "22eff978-155c-4454-a002-30b3de540b32",
    workspace: "Sales",
    dashboardId: "641157d8-582e-4161-83bd-3da433ce938f",
    title: "Root Cause Analysis Dashboard",
    description: "Analyze the root causes of sales performance issues",
    category: "Sales",
    categoryColor: "emerald",
  },
  {
    id: 3,
    workspaceId: "22eff978-155c-4454-a002-30b3de540b32",
    workspace: "Sales",
    dashboardId: "1de786d4-1414-407f-a39d-7dc8e6b28728",
    title: "Performance Dashboard",
    description: "Monitor key performance indicators for sales teams",
    category: "Performance",
    categoryColor: "violet",
  },
  {
    id: 4,
    workspaceId: "22eff978-155c-4454-a002-30b3de540b32",
    workspace: "Sales",
    dashboardId: "84199815-6dd4-461f-b52d-39d0a9ded8a4",
    title: "GeoSales Dashboard - Azure Map",
    description: "Visualize sales data on a geographical map",
    category: "Map",
    categoryColor: "blue",
  },
  {
    id: 5,
    workspaceId: "22eff978-155c-4454-a002-30b3de540b32",
    workspace: "Agents",
    dashboardId: "577da494-5741-4f43-a67c-ca690c668dc4",
    title: "Agents Performance",
    description:
      "Monitor key performance indicators for customer support agents",
    category: "Performance",
    categoryColor: "yellow",
  },
];

const groups_list = [
  {
    id: 1,
    name: "Sales Managers",
    description: "Group for all sales managers",
    members: [1, 2],
    dashboards: [1, 2],
  },
  {
    id: 2,
    name: "Support Agents",
    description: "Customer support agents group",
    members: [5, 6],
    dashboards: [2, 5],
  },
];

const users_list = [
  {
    id: 1,
    fullName: "John Doe",
    email: "johndoe@example.com",
    role: "Analyst",
    isActive: true,
    lastLogin: "2023-04-10 08:20",
  },
  {
    id: 2,
    fullName: "Jane Smith",
    email: "janesmith@example.com",
    role: "Admin",
    isActive: true,
    lastLogin: "2023-04-11 14:35",
  },
  {
    id: 3,
    fullName: "Mike Johnson",
    email: "mikejohnson@example.com",
    role: "Viewer",
    isActive: false,
    lastLogin: "2023-04-08 10:15",
  },
  {
    id: 4,
    fullName: "Sarah Wilson",
    email: "sarahwilson@example.com",
    role: "Admin",
    isActive: true,
    lastLogin: "2023-04-12 16:42",
  },
  {
    id: 5,
    fullName: "David Brown",
    email: "davidbrown@example.com",
    role: "Analyst",
    isActive: true,
    lastLogin: "2023-04-09 11:28",
  },
  {
    id: 6,
    fullName: "Lisa Davis",
    email: "lisadavis@example.com",
    role: "Viewer",
    isActive: false,
    lastLogin: "2023-04-07 09:45",
  },
];

export { dashboards_list, users_list, groups_list };
