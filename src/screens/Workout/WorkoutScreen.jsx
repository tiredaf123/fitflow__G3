import React from 'react';
import { View, Text, ScrollView, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import BottomTabBar from '../../components/BottomTabBar';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../navigation/ThemeProvider';

const WorkoutsScreen = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();

    const themeStyles = {
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? '#1a1a1a' : '#F0F0F0',
        },
        topBarText: {
            color: isDarkMode ? '#FFF' : '#000',
            fontSize: 24,
            marginLeft: 10,
        },
        overlay: {
            backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
        },
        workoutName: {
            color: isDarkMode ? '#FFF' : '#000',
            fontSize: 20,
            fontWeight: 'bold',
        },
        workoutDetails: {
            color: isDarkMode ? '#00BFFF' : '#FF6B00',
            fontSize: 14,
        }
    };

    const workouts = [
        { name: 'Chest Workout', kcal: 400, time: '1 hour', image: require('../../assets/ExerciseImages/7.png'), screen: 'ChestWorkout' },
        { name: 'Back Workout', kcal: 200, time: '50 min', image: require('../../assets/ExerciseImages/1.png'), screen: 'BackWorkout' },
        { name: 'Arms Workout', kcal: 200, time: '50 min', image: require('../../assets/ExerciseImages/2.png'), screen: 'ArmsWorkout' },
        { name: 'Leg Workout', kcal: 600, time: '1 hour', image: require('../../assets/ExerciseImages/6.png'), screen: 'LegWorkout' },
        { name: 'Abs Workout', kcal: 300, time: '40 min', image: require('../../assets/ExerciseImages/3.png'), screen: 'AbsWorkout' },
    ];

    return (
        <View style={themeStyles.container}>
            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>

                {/* Top Bar */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <MaterialIcon name="arrow-back" size={28} color={themeStyles.topBarText.color} />
                    <Text style={themeStyles.topBarText}>Workouts</Text>
                </View>

                {/* Workouts List */}
                {workouts.map((workout, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={styles.workoutContainer} 
                        onPress={() => navigation.navigate(workout.screen)}
                    >
                        <ImageBackground 
                            source={workout.image} 
                            style={styles.workoutImage} 
                            imageStyle={{ borderRadius: 12 }}
                        >
                            <View style={[styles.overlay, themeStyles.overlay]}>
                                <Text style={themeStyles.workoutName}>{workout.name}</Text>
                                <View style={styles.workoutInfo}>
                                    <Text style={themeStyles.workoutDetails}>{workout.kcal} Kcal</Text>
                                    <Text style={themeStyles.workoutDetails}>{workout.time}</Text>
                                </View>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Bottom Navigation Bar */}
            <BottomTabBar />
        </View>
    );
};

const styles = StyleSheet.create({
    workoutContainer: {
        marginBottom: 20,
        borderRadius: 12,
        overflow: 'hidden',
    },
    workoutImage: {
        height: 180,
        justifyContent: 'flex-end',
    },
    overlay: {
        padding: 10,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    workoutInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
});

export default WorkoutsScreen;
