import postgres from 'postgres';
import { DATABASE_URL, DATABASE_USERNAME, DATABASE_PASSWORD } from '$env/static/private';

const sql = postgres(DATABASE_URL, {
	username: DATABASE_USERNAME, // Username of database user
	password: DATABASE_PASSWORD, // Password of database user
	ssl: {
		rejectUnauthorized: true
	}
});

export default sql;
