import { mockService } from './mockService';

/**
 * Centralized API Service for QueryGen AI.
 * Communicates with the FastAPI backend at VITE_API_BASE_URL when in 'live' mode,
 * and delegates to mockService when in 'demo' mode.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const APP_MODE = import.meta.env.VITE_APP_MODE || 'demo';

export const isDemoMode = () => APP_MODE === 'demo';

/**
 * Reusable HTTP client helper with standardized error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`[API Error] Request failed for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Test PostgreSQL database credentials before persisting connection
 */
export async function testDatabaseConnection(connectionConfig) {
  if (isDemoMode()) {
    return mockService.testConnection(connectionConfig);
  }
  return request('/api/v1/database/test', {
    method: 'POST',
    body: JSON.stringify(connectionConfig),
  });
}

/**
 * Establish active database connection session
 */
export async function connectDatabase(connectionConfig) {
  if (isDemoMode()) {
    return mockService.connectDatabase(connectionConfig);
  }
  return request('/api/v1/database/connect', {
    method: 'POST',
    body: JSON.stringify(connectionConfig),
  });
}

/**
 * Close active database connection session
 */
export async function disconnectDatabase() {
  if (isDemoMode()) {
    return mockService.disconnectDatabase();
  }
  return request('/api/v1/database/disconnect', {
    method: 'POST',
  });
}

/**
 * Generate SQL from Natural Language prompt via LLM
 */
export async function generateSQL(naturalLanguagePrompt) {
  if (isDemoMode()) {
    return mockService.generateSQL(naturalLanguagePrompt);
  }
  return request('/api/v1/query/generate', {
    method: 'POST',
    body: JSON.stringify({ prompt: naturalLanguagePrompt }),
  });
}

/**
 * Execute validated SQL query against the connected database
 */
export async function executeSQL(sqlQuery) {
  if (isDemoMode()) {
    return mockService.executeSQL(sqlQuery);
  }
  return request('/api/v1/query/execute', {
    method: 'POST',
    body: JSON.stringify({ sql: sqlQuery }),
  });
}

/**
 * Fetch introspected database schema tables and columns
 */
export async function getDatabaseSchema() {
  if (isDemoMode()) {
    return mockService.getSchema();
  }
  return request('/api/v1/database/schema', {
    method: 'GET',
  });
}

/**
 * Retrieve query execution history
 */
export async function getQueryHistory() {
  if (isDemoMode()) {
    return { success: true, history: mockService.getInitialHistory() };
  }
  return request('/api/v1/query/history', {
    method: 'GET',
  });
}
