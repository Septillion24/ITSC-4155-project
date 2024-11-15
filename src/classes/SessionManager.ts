import sql from '$lib/DatabaseConnection';

import { v4 as uuid } from 'uuid';
import type { User } from './User';

import { GoogleAuth, OAuth2Client } from 'google-auth-library';

import { GOOGLE_CLIENT_ID } from '$env/static/private';
import { GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { GOOGLE_REDIRECT_URI } from '$env/static/private';

export type Session = {
	uuid: string;
	memberID: string;
	expiration: Date;
};

export class SessionManager {
	private static oAuth2Client: OAuth2Client;
	private constructor() {}

	// static async jawn() {
	// 	const auth = new GoogleAuth({
	// 		scopes: 'https://www.googleapis.com/auth/cloud-platform'
	// 	});
	// 	const client = await auth.getClient();
	// }

	static verifyInitializtion() {
		if (!this.oAuth2Client) {
			this.oAuth2Client = new OAuth2Client(
				GOOGLE_CLIENT_ID,
				GOOGLE_CLIENT_SECRET,
				GOOGLE_REDIRECT_URI
			);
		}
	}
	static async getRedirectURL() {
		this.verifyInitializtion();
		this.oAuth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: ['openid']
		});
	}
}
