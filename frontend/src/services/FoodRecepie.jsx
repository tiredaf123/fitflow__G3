import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';

const HealthyFoodSuggestionScreen = () => {
  const [selectedFood, setSelectedFood] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const foodList = [
    {
      "name": "Grilled Chicken Breast #1",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #2",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #3",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #4",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #5",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #6",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #7",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #8",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #9",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #10",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #11",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #12",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #13",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #14",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #15",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #16",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #17",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #18",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #19",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #20",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #21",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #22",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #23",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #24",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #25",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #26",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #27",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #28",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #29",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #30",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #31",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #32",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #33",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #34",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #35",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #36",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #37",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #38",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #39",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #40",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #41",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #42",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #43",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #44",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #45",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #46",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #47",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #48",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #49",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #50",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #51",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #52",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #53",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #54",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #55",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #56",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #57",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #58",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #59",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #60",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #61",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #62",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #63",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #64",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #65",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #66",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #67",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #68",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #69",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #70",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #71",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #72",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #73",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #74",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #75",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #76",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #77",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #78",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #79",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #80",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #81",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #82",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #83",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #84",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #85",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #86",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #87",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #88",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #89",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #90",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #91",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #92",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #93",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #94",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #95",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #96",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #97",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #98",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #99",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #100",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #101",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #102",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #103",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #104",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #105",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #106",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #107",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #108",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #109",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #110",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #111",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #112",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #113",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #114",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #115",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #116",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #117",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #118",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #119",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #120",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #121",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #122",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #123",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #124",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #125",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #126",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #127",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #128",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #129",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #130",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #131",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #132",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #133",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #134",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #135",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #136",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #137",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #138",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #139",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #140",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #141",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #142",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #143",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #144",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #145",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #146",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #147",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #148",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #149",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #150",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #151",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #152",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #153",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #154",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #155",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #156",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #157",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #158",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #159",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #160",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #161",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #162",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #163",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #164",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #165",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #166",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #167",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #168",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #169",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #170",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #171",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #172",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #173",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #174",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #175",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #176",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #177",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #178",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #179",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #180",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #181",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #182",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #183",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #184",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #185",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #186",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #187",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #188",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #189",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #190",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #191",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #192",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #193",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #194",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #195",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    },
    {
      "name": "Grilled Chicken Breast #196",
      "calories": 165,
      "fat": "3.6g",
      "protein": "31g",
      "carbs": "0g",
      "vitamins": "Vitamin B6, Vitamin B12, Niacin",
      "recipe": "Step 1: Season chicken with salt, pepper, and herbs. Step 2: Grill over medium heat for 6-7 minutes per side until cooked through."
    },
    {
      "name": "Avocado Toast #197",
      "calories": 250,
      "fat": "14g",
      "protein": "6g",
      "carbs": "28g",
      "vitamins": "Vitamin K, Folate, Vitamin E",
      "recipe": "Step 1: Toast whole grain bread. Step 2: Mash avocado with lemon juice, salt, and chili flakes. Step 3: Spread on toast."
    },
    {
      "name": "Quinoa Salad #198",
      "calories": 222,
      "fat": "6g",
      "protein": "8g",
      "carbs": "34g",
      "vitamins": "Folate, Magnesium, Vitamin E",
      "recipe": "Step 1: Cook quinoa and let cool. Step 2: Mix with chopped cucumbers, tomatoes, onions, and lemon vinaigrette."
    },
    {
      "name": "Greek Yogurt with Berries #199",
      "calories": 150,
      "fat": "2g",
      "protein": "12g",
      "carbs": "18g",
      "vitamins": "Calcium, Vitamin B2, Vitamin B12",
      "recipe": "Step 1: Scoop Greek yogurt into a bowl. Step 2: Top with fresh berries and a drizzle of honey."
    },
    {
      "name": "Oatmeal with Almonds and Banana #200",
      "calories": 300,
      "fat": "8g",
      "protein": "7g",
      "carbs": "45g",
      "vitamins": "Vitamin B1, Iron, Magnesium",
      "recipe": "Step 1: Cook oats in milk or water. Step 2: Top with sliced banana, almonds, and a sprinkle of cinnamon."
    }
  ];
  const handlePress = (food) => {
    setSelectedFood(food);
    setModalVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Healthy Food Suggestions</Text>
      {foodList.map((food, index) => (
        <TouchableOpacity
          key={index}
          style={styles.item}
          onPress={() => handlePress(food)}
        >
          <Text style={styles.itemText}>{food.name}</Text>
        </TouchableOpacity>
      ))}

      <Modal
        visible={modalVisible}
        transparent
        animationType='slide'
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedFood && (
              <>
                <Text style={styles.modalTitle}>{selectedFood.name}</Text>
                <Text>Calories: {selectedFood.calories}</Text>
                <Text>Fat: {selectedFood.fat}</Text>
                <Text>Protein: {selectedFood.protein}</Text>
                <Text>Carbs: {selectedFood.carbs}</Text>
                <Text>Vitamins: {selectedFood.vitamins}</Text>
                <Text>Recipe: {selectedFood.recipe}</Text>
              </>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  itemText: {
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default HealthyFoodSuggestionScreen;