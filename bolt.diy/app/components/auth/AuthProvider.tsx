import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface User {
    id: string;
    email: string;
    name?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name?: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Authentication is disabled - default anonymous user
const DEFAULT_USER: User = {
    id: 'anonymous',
    email: 'anonymous@workspace.local',
    name: 'Anonymous User'
};

export function AuthProvider({ children }: { children: ReactNode }) {
    // Always authenticated with default user
    const [user] = useState<User>(DEFAULT_USER);
    const [token] = useState<string>('disabled');
    const [isLoading] = useState(false);

    // Stub functions - authentication is disabled
    const login = async (email: string, password: string) => {
        console.log('Login disabled - authentication removed from system');
    };

    const register = async (email: string, password: string, name?: string) => {
        console.log('Registration disabled - authentication removed from system');
    };

    const logout = () => {
        console.log('Logout disabled - authentication removed from system');
    };

    const refreshUser = async () => {
        // No-op
    };

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated: true, // Always authenticated
        isLoading: false,
        login,
        register,
        logout,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
