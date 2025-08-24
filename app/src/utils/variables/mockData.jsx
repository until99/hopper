import {
  ChartBarIcon,
  ChartLineIcon,
  ChartPieSliceIcon,
  DatabaseIcon,
  FileSqlIcon,
  FileTextIcon,
  FolderOpenIcon,
  GearIcon,
  UsersIcon,
} from "@phosphor-icons/react";

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

let menu_items = [
  {
    route: "dashboard/list-dashboards",
    icon: <ChartBarIcon size={22} className="mr-2 inline-block" />,
    routeName: "My Dashboards",
    admin_only: false,
  },
  {
    route: "admin/dashboards",
    icon: <ChartLineIcon size={22} className="mr-2 inline-block" />,
    routeName: "Dashboards",
    admin_only: true,
  },
  {
    route: "admin/users",
    icon: <UsersIcon size={22} className="mr-2 inline-block" />,
    routeName: "Users",
    admin_only: true,
  },
  {
    route: "admin/groups",
    icon: <FolderOpenIcon size={22} className="mr-2 inline-block" />,
    routeName: "Groups",
    admin_only: true,
  },
  {
    route: "admin/workspaces",
    icon: <ChartPieSliceIcon size={22} className="mr-2 inline-block" />,
    routeName: "Workspaces",
    admin_only: true,
  },
  {
    route: "reports/list-reports",
    icon: <FileTextIcon size={22} className="mr-2 inline-block" />,
    routeName: "My Reports",
    admin_only: false,
  },
  {
    route: "admin/reports",
    icon: <FileSqlIcon size={22} className="mr-2 inline-block" />,
    routeName: "Reports",
    admin_only: true,
  },
  {
    route: "admin/databases",
    icon: <DatabaseIcon size={22} className="mr-2 inline-block" />,
    routeName: "Databases",
    admin_only: true,
  },
  {
    route: "admin/settings",
    icon: <GearIcon size={22} className="mr-2 inline-block" />,
    routeName: "Settings",
    admin_only: false,
  },
];

const users_list = [
  {
    id: 1,
    fullName: "John Doe",
    username: "john.doe",
    email: "johndoe@example.com",
    password: "Password123!",
    role: "Analyst",
    isActive: true,
    lastLogin: "2023-04-10 08:20",
  },
  {
    id: 2,
    fullName: "Jane Smith",
    username: "jane.smith",
    email: "janesmith@example.com",
    password: "SecurePass456@",
    role: "Admin",
    isActive: true,
    lastLogin: "2023-04-11 14:35",
  },
  {
    id: 3,
    fullName: "Mike Johnson",
    username: "mike.johnson",
    email: "mikejohnson@example.com",
    password: "MyPassword789#",
    role: "Viewer",
    isActive: false,
    lastLogin: "2023-04-08 10:15",
  },
  {
    id: 4,
    fullName: "Sarah Wilson",
    username: "sarah.wilson",
    email: "sarahwilson@example.com",
    password: "AdminPass321$",
    role: "Admin",
    isActive: true,
    lastLogin: "2023-04-12 16:42",
  },
  {
    id: 5,
    fullName: "David Brown",
    username: "david.brown",
    email: "davidbrown@example.com",
    password: "AnalystKey654%",
    role: "Analyst",
    isActive: true,
    lastLogin: "2023-04-09 11:28",
  },
  {
    id: 6,
    fullName: "Lisa Davis",
    username: "lisa.davis",
    email: "lisadavis@example.com",
    password: "ViewerPass987&",
    role: "Viewer",
    isActive: false,
    lastLogin: "2023-04-07 09:45",
  },
];

const sql_queries = [
  {
    id: 1,
    name: "Sales Report by Region",
    description:
      "Monthly sales report grouped by region with optional date filter",
    database: "sales_db",
    connectionString: "server=localhost;database=sales_db;user=admin",
    workspace: "Sales",
    query: `SELECT 
      region,
      SUM(amount) as total_sales,
      COUNT(*) as transactions_count
    FROM sales 
    WHERE date >= :start_date 
    AND (:region IS NULL OR region = :region)
    GROUP BY region
    ORDER BY total_sales DESC`,
    bindVariables: [
      {
        name: "start_date",
        type: "date",
        required: true,
        defaultValue: null,
        description: "Start date for the report",
      },
      {
        name: "region",
        type: "string",
        required: false,
        defaultValue: null,
        description: "Filter by specific region (optional)",
      },
    ],
    category: "Sales",
    categoryColor: "blue",
    createdBy: 1,
    createdAt: "2023-04-10 10:30",
    updatedAt: "2023-04-12 15:20",
  },
  {
    id: 2,
    name: "Customer Performance",
    description: "Customer performance metrics with lifetime value calculation",
    database: "crm_db",
    connectionString: "server=localhost;database=crm_db;user=admin",
    workspace: "Sales",
    query: `SELECT 
      customer_id,
      customer_name,
      SUM(order_value) as lifetime_value,
      COUNT(order_id) as total_orders,
      AVG(order_value) as avg_order_value
    FROM customers c
    LEFT JOIN orders o ON c.id = o.customer_id
    WHERE c.status = 'active'
    AND (:min_orders IS NULL OR COUNT(order_id) >= :min_orders)
    GROUP BY customer_id, customer_name
    ORDER BY lifetime_value DESC
    LIMIT :limit_records`,
    bindVariables: [
      {
        name: "min_orders",
        type: "number",
        required: false,
        defaultValue: 1,
        description: "Minimum number of orders to include customer",
      },
      {
        name: "limit_records",
        type: "number",
        required: true,
        defaultValue: 100,
        description: "Maximum number of records to return",
      },
    ],
    category: "Analytics",
    categoryColor: "emerald",
    createdBy: 2,
    createdAt: "2023-04-11 09:15",
    updatedAt: "2023-04-11 09:15",
  },
  {
    id: 3,
    name: "Inventory Status",
    description: "Current inventory levels with low stock alerts",
    database: "inventory_db",
    connectionString: "server=localhost;database=inventory_db;user=admin",
    workspace: "Operations",
    query: `SELECT 
      product_code,
      product_name,
      current_stock,
      minimum_stock,
      CASE 
        WHEN current_stock <= minimum_stock THEN 'Low Stock'
        WHEN current_stock <= minimum_stock * 1.5 THEN 'Warning'
        ELSE 'Normal'
      END as stock_status
    FROM inventory
    WHERE (:category IS NULL OR category = :category)
    AND (:stock_status IS NULL OR 
      CASE 
        WHEN current_stock <= minimum_stock THEN 'Low Stock'
        WHEN current_stock <= minimum_stock * 1.5 THEN 'Warning'
        ELSE 'Normal'
      END = :stock_status)
    ORDER BY current_stock ASC`,
    bindVariables: [
      {
        name: "category",
        type: "string",
        required: false,
        defaultValue: null,
        description: "Filter by product category",
      },
      {
        name: "stock_status",
        type: "select",
        required: false,
        defaultValue: null,
        options: ["Low Stock", "Warning", "Normal"],
        description: "Filter by stock status",
      },
    ],
    category: "Operations",
    categoryColor: "yellow",
    createdBy: 1,
    createdAt: "2023-04-09 14:20",
    updatedAt: "2023-04-10 11:30",
  },
];

const databases = [
  {
    id: 1,
    name: "sales_db",
    type: "PostgreSQL",
    host: "localhost",
    port: 5432,
    database: "sales_db",
    description: "Sales database with transaction data",
  },
  {
    id: 2,
    name: "crm_db",
    type: "MySQL",
    host: "localhost",
    port: 3306,
    database: "crm_db",
    description: "Customer relationship management database",
  },
  {
    id: 3,
    name: "inventory_db",
    type: "SQL Server",
    host: "localhost",
    port: 1433,
    database: "inventory_db",
    description: "Inventory management system database",
  },
];

export {
  dashboards_list,
  users_list,
  groups_list,
  sql_queries,
  databases,
  menu_items,
};
