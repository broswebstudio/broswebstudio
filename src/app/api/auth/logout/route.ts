import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });
  
  res.cookies.set({
    name: 'bws_admin_token',
    value: '',
    httpOnly: true,
    path: '/',
    expires: new Date(0), // Expire immediately
  });

  return res;
}
