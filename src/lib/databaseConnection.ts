import postgres from 'postgres';
import { DATABASE_URL } from '$env/static/private';
const sql = postgres(DATABASE_URL, {
	ssl: {
		rejectUnauthorized: true
	}
});

export default sql;
