'use server'

import axiosInstance from '@/utils/axiosInstance';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const { email, password } = await request.json();
    try {
        const response = await axiosInstance.post('/auth/login', { email, password });
        if (response.status === 200) {
            cookies().set('token', response.data.token, { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            return new Response(JSON.stringify({ success: true, passwordNeedsToBeChanged: response.data.user.passwordNeedsToBeChanged }), { status: 200 });
        }
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401 });
        }
        return new Response(JSON.stringify({ success: false, error: 'An error occurred' }), { status: 500 });
    }
}
