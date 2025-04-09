import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useTheme } from '../../navigation/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const CalendarScreen = () => {
    const { isDarkMode } = useTheme();
    const navigation = useNavigation();
    const [selected, setSelected] = useState('');
    const [notes, setNotes] = useState('');
    const [allNotes, setAllNotes] = useState({});

    useEffect(() => {
        const storedNotes = {
            '2025-04-07': 'Morning jog completed, feeling good!',
            '2025-04-05': 'Took a rest day, felt tired.',
        };
        setAllNotes(storedNotes);
    }, []);

    const theme = {
        backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
        calendarBackground: isDarkMode ? '#1a1a1a' : '#ffffff',
        textSectionTitleColor: isDarkMode ? '#ccc' : '#000',
        selectedDayBackgroundColor: isDarkMode ? '#00BFFF' : '#FF6B00',
        selectedDayTextColor: '#ffffff',
        todayTextColor: isDarkMode ? '#00BFFF' : '#FF6B00',
        dayTextColor: isDarkMode ? '#fff' : '#000',
        textDisabledColor: '#555',
        arrowColor: isDarkMode ? '#00BFFF' : '#FF6B00',
        monthTextColor: isDarkMode ? '#fff' : '#000',
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleSaveNotes = () => {
        if (!selected) return;
        setAllNotes(prev => ({
            ...prev,
            [selected]: notes,
        }));
    };

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }]}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={handleBack}>
                    <MaterialIcon name="arrow-back" size={28} color={isDarkMode ? '#fff' : '#000'} />
                </TouchableOpacity>
                <Text style={[styles.headerText, { color: isDarkMode ? '#fff' : '#000' }]}>
                    Fitness Calendar
                </Text>
                <View style={{ width: 28 }} />
            </View>

            {/* Calendar */}
            <Calendar
                onDayPress={day => {
                    setSelected(day.dateString);
                    setNotes(allNotes[day.dateString] || '');
                }}
                markedDates={{
                    [selected]: {
                        selected: true,
                        selectedColor: isDarkMode ? '#00BFFF' : '#FF6B00',
                        selectedTextColor: '#fff',
                    },
                }}
                theme={theme}
            />

            {/* Selected Date Info */}
            {selected !== '' && (
                <View style={styles.selectedInfo}>
                    <Text style={[styles.infoText, { color: isDarkMode ? '#00BFFF' : '#FF6B00' }]}>
                        Selected: {selected}
                    </Text>
                    <Text style={[styles.infoText, { color: isDarkMode ? '#ccc' : '#333' }]}>
                        {allNotes[selected]
                            ? 'You have notes for this day.'
                            : 'You can log your fitness data for this day.'}
                    </Text>
                </View>
            )}

            {/* Notes Section */}
            <View
                style={[
                    styles.notesSection,
                    { backgroundColor: isDarkMode ? '#222' : '#f5f5f5' },
                ]}
            >
                <Text style={[styles.notesTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
                    Notes for {selected || 'this day'}
                </Text>
                <TextInput
                    style={[
                        styles.notesInput,
                        {
                            backgroundColor: isDarkMode ? '#333' : '#f1f1f1',
                            color: isDarkMode ? '#fff' : '#000',
                        },
                    ]}
                    placeholder="Add your notes here..."
                    placeholderTextColor={isDarkMode ? '#bbb' : '#666'}
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                />
                <TouchableOpacity
                    onPress={handleSaveNotes}
                    style={[
                        styles.saveButton,
                        { backgroundColor: isDarkMode ? '#00BFFF' : '#FF6B00' },
                    ]}
                >
                    <Text style={styles.saveButtonText}>Save Notes</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    selectedInfo: {
        marginTop: 20,
        alignItems: 'center',
    },
    infoText: {
        fontSize: 16,
        marginBottom: 5,
    },
    notesSection: {
        marginTop: 20,
        padding: 15,
        borderRadius: 8,
    },
    notesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    notesInput: {
        padding: 10,
        borderRadius: 8,
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
        maxHeight: 200,
        width: '100%',
    },
    saveButton: {
        marginTop: 10,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        color: '#fff',
    },
});

export default CalendarScreen;
