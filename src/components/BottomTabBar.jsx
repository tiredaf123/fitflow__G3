import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../navigation/ThemeProvider';

const BottomTabBar = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();

    const themeStyles = {
        tabBarWrapper1: {
            backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
        },
        tabBar: {
            backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
        },
        tabText: {
            color: isDarkMode ? '#FFF' : '#000',
        },
        homeButton: {
            backgroundColor: isDarkMode ? '#FF6B00' : '#FEC400',
            shadowColor: isDarkMode ? '#FF6B00' : '#FEC400',
        }
    };

    return (
        <View style={styles.tabBarWrapper}>
            <View style={[styles.tabBarWrapper1, themeStyles.tabBarWrapper1]}></View>
            <View style={[styles.tabBar, themeStyles.tabBar]}>
                <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('DashboardScreen')}>
                    <Icon name="grid-view" size={28} color={themeStyles.tabText.color} />
                    <Text style={[styles.tabText, themeStyles.tabText]}>Dashboard</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('WorkoutsScreen')}>
                    <Icon name="fitness-center" size={28} color={themeStyles.tabText.color} />
                    <Text style={[styles.tabText, themeStyles.tabText]}>Workouts</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.homeButton, themeStyles.homeButton]} onPress={() => navigation.navigate('HomeScreen')}>
                    <Icon name="home" size={30} color="#FFF" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('AchievementsScreen')}>
                    <Icon name="emoji-events" size={28} color={themeStyles.tabText.color} />
                    <Text style={[styles.tabText, themeStyles.tabText]}>Achievements</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('ProfileScreen')}>
                    <Icon name="person" size={28} color={themeStyles.tabText.color} />
                    <Text style={[styles.tabText, themeStyles.tabText]}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    tabBarWrapper: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 68,
    },
    tabBarWrapper1: {
        position: 'absolute',
        bottom: 25,
        width: '22%',
        height: 70,
        marginLeft: 150,
        borderRadius: 100.5,
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    tabButton: {
        alignItems: 'center',
    },
    tabText: {
        fontSize: 13,
        marginTop: 4,
    },
    homeButton: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -25,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        marginRight: 5,
        marginLeft: 5,
    }
});

export default BottomTabBar;
