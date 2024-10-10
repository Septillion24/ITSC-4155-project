import sql from '$lib/databaseConnection';
import Meal from './meal';
export default class MealRepo {
	meals: Meal[] = [];
	initialized: boolean = false;

	async init() {
		if (this.initialized) {
			return;
		} else {
			await this.populateMeals();
			this.initialized = true;
		}
	}

	async populateMeals() {
		type mealFromDatabase = {
			meal_id: number;
			name: string;
			mealType: string;
			calories: number;
			carbs: number;
			protein: number;
			fat: number;
		};
		const mealsFromDatabase = await sql<mealFromDatabase[]>`SELECT * FROM meals`;
		this.meals = mealsFromDatabase.map(
			(meal) =>
				new Meal(
					meal.meal_id,
					meal.name,
					meal.mealType,
					meal.calories,
					meal.carbs,
					meal.protein,
					meal.fat
				)
		);
	}

	getMealById(mealId: number) {
		return this.meals.find((meal) => meal.mealId === mealId);
	}
	getMealByName(name: string) {
		return this.meals.find((meal) => meal.name === name);
	}
	getMeals() {
		return this.meals;
	}
	async addMeal(
		name: string,
		mealType: string,
		calories: number,
		carbs: number,
		protein: number,
		fat: number
	) {
		await sql`INSERT INTO meals (name, mealType, calories, carbs, protein, fat) VALUES (${name}, ${mealType}, ${calories}, ${carbs}, ${protein}, ${fat})`;
		await this.populateMeals();
	}
	async updateMeal(
		mealId: number,
		updates: {
			name?: string;
			mealType?: string;
			calories?: number;
			carbs?: number;
			protein?: number;
			fat?: number;
		}
	) {
		if (
			!updates.name &&
			!updates.mealType &&
			!updates.calories &&
			!updates.carbs &&
			!updates.protein &&
			!updates.fat
		) {
			return;
		}
		await sql`UPDATE meals SET ${sql(updates)} WHERE meal_id=${mealId}`;
		await this.populateMeals();
	}
	async deleteMeal(mealId: number) {
		await sql`DELETE FROM meals WHERE meal_id=${mealId}`;
		await this.populateMeals();
	}
}
