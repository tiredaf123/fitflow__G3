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
                            onPress={() => navigation.navigate('Subscription')}
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
                    <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('Subscription')}>
                        <Text style={styles.buttonText}>Next</Text>
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
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
        justifyContent: 'space-between',
        marginTop: 20,
    },
    backButton: {
        backgroundColor: 'transparent',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#FEC400',
        marginRight: 10,
    },
    nextButton: {
        backgroundColor: '#FEC400',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 12,
    },
    buttonText: {
        color: '#0D0D0D',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default GoalSelection;
