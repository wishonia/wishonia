import React from "react"

interface Macronutrient {
  value: string | number
  unit: string
}

interface Micronutrient {
  name: string
  value: string | number
  unit: string
}

interface NutritionDataItem {
  food_item: string
  serving_size: string | number
  calories: string | number
  macronutrients: {
    protein: Macronutrient
    carbohydrates: Macronutrient
    fat: Macronutrient
  }
  micronutrients: Micronutrient[]
}

interface NutritionFactsLabelProps {
  data: NutritionDataItem[]
}

const NutritionFactsLabel: React.FC<NutritionFactsLabelProps> = ({ data }) => {
  return (
    <div className="nutrition-facts-label">
      {data.map((item, index) => (
        <div key={index} className="food-item">
          <h3>{item.food_item}</h3>
          <p>Serving Size: {item.serving_size}</p>
          <p>Calories: {item.calories}</p>

          <div className="macronutrients">
            <h4>Macronutrients</h4>
            <p>
              Protein: {item.macronutrients.protein.value}{" "}
              {item.macronutrients.protein.unit}
            </p>
            <p>
              Carbohydrates: {item.macronutrients.carbohydrates.value}{" "}
              {item.macronutrients.carbohydrates.unit}
            </p>
            <p>
              Fat: {item.macronutrients.fat.value}{" "}
              {item.macronutrients.fat.unit}
            </p>
          </div>

          <div className="micronutrients">
            <h4>Micronutrients</h4>
            <ul>
              {item.micronutrients.map((nutrient, i) => (
                <li key={i}>
                  {nutrient.name}: {nutrient.value} {nutrient.unit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}

export default NutritionFactsLabel
