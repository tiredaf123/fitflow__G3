import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import BottomTabBar from '../../components/BottomTabBar';
import { useTheme } from '../../navigation/ThemeProvider';
import { useNavigation } from '@react-navigation/native';

const DashboardScreen = () => {
    const { isDarkMode } = useTheme();
    const navigation = useNavigation();

    const dynamicStyles = {
        container: { backgroundColor: isDarkMode ? '#1a1a1a' : '#F0F0F0' },
        navbar: {
            backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF',
            borderColor: isDarkMode ? '#444' : '#DDD',
        },
        section: {
            backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF',
            borderColor: isDarkMode ? '#444' : '#DDD',
        },
        text: { color: isDarkMode ? '#FFF' : '#000' },
        iconColor: isDarkMode ? '#00BFFF' : '#FF6B00',
        cardBackground: { backgroundColor: isDarkMode ? '#333' : '#E0E0E0' },
    };

    return (
        <View style={[styles.container, dynamicStyles.container]}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Top Navigation Bar with Drawer Toggle */}
                <View style={[styles.navbar, dynamicStyles.navbar]}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <MaterialIcon name="menu" size={28} color={dynamicStyles.text.color} />
                    </TouchableOpacity>
                    <Text style={[styles.navbarTitle, dynamicStyles.text]}>Dashboard</Text>
                </View>

                {/* Calendar Navigation */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('Calendar')}
                    style={[styles.calendarNav, dynamicStyles.navbar]}
                >
                    <MaterialIcon name="chevron-left" size={28} color={dynamicStyles.text.color} />
                    <Text style={[styles.calendarText, dynamicStyles.text]}>Today</Text>
                    <MaterialIcon name="chevron-right" size={28} color={dynamicStyles.text.color} />
                </TouchableOpacity>

                {/* Calorie Budget Section */}
                <View style={[styles.section, dynamicStyles.section]}>
                    <Text style={[styles.sectionTitle, dynamicStyles.text]}>Calorie Budget</Text>
                    <Text style={[styles.calorieValue, { color: dynamicStyles.iconColor }]}>0</Text>

                    <View style={styles.row}>
                        {[
                            { name: 'heartbeat', label: 'Exercise' },
                            { name: 'tint', label: 'Water' },
                            { name: 'male', label: 'Steps' },
                        ].map((item, index) => (
                            <View key={index} style={styles.sectionItem}>
                                <Icon name={item.name} size={24} color={dynamicStyles.iconColor} />
                                <Text style={[styles.sectionText, dynamicStyles.text]}>{item.label}</Text>
                                <Text style={dynamicStyles.text}>0</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.row}>
                        {[
                            { name: 'pencil', label: 'Notes' },
                            { name: 'cutlery', label: 'Food' },
                            { name: 'question-circle', label: 'Questions' },
                        ].map((item, index) => (
                            <View key={index} style={styles.sectionItem}>
                                <Icon name={item.name} size={24} color={dynamicStyles.iconColor} />
                                <Text style={[styles.sectionText, dynamicStyles.text]}>{item.label}</Text>
                                <Text style={dynamicStyles.text}>0</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Weight, Goals, and Food Management Section */}
                {[
                    { name: 'balance-scale', text: 'Weight In', value: '65', subtext: 'Last recorded on Apr 7', screen: 'WeightIn' },
                    { name: 'bullseye', text: 'My Weight Goal & Plan', screen: 'WeightGoal' },
                    { name: 'cutlery', text: 'Manage my Foods', screen: 'FoodManager' },
                ].map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => item.screen && navigation.navigate(item.screen)}
                        style={[styles.cardItem, dynamicStyles.cardBackground]}
                    >
                        <Icon name={item.name} size={20} color={dynamicStyles.text.color} />
                        <View style={styles.cardTextContainer}>
                            <Text style={[styles.cardTitle, dynamicStyles.text]}>{item.text}</Text>
                            {item.subtext && <Text style={[styles.cardSubtext, dynamicStyles.text]}>{item.subtext}</Text>}
                        </View>
                        {item.value && (
                            <Text style={[styles.cardValue, { color: dynamicStyles.iconColor }]}>{item.value}</Text>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <BottomTabBar />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        padding: 20,
    },
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
    },
    navbarTitle: {
        fontSize: 22,
        marginLeft: 15,
    },
    calendarNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
    },
    calendarText: {
        fontSize: 18,
    },
    section: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
        borderWidth: 1,
    },
    sectionTitle: {
        textAlign: 'center',
        marginBottom: 10,
    },
    calorieValue: {
        fontSize: 28,
        textAlign: 'center',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    sectionItem: {
        alignItems: 'center',
        flex: 1,
    },
    sectionText: {
        marginTop: 5,
    },
    cardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
    },
    cardTextContainer: {
        flex: 1,
        marginLeft: 10,
    },
    cardTitle: {
        fontSize: 16,
    },
    cardSubtext: {
        fontSize: 12,
        marginTop: 2,
    },
    cardValue: {
        fontSize: 16,
    },
});

export default DashboardScreen;
