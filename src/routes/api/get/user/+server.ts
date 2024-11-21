import { SessionManager } from '../../../../classes/SessionManager';

export async function GET({ cookies }): Promise<Response> {
	const token = cookies.get('token');
	if (!token) return new Response('Unauthorized', { status: 401 });
	const user = await SessionManager.getUserFromUUID(token);

	return new Response(JSON.stringify(user), { status: 200 });
}
