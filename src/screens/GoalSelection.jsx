import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const GoalSelection = () => {
    const navigation = useNavigation();

    const goals = [
        { name: 'Gain Weight', icon: 'fitness-center' },
        { name: 'Lose Weight', icon: 'refresh' },
        { name: 'Build Muscles', icon: 'fitness-center' },
        { name: 'Tone & Define', icon: 'fitness-center' },
        { name: 'Improve Flexibility', icon: 'accessibility-new' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>What's Your Goal?</Text>
                <View style={styles.goalList}>
                    {goals.map((goal, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.goalButton}
                            onPress={() => navigation.navigate('HomeScreen', { selectedGoal: goal.name })}
                        >
                            <Icon name={goal.icon} size={24} color="white" style={{ marginRight: 12 }} />
                            <Text style={styles.goalText}>{goal.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.navigationButtons}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.buttonText}>Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D0D0D',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: 350,
        padding: 30,
        backgroundColor: '#1E1E1E',
        borderRadius: 25,
    },
    title: {
        fontSize: 26,
        color: '#FEC400',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    goalList: {
        marginBottom: 30,
    },
    goalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A2A2A',
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#3A3A3A',
    },
    goalText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    backButton: {
        backgroundColor: 'transparent',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#FEC400',
    },
    buttonText: {
        color: '#FEC400',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default GoalSelection;
