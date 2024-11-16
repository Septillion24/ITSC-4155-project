import type { Cookies } from '@sveltejs/kit';
import { SessionManager } from '../../../classes/SessionManager.js';
import type { User } from '../../../classes/User.js';

export async function GET({ url, cookies }): Promise<Response> {
	const googleCode = url.searchParams.get('code');
	const session = await SessionManager.getSessionFromGoogleCode(googleCode!);
	const user = await SessionManager.getUserFromUUID(session.uuid);

	storeSessionDataInCookies(cookies, session.uuid, user);

	return new Response(JSON.stringify(session), { status: 200 });
}

function storeSessionDataInCookies(cookies: Cookies, token: string, user: User) {
	cookies.set('token', token, {
		path: '/',
		httpOnly: false,
		sameSite: 'lax',
		secure: false
	});
	cookies.set('userID', `${user.id}`, {
		path: '/',
		httpOnly: false,
		sameSite: 'lax',
		secure: false
	});
	cookies.set('userFirstName', user.first_name, {
		path: '/',
		httpOnly: false,
		sameSite: 'lax',
		secure: false
	});
}
