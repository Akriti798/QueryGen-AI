/**
 * Mock Service for QueryGen AI (Demo Mode)
 * Provides realistic mock database schema, SQL query generation,
 * and execution results without communicating with an active backend.
 */

// Sample Database Schema Definition
export const MOCK_DATABASE_SCHEMA = [
  {
    name: 'customers',
    description: 'Stores customer profile information and contact details',
    rowCount: 2450,
    columns: [
      { name: 'customer_id', type: 'INTEGER', isPrimary: true, isForeign: false, description: 'Unique customer identifier' },
      { name: 'customer_name', type: 'VARCHAR(120)', isPrimary: false, isForeign: false, description: 'Full legal name' },
      { name: 'email', type: 'VARCHAR(255)', isPrimary: false, isForeign: false, description: 'Primary email address' },
      { name: 'city', type: 'VARCHAR(100)', isPrimary: false, isForeign: false, description: 'Billing/shipping city' },
      { name: 'country', type: 'VARCHAR(100)', isPrimary: false, isForeign: false, description: 'Country of residence' },
      { name: 'created_at', type: 'TIMESTAMP', isPrimary: false, isForeign: false, description: 'Account registration date' },
    ],
  },
  {
    name: 'orders',
    description: 'Tracks customer purchase transactions and billing totals',
    rowCount: 14820,
    columns: [
      { name: 'order_id', type: 'INTEGER', isPrimary: true, isForeign: false, description: 'Unique order identifier' },
      { name: 'customer_id', type: 'INTEGER', isPrimary: false, isForeign: true, references: 'customers.customer_id', description: 'Foreign key referencing customers' },
      { name: 'order_date', type: 'DATE', isPrimary: false, isForeign: false, description: 'Date the order was placed' },
      { name: 'status', type: 'VARCHAR(30)', isPrimary: false, isForeign: false, description: 'Order status (Completed, Pending, Cancelled)' },
      { name: 'amount', type: 'DECIMAL(10,2)', isPrimary: false, isForeign: false, description: 'Total monetary value' },
    ],
  },
  {
    name: 'order_items',
    description: 'Line items associated with each customer order',
    rowCount: 42100,
    columns: [
      { name: 'item_id', type: 'INTEGER', isPrimary: true, isForeign: false, description: 'Primary line item ID' },
      { name: 'order_id', type: 'INTEGER', isPrimary: false, isForeign: true, references: 'orders.order_id', description: 'Foreign key referencing orders' },
      { name: 'product_id', type: 'INTEGER', isPrimary: false, isForeign: true, references: 'products.product_id', description: 'Foreign key referencing products' },
      { name: 'quantity', type: 'INTEGER', isPrimary: false, isForeign: false, description: 'Quantity purchased' },
      { name: 'unit_price', type: 'DECIMAL(10,2)', isPrimary: false, isForeign: false, description: 'Price per unit at sale time' },
    ],
  },
  {
    name: 'products',
    description: 'Product catalog including pricing and available inventory',
    rowCount: 560,
    columns: [
      { name: 'product_id', type: 'INTEGER', isPrimary: true, isForeign: false, description: 'Primary product SKU ID' },
      { name: 'product_name', type: 'VARCHAR(150)', isPrimary: false, isForeign: false, description: 'Commercial product name' },
      { name: 'category_id', type: 'INTEGER', isPrimary: false, isForeign: true, references: 'categories.category_id', description: 'Foreign key referencing categories' },
      { name: 'unit_price', type: 'DECIMAL(10,2)', isPrimary: false, isForeign: false, description: 'Base retail price' },
      { name: 'stock_quantity', type: 'INTEGER', isPrimary: false, isForeign: false, description: 'Current warehouse stock count' },
    ],
  },
  {
    name: 'categories',
    description: 'High-level taxonomies for product grouping',
    rowCount: 18,
    columns: [
      { name: 'category_id', type: 'INTEGER', isPrimary: true, isForeign: false, description: 'Primary category identifier' },
      { name: 'category_name', type: 'VARCHAR(80)', isPrimary: false, isForeign: false, description: 'Category title' },
      { name: 'description', type: 'TEXT', isPrimary: false, isForeign: false, description: 'Category synopsis' },
    ],
  },
  {
    name: 'employees',
    description: 'Internal organization staff, compensation and departmental info',
    rowCount: 124,
    columns: [
      { name: 'employee_id', type: 'INTEGER', isPrimary: true, isForeign: false, description: 'Primary employee ID' },
      { name: 'first_name', type: 'VARCHAR(60)', isPrimary: false, isForeign: false, description: 'Legal given name' },
      { name: 'last_name', type: 'VARCHAR(60)', isPrimary: false, isForeign: false, description: 'Family name' },
      { name: 'department', type: 'VARCHAR(80)', isPrimary: false, isForeign: false, description: 'Department assignment' },
      { name: 'salary', type: 'DECIMAL(10,2)', isPrimary: false, isForeign: false, description: 'Annual compensation (USD)' },
      { name: 'hire_date', type: 'DATE', isPrimary: false, isForeign: false, description: 'Date of commencement' },
    ],
  },
];

// Curated Example Prompts
export const EXAMPLE_PROMPTS = [
  'Show all employees earning more than 50000.',
  'Find the top 5 customers by total spending.',
  'Count the total number of orders.',
  'Show monthly sales for the current year.',
  'Find customers who have never placed an order.',
];

// Predefined Mock SQL & Results Mappings
const MOCK_KNOWLEDGE_BASE = [
  {
    matches: ['earning more than 50000', 'salary > 50000', 'employees earning', 'salary more than 50000'],
    sql: `SELECT 
    employee_id,
    first_name || ' ' || last_name AS full_name,
    department,
    salary,
    hire_date
FROM employees
WHERE salary > 50000.00
ORDER BY salary DESC;`,
    explanation: 'Filters all active staff members whose compensation exceeds $50,000, ordered from highest to lowest salary.',
    columns: ['employee_id', 'full_name', 'department', 'salary', 'hire_date'],
    rows: [
      { employee_id: 104, full_name: 'Sarah Connor', department: 'Engineering', salary: '$124,500.00', hire_date: '2021-03-15' },
      { employee_id: 112, full_name: 'Alex Rivera', department: 'Product Management', salary: '$118,000.00', hire_date: '2020-08-01' },
      { employee_id: 108, full_name: 'Priya Patel', department: 'Engineering', salary: '$112,400.00', hire_date: '2022-01-10' },
      { employee_id: 125, full_name: 'Michael Chang', department: 'Data Science', salary: '$98,500.00', hire_date: '2021-11-20' },
      { employee_id: 119, full_name: 'Elena Rostova', department: 'Marketing', salary: '$76,200.00', hire_date: '2023-04-05' },
      { employee_id: 130, full_name: 'David Okafor', department: 'Customer Success', salary: '$54,000.00', hire_date: '2022-09-12' },
    ],
  },
  {
    matches: ['top 5 customers', 'total spending', 'spent the most', 'highest spending'],
    sql: `SELECT 
    c.customer_id,
    c.customer_name,
    c.email,
    c.city,
    COUNT(o.order_id) AS orders_count,
    ROUND(SUM(o.amount), 2) AS total_spent
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status = 'Completed'
GROUP BY c.customer_id, c.customer_name, c.email, c.city
ORDER BY total_spent DESC
LIMIT 5;`,
    explanation: 'Aggregates completed purchase amounts per customer, sorting in descending order and limiting to the top 5 spenders.',
    columns: ['customer_id', 'customer_name', 'email', 'city', 'orders_count', 'total_spent'],
    rows: [
      { customer_id: 301, customer_name: 'Liam Vance', email: 'liam.vance@techcorp.io', city: 'San Francisco', orders_count: 28, total_spent: '$14,250.00' },
      { customer_id: 142, customer_name: 'Sophia Chen', email: 'sophia.c@apexglobal.com', city: 'Seattle', orders_count: 22, total_spent: '$11,820.50' },
      { customer_id: 588, customer_name: 'Noah Kim', email: 'noah.kim@lumina.dev', city: 'Austin', orders_count: 19, total_spent: '$9,430.00' },
      { customer_id: 204, customer_name: 'Emma Watson', email: 'e.watson@horizon.org', city: 'Boston', orders_count: 17, total_spent: '$8,950.25' },
      { customer_id: 419, customer_name: 'Carlos Mendez', email: 'cmendez@innovate.co', city: 'Denver', orders_count: 15, total_spent: '$7,640.80' },
    ],
  },
  {
    matches: ['count the total number of orders', 'total number of orders', 'count orders'],
    sql: `SELECT 
    COUNT(*) AS total_orders,
    ROUND(SUM(amount), 2) AS total_revenue,
    ROUND(AVG(amount), 2) AS average_order_value,
    MIN(order_date) AS earliest_order,
    MAX(order_date) AS latest_order
FROM orders;`,
    explanation: 'Calculates high-level statistical aggregates across all registered order records.',
    columns: ['total_orders', 'total_revenue', 'average_order_value', 'earliest_order', 'latest_order'],
    rows: [
      { total_orders: 14820, total_revenue: '$3,849,205.50', average_order_value: '$259.73', earliest_order: '2023-01-01', latest_order: '2026-10-28' },
    ],
  },
  {
    matches: ['monthly sales', 'sales for the current year', 'monthly revenue'],
    sql: `SELECT 
    TO_CHAR(order_date, 'YYYY-MM') AS sales_month,
    COUNT(order_id) AS total_transactions,
    ROUND(SUM(amount), 2) AS monthly_revenue
FROM orders
WHERE order_date >= DATE_TRUNC('year', CURRENT_DATE)
  AND status = 'Completed'
GROUP BY sales_month
ORDER BY sales_month ASC;`,
    explanation: 'Groups order revenue by month for the active fiscal year to highlight sales trajectory.',
    columns: ['sales_month', 'total_transactions', 'monthly_revenue'],
    rows: [
      { sales_month: '2026-01', total_transactions: 1120, monthly_revenue: '$289,450.00' },
      { sales_month: '2026-02', total_transactions: 1045, monthly_revenue: '$264,120.00' },
      { sales_month: '2026-03', total_transactions: 1290, monthly_revenue: '$338,900.50' },
      { sales_month: '2026-04', total_transactions: 1180, monthly_revenue: '$305,430.00' },
      { sales_month: '2026-05', total_transactions: 1350, monthly_revenue: '$352,180.25' },
      { sales_month: '2026-06', total_transactions: 1420, monthly_revenue: '$371,600.00' },
      { sales_month: '2026-07', total_transactions: 1510, monthly_revenue: '$395,220.00' },
      { sales_month: '2026-08', total_transactions: 1480, monthly_revenue: '$388,400.00' },
      { sales_month: '2026-09', total_transactions: 1560, monthly_revenue: '$412,050.00' },
      { sales_month: '2026-10', total_transactions: 1390, monthly_revenue: '$368,910.75' },
    ],
  },
  {
    matches: ['never placed an order', 'no orders', 'inactive customers', 'without orders'],
    sql: `SELECT 
    c.customer_id,
    c.customer_name,
    c.email,
    c.city,
    c.country,
    c.created_at
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL
ORDER BY c.created_at DESC;`,
    explanation: 'Uses a LEFT JOIN to identify registered customers who currently possess zero matching records in the orders table.',
    columns: ['customer_id', 'customer_name', 'email', 'city', 'country', 'created_at'],
    rows: [
      { customer_id: 1892, customer_name: 'Harper Green', email: 'harper.g@acme.org', city: 'Portland', country: 'United States', created_at: '2026-09-14 11:20:00' },
      { customer_id: 1944, customer_name: 'Lucas Silva', email: 'lucas.silva@braziltech.com', city: 'São Paulo', country: 'Brazil', created_at: '2026-09-28 16:45:00' },
      { customer_id: 2011, customer_name: 'Amara Becker', email: 'a.becker@berlinhub.de', city: 'Berlin', country: 'Germany', created_at: '2026-10-02 09:15:00' },
      { customer_id: 2150, customer_name: 'Kenji Sato', email: 'kenji.s@tokyosystems.jp', city: 'Tokyo', country: 'Japan', created_at: '2026-10-19 14:00:00' },
    ],
  },
];

// Helper: match query text to knowledge base or fallback
function findMockMatch(naturalLanguagePrompt) {
  const normalized = naturalLanguagePrompt.toLowerCase();
  for (const item of MOCK_KNOWLEDGE_BASE) {
    if (item.matches.some(m => normalized.includes(m.toLowerCase()))) {
      return item;
    }
  }

  // Dynamic fallback for arbitrary user input
  const sanitized = naturalLanguagePrompt.replace(/[^a-zA-Z0-9 ]/g, '').trim();
  return {
    sql: `-- Generated based on: "${naturalLanguagePrompt}"
SELECT 
    c.customer_id,
    c.customer_name,
    c.email,
    COUNT(o.order_id) AS total_orders,
    COALESCE(SUM(o.amount), 0.00) AS total_spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE c.customer_name ILIKE '%${sanitized || 'customer'}%'
   OR c.email ILIKE '%${sanitized || 'customer'}%'
GROUP BY c.customer_id, c.customer_name, c.email
ORDER BY total_spent DESC
LIMIT 10;`,
    explanation: `Query tailored to examine customers matching "${naturalLanguagePrompt}".`,
    columns: ['customer_id', 'customer_name', 'email', 'total_orders', 'total_spent'],
    rows: [
      { customer_id: 101, customer_name: 'Alice Cooper', email: 'alice@example.com', total_orders: 8, total_spent: '$2,340.00' },
      { customer_id: 102, customer_name: 'Bob Martin', email: 'bob.m@example.com', total_orders: 5, total_spent: '$1,120.50' },
      { customer_id: 103, customer_name: 'Catherine Bell', email: 'cbell@example.com', total_orders: 12, total_spent: '$4,890.00' },
    ],
  };
}

export const mockService = {
  // Test connection simulation
  testConnection: async (config) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (!config.host || !config.database || !config.username) {
      return { success: false, message: 'Host, database name, and username are required fields.' };
    }
    return {
      success: true,
      message: `Connection test succeeded: PostgreSQL server reachable at ${config.host}:${config.port || 5432}.`,
      latencyMs: 38,
      serverVersion: 'PostgreSQL 16.2 (Debian 16.2-1.pgdg120+2)',
    };
  },

  // Connect database simulation
  connectDatabase: async (config) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      success: true,
      connected: true,
      database: config.database || 'e_commerce_db',
      host: config.host || 'localhost',
      port: config.port || 5432,
      username: config.username || 'postgres',
      ssl: false,
      poolSize: 10,
      connectedAt: new Date().toISOString(),
      message: `Successfully connected to PostgreSQL database "${config.database || 'e_commerce_db'}".`,
    };
  },

  // Disconnect database simulation
  disconnectDatabase: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      success: true,
      connected: false,
      message: 'Database session closed safely.',
    };
  },

  // Generate SQL simulation
  generateSQL: async (naturalLanguagePrompt) => {
    // Simulate realistic AI generation latency (600-1100ms)
    await new Promise((resolve) => setTimeout(resolve, 850));
    const match = findMockMatch(naturalLanguagePrompt);
    return {
      success: true,
      prompt: naturalLanguagePrompt,
      sql: match.sql,
      explanation: match.explanation,
      generatedAt: new Date().toISOString(),
      model: 'QueryGen-Postgres-v1.2 (Mock / Demo Mode)',
    };
  },

  // Execute SQL simulation
  executeSQL: async (sqlQuery) => {
    // Simulate query execution time (400-800ms)
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Determine matching rows
    let match = null;
    for (const item of MOCK_KNOWLEDGE_BASE) {
      // Check if executed SQL contains distinctive tokens from predefined mock
      if (sqlQuery.includes(item.columns[0]) && sqlQuery.includes(item.columns[1])) {
        match = item;
        break;
      }
    }

    if (!match) {
      match = findMockMatch(sqlQuery);
    }

    const executionTimeMs = (Math.random() * 30 + 15).toFixed(1);

    return {
      success: true,
      sql: sqlQuery,
      columns: match.columns,
      rows: match.rows,
      rowCount: match.rows.length,
      executionTimeMs: Number(executionTimeMs),
      executedAt: new Date().toISOString(),
      message: `Query completed successfully. ${match.rows.length} rows returned in ${executionTimeMs}ms.`,
    };
  },

  // Get schema
  getSchema: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      success: true,
      tables: MOCK_DATABASE_SCHEMA,
    };
  },

  // Pre-seeded initial history
  getInitialHistory: () => [
    {
      id: 'hist-1',
      question: 'Find the top 5 customers by total spending.',
      sql: `SELECT 
    c.customer_id,
    c.customer_name,
    c.email,
    ROUND(SUM(o.amount), 2) AS total_spent
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status = 'Completed'
GROUP BY c.customer_id, c.customer_name, c.email
ORDER BY total_spent DESC
LIMIT 5;`,
      status: 'success',
      rowCount: 5,
      executionTimeMs: 24.6,
      timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    },
    {
      id: 'hist-2',
      question: 'Show all employees earning more than 50000.',
      sql: `SELECT employee_id, first_name || ' ' || last_name AS full_name, department, salary
FROM employees
WHERE salary > 50000.00
ORDER BY salary DESC;`,
      status: 'success',
      rowCount: 6,
      executionTimeMs: 18.2,
      timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    },
    {
      id: 'hist-3',
      question: 'Count the total number of orders.',
      sql: `SELECT COUNT(*) AS total_orders, ROUND(SUM(amount), 2) AS total_revenue FROM orders;`,
      status: 'success',
      rowCount: 1,
      executionTimeMs: 12.9,
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
  ],
};
