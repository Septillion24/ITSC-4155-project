import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();
console.log(process.env);

const { DATABASE_URL, DATABASE_USERNAME, DATABASE_PASSWORD } = process.env;

if (!DATABASE_URL) {
	console.log('DATABASE_URL:', DATABASE_URL);
	throw new Error('DATABASE_URL is not defined');
}

const sql = postgres(DATABASE_URL, {
	username: DATABASE_USERNAME, // Username of database user
	password: DATABASE_PASSWORD, // Password of database user
	ssl: {
		rejectUnauthorized: true
	}
});

export default sql;
