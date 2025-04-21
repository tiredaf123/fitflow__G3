import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useTheme } from '../../navigation/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CalendarScreen = () => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation();
  const [selected, setSelected] = useState('');
  const [notes, setNotes] = useState('');
  const [allNotes, setAllNotes] = useState({});
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');  // To store token

  // Fetch and log the token when the component is mounted
  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      console.log('Stored Token:', storedToken); // Check the stored token
      setToken(storedToken);  // Store token in state
    };

    checkToken(); // Run when component mounts
  }, []);

  // Fetch user ID based on token
  useEffect(() => {
    const fetchUserId = async () => {
      if (!token) return;  // Only proceed if token is available

      try {
        const res = await fetch('http://10.0.2.2:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setUserId(data._id);
      } catch (err) {
        console.log('Error fetching userId:', err);
      }
    };

    fetchUserId(); // Fetch userId when token is set
  }, [token]); // Re-run when token changes

  // Fetch all notes when userId changes
  useEffect(() => {
    const fetchNotes = async () => {
      if (!userId || !token) return;  // Only proceed if userId and token are available

      try {
        const res = await fetch(`http://10.0.2.2:5000/api/calendar/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
    
        const result = await res.json();
        if (!res.ok) {
          console.error('❌ Error fetching notes:', result?.message || 'Unknown error');
          return;
        }
    
        if (Array.isArray(result)) {
          console.log('Fetched Notes:', result); // This should log an array of notes
          const notesObject = result.reduce((acc, note) => {
            acc[note.date] = note.note;
            return acc;
          }, {});
          setAllNotes(notesObject); // Or however you want to store the notes
        } else {
          console.error('❌ Unexpected response format:', result);
        }
      } catch (err) {
        console.error('❌ Error fetching notes:', err instanceof Error ? err.message : err);
      }
    };

    fetchNotes(); // Trigger fetching notes
  }, [userId, token]); // Run whenever userId or token changes

  // Save the note
  const handleSaveNotes = async () => {
    if (!selected) return;
    if (!notes || notes.trim() === '') {
      console.warn('⚠️ Cannot save an empty note.');
      return;
    }
    if (!token) {
      console.warn('❌ No token found.');
      return;
    }

    const noteData = {
      date: selected,
      note: notes,
    };

    try {
      console.log('Sending token:', token);  // Log token to check

      const res = await fetch('http://10.0.2.2:5000/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(noteData),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error('❌ Backend error:', result?.message || 'Unknown error');
      } else {
        console.log('✅ Saved successfully:', result);
        setAllNotes((prev) => ({ ...prev, [selected]: notes }));
        setNotes('');
        
        // Save to AsyncStorage
        const updatedNotes = { ...allNotes, [selected]: notes };
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes)); // Save updated notes to AsyncStorage
      }
    } catch (err) {
      console.error('❌ Network/JS error:', err instanceof Error ? err.message : err);
    }
  };

  // Prepare the calendar's marked dates
  const getMarkedDates = () => {
    const marked = {};

    Object.keys(allNotes).forEach((date) => {
      marked[date] = {
        marked: true,
        dotColor: isDarkMode ? '#00BFFF' : '#FF6B00',
      };
    });

    if (selected) {
      marked[selected] = {
        ...marked[selected],
        selected: true,
        selectedColor: isDarkMode ? '#00BFFF' : '#FF6B00',
        selectedTextColor: '#fff',
      };
    }

    return marked;
  };

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
    dotColor: isDarkMode ? '#00BFFF' : '#FF6B00',
    textDayFontWeight: '500',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '600',
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcon name="arrow-back" size={28} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: isDarkMode ? '#fff' : '#000' }]}>Fitness Calendar</Text>
        <View style={{ width: 28 }} />
      </View>

      <Calendar
        onDayPress={(day) => {
          setSelected(day.dateString);
          setNotes(allNotes[day.dateString] || ''); // Show the notes for the selected date
        }}
        markedDates={getMarkedDates()}
        theme={theme}
      />

      {selected && (
        <View style={styles.notesSection}>
          <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>Notes for {selected}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: isDarkMode ? '#333' : '#f1f1f1', color: isDarkMode ? '#fff' : '#000' }]}
            placeholder="e.g., Upper body workout and cardio"
            placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
            value={notes}
            onChangeText={setNotes}
            multiline
          />
          <TouchableOpacity
            onPress={handleSaveNotes}
            style={[styles.button, { backgroundColor: isDarkMode ? '#00BFFF' : '#FF6B00' }]}
          >
            <Text style={{ color: '#fff' }}>Save Note</Text>
          </TouchableOpacity>
        </View>
      )}
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
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  notesSection: {
    marginTop: 20,
  },
  input: {
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    minHeight: 80,
  },
  button: {
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default CalendarScreen;
