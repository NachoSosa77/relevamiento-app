'use server'

import axiosInstance from '@/utils/axiosInstance';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { newPassword } = await request.json();
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      throw new Error('No token found');
    }

    const response = await axiosInstance.put('/auth/change-password', { newPassword }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }
  } catch (error) {
    console.error('Update password error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to update password' }), { status: 400 });
  }
}
