export interface NewUser {
    email: string;
    password: string;
    role?: string;
}

export interface User {
    id: number;
    email: string;
    role: string;
}