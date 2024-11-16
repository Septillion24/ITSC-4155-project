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
		return this.oAuth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: ['openid']
		});
	}

	// static processOauthResponse(response: RequestEvent) {
	// 	this.oAuth2Client.
	// }

	static async getUserFromUUID(uuid: string) {
		//TODO: jame
	}

	static async getSessionFromGoogleCode(googleCode: string): Session {
		const id = this.getIdFromGoogleCode(googleCode);
		const newUUID: string = uuid();
		// TODO: jame
		// go through all existing sessions and see if it has one
		// if it does, delete that one
		// create a new one with a new uuid
	}

	static async getIdFromGoogleCode(googleCode: string) {
		const credentials = await SessionManager.getTokens(googleCode!);
		return await SessionManager.getIDFromToken(credentials.access_token!);
	}

	static async getTokens(authCode: string) {
		this.verifyInitializtion();
		try {
			const { tokens } = await this.oAuth2Client.getToken(authCode);
			return tokens;
		} catch (error) {
			console.error('Error exchanging code for tokens:', error);
			throw error;
		}
	}

	static async getIDFromToken(idToken: string) {
		this.verifyInitializtion();

		if (idToken.split('.').length === 3) {
			const ticket = await this.oAuth2Client.verifyIdToken({
				idToken,
				audience: GOOGLE_CLIENT_ID
			});

			const payload = ticket.getPayload();
			return payload;
		} else {
			const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
				headers: {
					Authorization: `Bearer ${idToken}`
				}
			});

			const userInfo = await response.json();
			return userInfo.id;
		}
	}
}
