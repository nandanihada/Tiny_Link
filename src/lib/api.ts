// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Types
export interface Link {
  id: string;
  code: string;
  originalUrl: string;
  clickCount: number;
  lastClickedAt: string | null;
  createdAt: string;
  updatedAt?: string;
  shortUrl: string;
}

export interface CreateLinkRequest {
  originalUrl: string;
  customCode?: string;
}

export interface LinksResponse {
  links: Link[];
  total: number;
  limit: number;
  offset: number;
}

// API Functions
export const api = {
  // Create a new short link
  async createLink(data: CreateLinkRequest): Promise<Link> {
    const response = await fetch(`${API_BASE_URL}/api/links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create link');
    }

    return response.json();
  },

  // Get all links with pagination
  async getLinks(params?: {
    limit?: number;
    offset?: number;
    sort?: 'recent' | 'popular';
  }): Promise<LinksResponse> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.sort) queryParams.append('sort', params.sort);

    const response = await fetch(
      `${API_BASE_URL}/api/links?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch links');
    }

    return response.json();
  },

  // Get link statistics by code
  async getLinkStats(code: string): Promise<Link> {
    const response = await fetch(`${API_BASE_URL}/api/links/${code}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch link stats');
    }

    return response.json();
  },

  // Delete a link
  async deleteLink(code: string): Promise<{ message: string; code: string }> {
    const response = await fetch(`${API_BASE_URL}/api/links/${code}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete link');
    }

    return response.json();
  },

  // Health check
  async healthCheck(): Promise<{
    ok: boolean;
    version: string;
    timestamp: string;
    database: string;
    uptime: number;
  }> {
    const response = await fetch(`${API_BASE_URL}/healthz`);

    if (!response.ok) {
      throw new Error('Health check failed');
    }

    return response.json();
  },
};

export default api;
