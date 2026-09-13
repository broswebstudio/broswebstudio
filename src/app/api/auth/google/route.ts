import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  
  if (!clientId) {
    return NextResponse.json({ error: 'Google OAuth is not configured on the server.' }, { status: 500 });
  }

  const url = new URL(req.url);
  const redirectUri = `${url.protocol}//${url.host}/api/auth/google/callback`;

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', 'openid email profile');
  authUrl.searchParams.append('access_type', 'online');
  authUrl.searchParams.append('prompt', 'select_account');

  return NextResponse.redirect(authUrl.toString());
}
