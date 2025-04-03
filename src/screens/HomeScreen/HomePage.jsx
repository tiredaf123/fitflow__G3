import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    ScrollView,
    Animated,
    Easing,
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
    const [flippedCardId, setFlippedCardId] = useState(null);
    const flipAnimations = useRef({}).current;

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
        { id: 'diet-1', name: 'Salad Bowl', image: require('../../assets/Images/salad.png'), calories: 150, protein: '3g' },
        { id: 'diet-2', name: 'Grilled Chicken', image: require('../../assets/Images/chicken.png'), calories: 220, protein: '30g' },
        { id: 'diet-3', name: 'Fruit Mix', image: require('../../assets/Images/fruits.png'), calories: 120, protein: '2g' },
        { id: 'diet-4', name: 'Oatmeal', image: require('../../assets/Images/oatmeal.png'), calories: 180, protein: '5g' },
        { id: 'diet-5', name: 'Smoothie', image: require('../../assets/Images/smoothie.png'), calories: 200, protein: '8g' },
    ];

    const workoutRecommendations = [
        { id: 'workout-1', name: 'Morning Yoga', image: require('../../assets/Images/yoga.png'), caloriesBurned: '100-150 kcal for 20-30 min' },
        { id: 'workout-2', name: 'HIIT Training', image: require('../../assets/Images/hiit.png') },
        { id: 'workout-3', name: 'Strength Training', image: require('../../assets/Images/strength.png') },
        { id: 'workout-4', name: 'Cardio Blast', image: require('../../assets/Images/cardio.png') },
    ];

    const getFlipAnimation = (id) => {
        if (!flipAnimations[id]) {
            flipAnimations[id] = new Animated.Value(0);
        }
        return flipAnimations[id];
    };

    const handleFlip = (id) => {
        if (flippedCardId && flippedCardId !== id) {
            Animated.timing(getFlipAnimation(flippedCardId), {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.linear,
            }).start(() => {
                setFlippedCardId(id);
                Animated.timing(getFlipAnimation(id), {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                    easing: Easing.linear,
                }).start();
            });
        } else if (flippedCardId === id) {
            Animated.timing(getFlipAnimation(id), {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.linear,
            }).start(() => setFlippedCardId(null));
        } else {
            setFlippedCardId(id);
            Animated.timing(getFlipAnimation(id), {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.linear,
            }).start();
        }
    };

    return (
        <View style={themeStyles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                <View style={styles.navbar}>
                    <Text style={themeStyles.logoText}>FitnessApp</Text>
                    <TouchableOpacity>
                        <Icon name="notifications" size={28} color={isDarkMode ? '#FFF' : '#000'} />
                    </TouchableOpacity>
                </View>

                <View style={styles.profileWrapper}>
                    <Image source={require('../../assets/Images/profile.png')} style={styles.profileImage} />
                    <View>
                        <Text style={themeStyles.greetingText}>Good Morning, User!</Text>
                        <Text style={themeStyles.subText}>Stay consistent and reach your goals!</Text>
                    </View>
                </View>

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

                <Text style={styles.sectionTitle}>Recommended Diet Plans 🍏</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
                    {dietFoods.map((item) => {
                        const anim = getFlipAnimation(item.id);
                        const frontInterpolate = anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '180deg'],
                        });
                        const backInterpolate = anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['180deg', '360deg'],
                        });
                        const isFlipped = flippedCardId === item.id;

                        return (
                            <TouchableOpacity key={item.id} onPress={() => handleFlip(item.id)}>
                                <View style={styles.cardContainer}>
                                    <Animated.View
                                        style={[styles.card, {
                                            transform: [{ rotateY: frontInterpolate }],
                                            backfaceVisibility: 'hidden',
                                            position: 'absolute',
                                        }]}
                                    >
                                        <Image source={item.image} style={styles.cardImage} />
                                        <Text style={styles.cardText}>{item.name}</Text>
                                    </Animated.View>

                                    <Animated.View
                                        style={[styles.card, styles.cardBack, {
                                            transform: [{ rotateY: backInterpolate }],
                                            backfaceVisibility: 'hidden',
                                        }]}
                                    >
                                        <Text style={styles.cardText}>{item.name}</Text>
                                        <Text style={styles.cardText}>Calories: {item.calories}</Text>
                                        <Text style={styles.cardText}>Protein: {item.protein}</Text>
                                    </Animated.View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                <Text style={styles.sectionTitle}>Today's Workout Recommendations 🏋️</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
                    {workoutRecommendations.map((item) => {
                        const anim = getFlipAnimation(item.id);
                        const frontInterpolate = anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '180deg'],
                        });
                        const backInterpolate = anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['180deg', '360deg'],
                        });
                        const isFlipped = flippedCardId === item.id;

                        return (
                            <TouchableOpacity key={item.id} onPress={() => handleFlip(item.id)}>
                                <View style={styles.cardContainer}>
                                    <Animated.View
                                        style={[styles.card, {
                                            transform: [{ rotateY: frontInterpolate }],
                                            backfaceVisibility: 'hidden',
                                            position: 'absolute',
                                        }]}
                                    >
                                        <Image source={item.image} style={styles.cardImage} />
                                        <Text style={styles.cardText}>{item.name}</Text>
                                    </Animated.View>

                                    <Animated.View
                                        style={[styles.card, styles.cardBack, {
                                            transform: [{ rotateY: backInterpolate }],
                                            backfaceVisibility: 'hidden',
                                        }]}
                                    >
                                        <Text style={styles.cardText}>{item.name}</Text>
                                        {item.caloriesBurned && (
                                            <Text style={styles.cardText}>Burns: {item.caloriesBurned}</Text>
                                        )}
                                    </Animated.View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </ScrollView>
            <BottomTabBar />
        </View>
    );
};

// styles remain the same



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
    scrollRow: {
        paddingVertical: 20,
        paddingLeft: 20,
    },
    cardContainer: {
        width: 130,
        height: 160,
        marginRight: 15,
        perspective: 1000,
    },
    card: {
        width: '100%',
        height: '100%',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 5,
     
    },
    cardBack: {
        backgroundColor: '#FFEDD5',
        position: 'absolute',
        top: 0,
        left: 0,
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
        textAlign: 'center',
    },
});

export default HomeScreen;