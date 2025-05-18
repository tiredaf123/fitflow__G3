import React from 'react';
import { View, Text, ScrollView, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import BottomTabBar from '../../components/BottomTabBar';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../navigation/ThemeProvider';

const WorkoutScreen = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();

    const themeStyles = {
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? '#121212' : '#F5F5F5',
        },
        headerText: {
            color: isDarkMode ? '#FFF' : '#000',
            fontSize: 24,
            fontWeight: 'bold',
        },
        workoutName: {
            color: '#FFF', // Always white for better contrast on images
            fontSize: 22,
            fontWeight: '700',
            textShadowColor: 'rgba(0, 0, 0, 0.75)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 3,
        },
        workoutDetails: {
            color: '#FFF',
            fontSize: 16,
            fontWeight: '600',
            textShadowColor: 'rgba(0, 0, 0, 0.75)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.4)', // Darker overlay for better text visibility
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
            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcon 
                            name="arrow-back" 
                            size={28} 
                            color={themeStyles.headerText.color} 
                            style={styles.backButton}
                        />
                    </TouchableOpacity>
                    <Text style={themeStyles.headerText}>Workouts</Text>
                    <View style={styles.headerSpacer} />
                </View>

                {/* Workouts List */}
                <View style={styles.workoutsList}>
                    {workouts.map((workout, index) => (
                        <TouchableOpacity 
                            key={index}
                            style={styles.workoutContainer}
                            onPress={() => navigation.navigate(workout.screen)}
                        >
                            <ImageBackground 
                                source={workout.image} 
                                style={styles.workoutImage}
                                imageStyle={styles.workoutImageStyle}
                            >
                                <View style={[styles.overlay, themeStyles.overlay]}>
                                    <Text style={themeStyles.workoutName}>{workout.name}</Text>
                                    <View style={styles.workoutInfo}>
                                        <View style={styles.detailContainer}>
                                            <MaterialIcon 
                                                name="local-fire-department" 
                                                size={20} 
                                                color="#FFD700" 
                                                style={styles.icon}
                                            />
                                            <Text style={themeStyles.workoutDetails}>{workout.kcal} Kcal</Text>
                                        </View>
                                        <View style={styles.detailContainer}>
                                            <MaterialIcon 
                                                name="schedule" 
                                                size={20} 
                                                color="#FFD700" 
                                                style={styles.icon}
                                            />
                                            <Text style={themeStyles.workoutDetails}>{workout.time}</Text>
                                        </View>
                                    </View>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Bottom Navigation Bar */}
            <BottomTabBar />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        paddingBottom: 15,
    },
    backButton: {
        padding: 4,
    },
    headerSpacer: {
        width: 32,
    },
    workoutsList: {
        paddingHorizontal: 15,
    },
    workoutContainer: {
        marginBottom: 15,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    workoutImage: {
        height: 150,
        justifyContent: 'flex-end',
    },
    workoutImageStyle: {
        borderRadius: 12,
    },
    overlay: {
        padding: 15,
        paddingTop: 20,
    },
    workoutInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    detailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});

export default WorkoutScreen;