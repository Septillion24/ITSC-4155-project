import { SessionManager } from '../../../../classes/SessionManager';

export async function GET(): Promise<Response> {
	const redirectURL = await getURL();
	return new Response(JSON.stringify(redirectURL), { status: 200 });
}

async function getURL() {
	return SessionManager.getRedirectURL();
}
