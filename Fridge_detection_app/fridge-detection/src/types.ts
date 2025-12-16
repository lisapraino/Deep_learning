export interface FoodItem {
  item: string;
  confidence: number;
}

export interface ScanResponse {
  food_found: FoodItem[];
  missing_food: string[];
}

export interface ExpiringItem {
  name: string;
  expirationDate: string; // format "yyyy-mm-dd"
}
