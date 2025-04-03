import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomTabBar from '../../components/BottomTabBar';
import { useTheme } from '../../navigation/ThemeProvider';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useTheme();
    const [hydrationCount, setHydrationCount] = useState(0);

    const themeStyles = {
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? '#1e1e1e' : '#F0F0F0',
        },
        logoText: {
            fontSize: 28,
            fontWeight: 'bold',
            color: isDarkMode ? '#FEC400' : '#FF6B00',
        },
        greetingText: {
            fontSize: 24,
            fontWeight: 'bold',
            color: isDarkMode ? '#FFF' : '#000',
        },
        subText: {
            fontSize: 14,
            color: isDarkMode ? '#AAA' : '#666',
        },
        summaryBox: {
            backgroundColor: isDarkMode ? '#0D0D0D' : '#E0E0E0',
            padding: 15,
            borderRadius: 12,
            alignItems: 'center',
            width: '30%',
        },
        summaryValue: {
            fontSize: 20,
            fontWeight: 'bold',
            color: isDarkMode ? '#FEC400' : '#FF6B00',
        },
    };

    const dietFoods = [
        { id: 1, name: 'Salad Bowl', image: require('../../assets/Images/salad.png') },
        { id: 2, name: 'Grilled Chicken', image: require('../../assets/Images/chicken.png') },
        { id: 3, name: 'Fruit Mix', image: require('../../assets/Images/fruits.png') },
        { id: 4, name: 'Oatmeal', image: require('../../assets/Images/oatmeal.png') },
        { id: 5, name: 'Smoothie', image: require('../../assets/Images/smoothie.png') },
    ];

    const workoutRecommendations = [
        { id: 1, name: 'Morning Yoga', image: require('../../assets/Images/yoga.png') },
        { id: 2, name: 'HIIT Training', image: require('../../assets/Images/hiit.png') },
        { id: 3, name: 'Strength Training', image: require('../../assets/Images/strength.png') },
        { id: 4, name: 'Cardio Blast', image: require('../../assets/Images/cardio.png') },
    ];

    return (
        <View style={themeStyles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                
                {/* Header */}
                <View style={styles.navbar}>
                    <Text style={themeStyles.logoText}>FitnessApp</Text>
                    <TouchableOpacity>
                        <Icon name="notifications" size={28} color={isDarkMode ? '#FFF' : '#000'} />
                    </TouchableOpacity>
                </View>

                {/* Greeting */}
                <View style={styles.profileWrapper}>
                    <Image source={require('../../assets/Images/profile.png')} style={styles.profileImage} />
                    <View>
                        <Text style={themeStyles.greetingText}>Good Morning, User!</Text>
                        <Text style={themeStyles.subText}>Stay consistent and reach your goals!</Text>
                    </View>
                </View>

                {/* Summary */}
                <View style={styles.summaryRow}>
                    <View style={themeStyles.summaryBox}>
                        <Text style={themeStyles.summaryValue}>1200</Text>
                        <Text style={themeStyles.subText}>Calories Burned</Text>
                    </View>
                    <View style={themeStyles.summaryBox}>
                        <Text style={themeStyles.summaryValue}>8500</Text>
                        <Text style={themeStyles.subText}>Steps</Text>
                    </View>
                    <View style={themeStyles.summaryBox}>
                        <Text style={themeStyles.summaryValue}>45m</Text>
                        <Text style={themeStyles.subText}>Workout</Text>
                    </View>
                </View>

                {/* Hydration Tracker */}
                <Text style={styles.sectionTitle}>Hydration Tracker 💧</Text>
                <View style={styles.hydrationWrapper}>
                    <TouchableOpacity onPress={() => setHydrationCount(hydrationCount + 1)}>
                        <Image source={require('../../assets/Images/water-glass.png')} style={styles.hydrationIcon} />
                    </TouchableOpacity>
                    <Text style={styles.hydrationText}>{hydrationCount} Glasses</Text>
                    <TouchableOpacity onPress={() => setHydrationCount(Math.max(hydrationCount - 1, 0))}>
                        <Icon name="remove-circle-outline" size={30} color="#0277BD" />
                    </TouchableOpacity>
                </View>

                {/* Diet Section */}
                <Text style={styles.sectionTitle}>Recommended Diet Plans 🍏</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
                    {dietFoods.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <Image source={item.image} style={styles.cardImage} />
                            <Text style={styles.cardText}>{item.name}</Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Workout Section */}
                <Text style={styles.sectionTitle}>Today's Workout Recommendations 🏋️</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
                    {workoutRecommendations.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <Image source={item.image} style={styles.cardImage} />
                            <Text style={styles.cardText}>{item.name}</Text>
                        </View>
                    ))}
                </ScrollView>
            </ScrollView>

            {/* Bottom Navigation */}
            <BottomTabBar />
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    profileWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: 30,
        color: '#333',
    },
    hydrationWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 20,
        backgroundColor: '#E3F2FD',
        padding: 15,
        borderRadius: 12,
    },
    hydrationText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0277BD',
    },
    hydrationIcon: {
        width: 30,
        height: 30,
    },
    scrollRow: {
        paddingVertical: 15,
        paddingLeft: 20,
    },
    card: {
        width: 130,
        backgroundColor: '#FFF',
        borderRadius: 12,
        marginRight: 15,
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 5,
        elevation: 4,
    },
    cardImage: {
        width: 90,
        height: 90,
        borderRadius: 8,
    },
    cardText: {
        marginTop: 8,
        fontSize: 15,
        fontWeight: 'bold',
        color: '#444',
    },
});

export default HomeScreen;
