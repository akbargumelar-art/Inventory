const API_BASE_URL = 'http://localhost:4000/api';

const getAuthToken = (): string | null => {
    const authData = sessionStorage.getItem('auth');
    if (authData) {
        return JSON.parse(authData).token;
    }
    return null;
};

export const apiClient = {
    async get<T>(endpoint: string): Promise<T> {
        return request<T>(endpoint, 'GET');
    },

    async post<T>(endpoint: string, body: any): Promise<T> {
        return request<T>(endpoint, 'POST', body);
    },

    async put<T>(endpoint: string, body: any): Promise<T> {
        return request<T>(endpoint, 'PUT', body);
    },

    async delete(endpoint: string): Promise<Response> {
        return request<Response>(endpoint, 'DELETE');
    }
};

async function request<T>(endpoint: string, method: string, body?: any): Promise<T> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    };
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || 'An API error occurred');
    }

    if (method === 'DELETE' && response.status === 204) {
        return response as T;
    }
    
    return response.json();
}
