import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const BackWorkout = () => {
    return (
        <ScrollView style={styles.container}>
            <ImageBackground
                source={require('../../assets/ExerciseImages/1.png')}
                style={styles.imageBackground}
                imageStyle={{ borderRadius: 15 }}
            >
                <View style={styles.overlay}>
                    <Text style={styles.title}>Back Workout</Text>
                    <Text style={styles.subTitle}>6 exercises | 45 mins</Text>
                    <TouchableOpacity style={styles.startButton}>
                        <Text style={styles.startButtonText}>Start Workout</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>

            <View style={styles.exerciseList}>
                {['Pull-ups', 'Lat Pull-down', 'T-Bar Row', 'Machine Row', 'Cable Cruncher', 'Deadlift'].map((exercise, index) => (
                    <TouchableOpacity key={index} style={styles.exerciseItem}>
                        <Text style={styles.exerciseText}>{exercise}</Text>
                        <Text style={styles.setsText}>3 sets of 12 reps</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A1A',
    },
    imageBackground: {
        height: 250,
        margin: 20,
        borderRadius: 15,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 15,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    subTitle: {
        fontSize: 16,
        color: '#ddd',
        marginVertical: 5,
    },
    startButton: {
        backgroundColor: '#FFCC00',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginTop: 10,
    },
    startButtonText: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
    },
    exerciseList: {
        marginTop: 20,
        marginHorizontal: 20,
    },
    exerciseItem: {
        backgroundColor: '#333',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    exerciseText: {
        color: '#fff',
        fontSize: 16,
    },
    setsText: {
        color: '#FFCC00',
        fontSize: 14,
    },
});

export default BackWorkout;
