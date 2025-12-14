export interface FoodItem {
  item: string;
  confidence: number;
}

export interface ScanResponse {
  food_found: FoodItem[];
  missing_food: string[];
}