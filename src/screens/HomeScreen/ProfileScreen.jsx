import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../navigation/ThemeProvider';
import BottomTabBar from '../../components/BottomTabBar';

const ProfileScreen = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', onPress: () => console.log('Logged out') },
        ]);
    };

    const themeStyles = {
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? '#1e1e1e' : '#F0F0F0',
        },
        text: {
            color: isDarkMode ? '#FFF' : '#000',
        },
        settingItem: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode ? '#444' : '#DDD',
        },
        settingsSection: {
            backgroundColor: isDarkMode ? '#2a2a2a' : '#FFF',
            borderRadius: 20,
            margin: 20,
            padding: 10,
        },
        toggleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 15,
            borderRadius: 12,
            backgroundColor: isDarkMode ? '#333' : '#DDD',
            marginTop: 20,
            marginHorizontal: 20,
        },
        toggleText: {
            color: isDarkMode ? '#FFF' : '#000',
            fontSize: 16,
            fontWeight: 'bold',
        },
        toggleIcon: {
            padding: 6,
            borderRadius: 10,
            backgroundColor: isDarkMode ? '#FF6B00' : '#00BFFF',
        },
    };

    return (
        <View style={themeStyles.container}>
            <ScrollView>
                <View style={styles.profileHeader}>
                    <Image source={require('../../assets/Images/profile.png')} style={styles.profileImage} />
                    <TouchableOpacity style={styles.editButton}>
                        <Icon name="edit" size={20} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={[styles.name, themeStyles.text]}>Shane</Text>
                    <Text style={[styles.email, themeStyles.text]}>shane.sine@gmail.com</Text>
                </View>

                {/* Basic Settings */}
                <View style={themeStyles.settingsSection}>
                    <TouchableOpacity style={themeStyles.settingItem}>
                        <Icon name="person" size={24} color={themeStyles.text.color} />
                        <Text style={[styles.settingText, themeStyles.text]}>Personal</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={themeStyles.settingItem}>
                        <Icon name="tune" size={24} color={themeStyles.text.color} />
                        <Text style={[styles.settingText, themeStyles.text]}>General</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={themeStyles.settingItem}>
                        <Icon name="notifications" size={24} color={themeStyles.text.color} />
                        <Text style={[styles.settingText, themeStyles.text]}>Notification</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={themeStyles.settingItem}>
                        <Icon name="help" size={24} color={themeStyles.text.color} />
                        <Text style={[styles.settingText, themeStyles.text]}>Help</Text>
                    </TouchableOpacity>
                </View>

                {/* Additional Options */}
                <View style={themeStyles.settingsSection}>
                    <TouchableOpacity style={themeStyles.settingItem}>
                        <Icon name="fitness-center" size={24} color={themeStyles.text.color} />
                        <Text style={[styles.settingText, themeStyles.text]}>Hire a Coach</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={themeStyles.settingItem}>
                        <Icon name="info" size={24} color={themeStyles.text.color} />
                        <Text style={[styles.settingText, themeStyles.text]}>About</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={themeStyles.settingItem}>
                        <Icon name="gavel" size={24} color={themeStyles.text.color} />
                        <Text style={[styles.settingText, themeStyles.text]}>Terms & Conditions</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={themeStyles.settingItem} onPress={handleLogout}>
                        <Icon name="logout" size={24} color={themeStyles.text.color} />
                        <Text style={[styles.settingText, themeStyles.text]}>Logout</Text>
                    </TouchableOpacity>
                </View>

                {/* Theme Toggle */}
                <View style={themeStyles.toggleContainer}>
                    <Text style={themeStyles.toggleText}>
                        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                    </Text>
                    <View style={themeStyles.toggleIcon}>
                        <Switch value={isDarkMode} onValueChange={toggleTheme} />
                    </View>
                </View>
            </ScrollView>

            <BottomTabBar />
        </View>
    );
};

const styles = StyleSheet.create({
    profileHeader: {
        alignItems: 'center',
        marginTop: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#FF6B00',
    },
    editButton: {
        position: 'absolute',
        right: 40,
        bottom: 15,
        backgroundColor: '#FF6B00',
        padding: 6,
        borderRadius: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    email: {
        fontSize: 14,
        marginBottom: 20,
    },
    settingText: {
        marginLeft: 15,
        fontSize: 16,
    }
});

export default ProfileScreen;