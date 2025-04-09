import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../navigation/ThemeProvider';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const WeightInScreen = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();

    const styles = getStyles(isDarkMode);

    const weightHistory = [
        { id: '1', date: 'Apr 7, 2025', weight: '65 kg' },
        { id: '2', date: 'Apr 2, 2025', weight: '66.2 kg' },
        { id: '3', date: 'Mar 25, 2025', weight: '67 kg' },
    ];

    return (
        <View style={styles.container}>
            {/* Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcon name="arrow-back" size={28} color={isDarkMode ? '#fff' : '#000'} />
                </TouchableOpacity>
                <Text style={styles.title}>Weight In</Text>
                <View style={styles.placeholderIcon} />
            </View>

            {/* Current Weight */}
            <View style={styles.section}>
                <Text style={styles.label}>Current Weight</Text>
                <Text style={styles.value}>65 kg</Text>
                <Text style={styles.date}>Last recorded: Apr 7, 2025</Text>
            </View>

            {/* History List */}
            <View style={styles.section}>
                <Text style={styles.label}>Weight History</Text>
                <FlatList
                    data={weightHistory}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.historyItem}>
                            <Text style={styles.historyText}>{item.weight}</Text>
                            <Text style={styles.historyDate}>{item.date}</Text>
                        </View>
                    )}
                />
            </View>
        </View>
    );
};

const getStyles = (isDarkMode) =>
    StyleSheet.create({
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
        placeholderIcon: {
            width: 28,
        },
        section: {
            backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5',
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
        },
        label: {
            color: isDarkMode ? '#ccc' : '#555',
            fontSize: 16,
            marginBottom: 10,
        },
        value: {
            color: isDarkMode ? '#00BFFF' : '#FF6B00',
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 6,
        },
        date: {
            fontSize: 12,
            color: isDarkMode ? '#aaa' : '#888',
        },
        historyItem: {
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode ? '#444' : '#ccc',
        },
        historyText: {
            fontSize: 16,
            color: isDarkMode ? '#eee' : '#333',
        },
        historyDate: {
            fontSize: 12,
            color: isDarkMode ? '#aaa' : '#888',
        },
    });

export default WeightInScreen;
