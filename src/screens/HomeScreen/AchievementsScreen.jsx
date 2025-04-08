import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../navigation/ThemeProvider';
import BottomTabBar from '../../components/BottomTabBar';

const AchievementsScreen = () => {
    const { isDarkMode } = useTheme();

    const themeStyles = {
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? '#1A1A1A' : '#F0F0F0',
        },
        header: {
            color: isDarkMode ? '#FFF' : '#000',
            fontSize: 28,
            fontWeight: 'bold',
            marginBottom: 30,
            textAlign: 'center',
        },
        achievementCard: {
            backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF',
            padding: 20,
            borderRadius: 12,
            marginBottom: 20,
            shadowColor: isDarkMode ? '#FF6B00' : '#888',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.4,
            shadowRadius: 5,
        },
        achievementTitle: {
            color: '#FF6B00',
            fontSize: 20,
            fontWeight: 'bold',
        },
        achievementDescription: {
            color: isDarkMode ? '#FFF' : '#444',
            fontSize: 15,
            marginTop: 5,
        },
    };

    return (
        <View style={themeStyles.container}>
            <ScrollView>
                <Text style={themeStyles.header}>Achievements</Text>
                <View style={themeStyles.achievementCard}>  
                    <Text style={themeStyles.achievementTitle}>🏅 First Workout Completed</Text>
                    <Text style={themeStyles.achievementDescription}>
                        You've completed your first workout. Keep it up!
                    </Text>
                </View>
                <View style={themeStyles.achievementCard}>  
                    <Text style={themeStyles.achievementTitle}>🔥 7-Day Streak</Text>
                    <Text style={themeStyles.achievementDescription}>
                        You’ve worked out for 7 consecutive days. Great consistency!
                    </Text>
                </View>
                <View style={themeStyles.achievementCard}>  
                    <Text style={themeStyles.achievementTitle}>💪 New Personal Record</Text>
                    <Text style={themeStyles.achievementDescription}>
                        You've achieved your best workout performance yet. Well done!
                    </Text>
                </View>
            </ScrollView>

            {/* Bottom Navigation Bar */}
            <BottomTabBar />
        </View>
    );
};

export default AchievementsScreen;
