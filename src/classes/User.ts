class User {
	user_id: number;
	username: string;
	email: string;
	first_name: string;
	last_name: string;

	constructor(
		user_id: number,
		username: string,
		email: string,
		first_name: string,
		last_name: string
	) {
		this.user_id = user_id;
		this.username = username;
		this.email = email;
		this.first_name = first_name;
		this.last_name = last_name;
	}
}
