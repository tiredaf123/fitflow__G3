import React 
from 'react';

import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet 
} 
from 'react-native';

/**
 * @typedef {Object} Exercise
 * @property {string} name - The name of the exercise.
 * @property {string} reps - Repetitions or duration of the exercise.
 * @property {string} muscleGroup - Targeted muscle group(s).
 * @property {string} equipment - Equipment required, if any.
 * @property {string} tip - Coach's tip for proper form or engagement.
 */

/**
 * Renders a single workout card.
 * @param {Object} props
 * @param {string} props.category - The workout category.
 * @param {Exercise[]} props.exercises - List of exercises.
 * @returns {JSX.Element}
 */
const WorkoutCard = (
  { 
    category, 
    exercises 
  }
) => (
  <View 
    style={
      styles.card
    }
  >
    <Text 
      style={
        styles.cardTitle
      }
    >
      {
        category
      }
    </Text>
    {
      exercises.map(
        (
          exercise, 
          index
        ) => (
          <View 
            key={
              index
            } 
            style={
              styles.exerciseContainer
            }
          >
            <Text 
              style={
                styles.exerciseName
              }
            >
              • {
                exercise.name
              }
            </Text>
            <Text 
              style={
                styles.exerciseDetail
              }
            >
              Reps/Duration: {
                exercise.reps
              }
            </Text>
            <Text 
              style={
                styles.exerciseDetail
              }
            >
              Muscle Group: {
                exercise.muscleGroup
              }
            </Text>
            <Text 
              style={
                styles.exerciseDetail
              }
            >
              Equipment: {
                exercise.equipment
              }
            </Text>
            <Text 
              style={
                styles.exerciseTip
              }
            >
              Tip: {
                exercise.tip
              }
            </Text>
          </View>
        )
      )
    }
  </View>
);

/**
 * The main screen displaying various at-home workout categories and exercises.
 * @returns {JSX.Element}
 */
const AtHomeWorkoutScreen = () => {
  /** @type {Array<{category: string, exercises: Exercise[]}>} */
  const workoutCategories = [
    {
      category: 'Warm Up Routine',
      exercises: [
        { 
          name: 'Jumping Jacks', 
          reps: '2 min', 
          muscleGroup: 'Full Body', 
          equipment: 'None', 
          tip: 'Land softly on your feet.' 
        },
        { 
          name: 'High Knees', 
          reps: '2 min', 
          muscleGroup: 'Cardio', 
          equipment: 'None', 
          tip: 'Keep core tight.' 
        },
        { 
          name: 'Arm Circles', 
          reps: '1 min', 
          muscleGroup: 'Shoulders', 
          equipment: 'None', 
          tip: 'Small to large circles.' 
        },
        { 
          name: 'Leg Swings', 
          reps: '30 sec each leg', 
          muscleGroup: 'Hips', 
          equipment: 'None', 
          tip: 'Controlled motion.' 
        },
        { 
          name: 'Torso Twists', 
          reps: '1 min', 
          muscleGroup: 'Core', 
          equipment: 'None', 
          tip: 'Keep hips stable.' 
        },
      ],
    },
    {
      category: 'Full Body Beginner',
      exercises: [
        { 
          name: 'Bodyweight Squats', 
          reps: '15 x 3 sets', 
          muscleGroup: 'Legs', 
          equipment: 'None', 
          tip: 'Keep knees behind toes.' 
        },
        { 
          name: 'Knee Push-ups', 
          reps: '12 x 3 sets', 
          muscleGroup: 'Chest, Arms', 
          equipment: 'None', 
          tip: 'Keep body aligned.' 
        },
        { 
          name: 'Glute Bridges', 
          reps: '15 x 3 sets', 
          muscleGroup: 'Glutes, Core', 
          equipment: 'None', 
          tip: 'Squeeze at top.' 
        },
        { 
          name: 'Plank Hold', 
          reps: '30 sec x 3', 
          muscleGroup: 'Core', 
          equipment: 'None', 
          tip: 'Keep hips level.' 
        },
        { 
          name: 'Mountain Climbers', 
          reps: '30 sec x 3', 
          muscleGroup: 'Cardio, Core', 
          equipment: 'None', 
          tip: 'Drive knees fast.' 
        },
      ],
    },
    {
      category: 'Leg Day - No Equipment',
      exercises: [
        { 
          name: 'Lunges', 
          reps: '10 each leg x 3 sets', 
          muscleGroup: 'Legs', 
          equipment: 'None', 
          tip: 'Keep chest up.' 
        },
        { 
          name: 'Wall Sits', 
          reps: '45 sec x 3', 
          muscleGroup: 'Legs', 
          equipment: 'None', 
          tip: 'Knees at 90 degrees.' 
        },
        { 
          name: 'Step-Ups on Chair', 
          reps: '12 each leg x 3 sets', 
          muscleGroup: 'Legs', 
          equipment: 'Chair', 
          tip: 'Step firmly.' 
        },
        { 
          name: 'Side Lunges', 
          reps: '10 each side x 3', 
          muscleGroup: 'Inner Thighs', 
          equipment: 'None', 
          tip: 'Keep foot flat.' 
        },
        { 
          name: 'Calf Raises', 
          reps: '20 x 3 sets', 
          muscleGroup: 'Calves', 
          equipment: 'None', 
          tip: 'Hold at top.' 
        },
      ],
    },
    {
      category: 'Upper Body Strength',
      exercises: [
        { 
          name: 'Push-ups', 
          reps: '12 x 3 sets', 
          muscleGroup: 'Chest, Arms', 
          equipment: 'None', 
          tip: 'Engage core.' 
        },
        { 
          name: 'Tricep Dips on Chair', 
          reps: '12 x 3 sets', 
          muscleGroup: 'Arms', 
          equipment: 'Chair', 
          tip: 'Elbows point back.' 
        },
        { 
          name: 'Superman Hold', 
          reps: '30 sec x 3', 
          muscleGroup: 'Back', 
          equipment: 'None', 
          tip: 'Lift chest and legs.' 
        },
        { 
          name: 'Pike Push-ups', 
          reps: '10 x 3 sets', 
          muscleGroup: 'Shoulders', 
          equipment: 'None', 
          tip: 'Look at feet.' 
        },
        { 
          name: 'Inchworms', 
          reps: '10 x 3 sets', 
          muscleGroup: 'Full Body', 
          equipment: 'None', 
          tip: 'Control movement.' 
        },
      ],
    },
    {
      category: 'Cardio HIIT',
      exercises: [
        { 
          name: 'Burpees', 
          reps: '30 sec x 3', 
          muscleGroup: 'Full Body', 
          equipment: 'None', 
          tip: 'Explode up.' 
        },
        { 
          name: 'Skaters', 
          reps: '30 sec x 3', 
          muscleGroup: 'Glutes, Legs', 
          equipment: 'None', 
          tip: 'Stay low.' 
        },
        { 
          name: 'Jump Squats', 
          reps: '30 sec x 3', 
          muscleGroup: 'Legs', 
          equipment: 'None', 
          tip: 'Land softly.' 
        },
        { 
          name: 'Plank Jacks', 
          reps: '30 sec x 3', 
          muscleGroup: 'Core, Cardio', 
          equipment: 'None', 
          tip: 'Keep hips stable.' 
        },
        { 
          name: 'High Knees', 
          reps: '30 sec x 3', 
          muscleGroup: 'Cardio', 
          equipment: 'None', 
          tip: 'Pump arms.' 
        },
      ],
    },
    {
      category: 'Stretch & Cool Down',
      exercises: [
        { 
          name: 'Childs Pose', 
          reps: '1 min', 
          muscleGroup: 'Back, Hips', 
          equipment: 'None', 
          tip: 'Breathe deeply.' 
        },
        { 
          name: 'Seated Forward Fold', 
          reps: '1 min', 
          muscleGroup: 'Hamstrings', 
          equipment: 'None', 
          tip: 'Relax neck.' 
        },
        { 
          name: 'Cat-Cow Stretch', 
          reps: '10 reps', 
          muscleGroup: 'Spine', 
          equipment: 'None', 
          tip: 'Move with breath.' 
        },
        { 
          name: 'Neck Rolls', 
          reps: '30 sec each side', 
          muscleGroup: 'Neck', 
          equipment: 'None', 
          tip: 'Move slowly.' 
        },
        { 
          name: 'Chest Opener', 
          reps: '1 min', 
          muscleGroup: 'Chest, Shoulders', 
          equipment: 'None', 
          tip: 'Lift chest.' 
        },
      ],
    },
  ];

  return (
    <ScrollView 
      style={
        styles.container
      }
    >
      {
        workoutCategories.map(
          (
            categoryData, 
            index
          ) => (
            <WorkoutCard 
              key={
                index
              } 
              category={
                categoryData.category
              } 
              exercises={
                categoryData.exercises
              } 
            />
          )
        )
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create(
  {
    container: { 
      padding: 20 
    },
    card: { 
      marginBottom: 20, 
      padding: 15, 
      backgroundColor: '#f8f8f8', 
      borderRadius: 10 
    },
    cardTitle: { 
      fontSize: 18, 
      fontWeight: 'bold', 
      marginBottom: 10 
    },
    exerciseContainer: { 
      marginBottom: 10 
    },
    exerciseName: { 
      fontWeight: 'bold', 
      fontSize: 16 
    },
    exerciseDetail: { 
      fontSize: 14, 
      marginLeft: 10 
    },
    exerciseTip: { 
      fontSize: 12, 
      marginLeft: 10, 
      fontStyle: 'italic', 
      color: '#555' 
    },
  }
);

export default AtHomeWorkoutScreen;