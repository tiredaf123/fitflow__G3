import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../navigation/ThemeProvider';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const WeightGoalScreen = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            color: isDarkMode ? '#fff' : '#000',
        },
        section: {
            backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5',
            borderRadius: 12,
            padding: 16,
        },
        label: {
            color: isDarkMode ? '#ccc' : '#555',
            fontSize: 16,
            marginBottom: 8,
        },
        value: {
            color: isDarkMode ? '#00BFFF' : '#FF6B00',
            fontSize: 18,
            fontWeight: 'bold',
        },
    });

    return (
        <View style={styles.container}>
            {/* Back Navigation */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcon name="arrow-back" size={28} color={isDarkMode ? '#fff' : '#000'} />
                </TouchableOpacity>
                <Text style={styles.title}>My Weight Goal & Plan</Text>
                <View style={{ width: 28 }} />
            </View>

            {/* Goal Info */}
            <View style={styles.section}>
                <Text style={styles.label}>Current Weight:</Text>
                <Text style={styles.value}>65 kg</Text>

                <Text style={[styles.label, { marginTop: 16 }]}>Goal Weight:</Text>
                <Text style={styles.value}>55 kg</Text>

                <Text style={[styles.label, { marginTop: 16 }]}>Plan:</Text>
                <Text style={styles.label}>
                    • Eat at a 500 kcal deficit daily{'\n'}
                    • Do strength training 3x/week{'\n'}
                    • Cardio 2x/week
                </Text>
            </View>
        </View>
    );
};

export default WeightGoalScreen;
