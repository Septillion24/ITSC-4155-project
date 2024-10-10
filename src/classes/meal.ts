export default class Meal {
	mealId: number;
	name: string;
	mealType: string;
	calories: number;
	carbs: number;
	protein: number;
	fat: number;

	constructor(
		mealId: number,
		name: string,
		mealType: string,
		calories: number,
		carbs: number,
		protein: number,
		fat: number
	) {
		this.mealId = mealId;
		this.name = name;
		this.mealType = mealType; // e.g., breakfast, lunch, dinner
		this.calories = calories;
		this.carbs = carbs;
		this.protein = protein;
		this.fat = fat;
	}
}
