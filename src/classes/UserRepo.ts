import sql from '$lib/DatabaseConnection';
import { User } from './User';
export default class UserRepo {
	static async getUserByID(userID: string): Promise<User> {
		type UserRow = {
			user_id: string;
			username: string;
			email: string;
			first_name: string;
			last_name: string;
		};
		const userRow = await sql<UserRow[]>`
			SELECT * FROM users WHERE user_id = ${userID}
		`;
		if (userRow.length === 0) {
			throw new Error('User not found');
		}
		return new User(
			userRow[0].user_id,
			userRow[0].username,
			userRow[0].email,
			userRow[0].first_name,
			userRow[0].last_name
		);
	}

	static async addUser(
		username: string,
		email: string,
		first_name: string,
		last_name: string
	): Promise<User> {
		const row = await sql`
			INSERT INTO users (username, email, first_name, last_name) VALUES (${username}, ${email}, ${first_name}, ${last_name}) returning user_id
		`;
		const userID = row[0].user_id;
		return new User(userID, username, email, first_name, last_name);
	}
}
