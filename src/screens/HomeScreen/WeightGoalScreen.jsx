import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../navigation/ThemeProvider';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { ProgressBar } from 'react-native-paper';

const WeightGoalScreen = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();

    const currentWeight = 65;
    const goalWeight = 55;
    const heightInMeters = 1.65;
    const weightLossGoal = currentWeight - goalWeight;
    const progress = weightLossGoal >= 10 ? 1 : weightLossGoal / 10;

    const bmi = (currentWeight / (heightInMeters * heightInMeters)).toFixed(1);
    const estimatedTime = `${(weightLossGoal / 1).toFixed(1)} weeks`;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? '#121212' : '#fdfdfd',
            paddingHorizontal: 20,
            paddingTop: 10,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
        },
        title: {
            fontSize: 22,
            fontWeight: '700',
            color: isDarkMode ? '#fff' : '#111',
        },
        section: {
            backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
            borderRadius: 16,
            padding: 18,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 4,
        },
        label: {
            fontSize: 15,
            color: isDarkMode ? '#bbb' : '#555',
            marginBottom: 6,
        },
        value: {
            fontSize: 18,
            fontWeight: 'bold',
            color: isDarkMode ? '#00BFFF' : '#FF6B00',
        },
        progressLabel: {
            fontSize: 14,
            marginTop: 8,
            color: isDarkMode ? '#ccc' : '#444',
        },
        quote: {
            fontStyle: 'italic',
            textAlign: 'center',
            marginTop: 6,
            color: isDarkMode ? '#aaa' : '#666',
        },
        weekList: {
            marginTop: 6,
        },
        weekItem: {
            fontSize: 14,
            color: isDarkMode ? '#ccc' : '#333',
            marginVertical: 2,
        },
    });

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcon name="arrow-back" size={28} color={isDarkMode ? '#fff' : '#000'} />
                </TouchableOpacity>
                <Text style={styles.title}>My Weight Goal</Text>
                <View style={{ width: 28 }} />
            </View>

            {/* Motivation at Top */}
            <View style={styles.section}>
                <Text style={styles.label}>Motivation of the Day:</Text>
                <Text style={styles.quote}>
                    "One day or day one. You decide."
                </Text>
            </View>

            {/* Weight Info */}
            <View style={styles.section}>
                <Text style={styles.label}>Current Weight:</Text>
                <Text style={styles.value}>{currentWeight} kg</Text>

                <Text style={[styles.label, { marginTop: 12 }]}>Goal Weight:</Text>
                <Text style={styles.value}>{goalWeight} kg</Text>

                <Text style={[styles.label, { marginTop: 12 }]}>BMI:</Text>
                <Text style={styles.value}>{bmi}</Text>
            </View>

            {/* Plan Section */}
            <View style={styles.section}>
                <Text style={styles.label}>Plan:</Text>
                <Text style={styles.label}>
                    • Eat at a 500 kcal deficit daily{'\n'}
                    • Strength training 3x/week{'\n'}
                    • Cardio 2x/week{'\n'}
                    • Sleep 7–8 hrs daily{'\n'}
                    • Track weekly weight
                </Text>
            </View>

            {/* Progress */}
            <View style={styles.section}>
                <Text style={styles.label}>Progress:</Text>
                <ProgressBar progress={progress} color={isDarkMode ? '#00BFFF' : '#FF6B00'} />
                <Text style={styles.progressLabel}>
                    {weightLossGoal} kg to go • Goal: {goalWeight} kg
                </Text>
            </View>

            {/* Estimated Time */}
            <View style={styles.section}>
                <Text style={styles.label}>Estimated Time to Goal:</Text>
                <Text style={styles.value}>{estimatedTime}</Text>
                <Text style={styles.label}>(assuming 1 kg/week)</Text>
            </View>

            {/* Weekly Summary */}
            <View style={styles.section}>
                <Text style={styles.label}>Weekly Summary:</Text>
                <View style={styles.weekList}>
                    <Text style={styles.weekItem}>✔️ Mon - Cardio + Low-calorie meals</Text>
                    <Text style={styles.weekItem}>✔️ Tue - Upper Body Strength</Text>
                    <Text style={styles.weekItem}>✔️ Wed - Rest + Hydration</Text>
                    <Text style={styles.weekItem}>✔️ Thu - Lower Body Strength</Text>
                    <Text style={styles.weekItem}>✔️ Fri - HIIT Cardio</Text>
                    <Text style={styles.weekItem}>✔️ Sat - Full Body Workout</Text>
                    <Text style={styles.weekItem}>✔️ Sun - Rest & Reflect</Text>
                </View>
            </View>
        </ScrollView>
    );
};

export default WeightGoalScreen;
