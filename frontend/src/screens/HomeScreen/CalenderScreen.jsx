import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useTheme } from '../../navigation/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const CalendarScreen = () => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation();
  const [selected, setSelected] = useState('');
  const [notes, setNotes] = useState('');
  const [allNotes, setAllNotes] = useState({});
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [membershipDeadline, setMembershipDeadline] = useState('');
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken);
    };

    checkToken();
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      if (!token) return;
      try {
        const res = await fetch('http://10.0.2.2:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUserId(data._id);
      } catch (err) {
        console.log('Error fetching userId:', err);
      }
    };

    fetchUserId();
  }, [token]);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!userId || !token) return;
      try {
        const res = await fetch(`http://10.0.2.2:5000/api/calendar/${userId}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (Array.isArray(result)) {
          const notesObject = result.reduce((acc, note) => {
            acc[note.date] = note.note;
            return acc;
          }, {});
          setAllNotes(notesObject);
        }
      } catch (err) {
        console.error('❌ Error fetching notes:', err);
      }
    };

    fetchNotes();
  }, [userId, token]);

  useEffect(() => {
    const fetchMembershipDeadline = async () => {
      if (!userId || !token) return;
      try {
        const res = await fetch(`http://10.0.2.2:5000/api/profile/membership`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMembershipDeadline(data.membershipDeadline);
      } catch (err) {
        console.error('❌ Error fetching membership deadline:', err);
      }
    };

    fetchMembershipDeadline();
  }, [userId, token]);

  // Live countdown logic in hours, minutes, seconds
  useEffect(() => {
    const updateCountdown = () => {
      if (membershipDeadline) {
        const now = moment();
        const deadline = moment(membershipDeadline);
        const diffInSeconds = deadline.diff(now, 'seconds');

        if (diffInSeconds <= 0) {
          setCountdown('EXPIRED');
        } else {
          const hours = Math.floor(diffInSeconds / 3600);
          const minutes = Math.floor((diffInSeconds % 3600) / 60);
          const seconds = diffInSeconds % 60;

          setCountdown(`${hours}h ${minutes}m ${seconds}s`);
        }
      }
    };

    updateCountdown(); // Initial run

    const interval = setInterval(updateCountdown, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, [membershipDeadline]);

  const handleSaveNotes = async () => {
    if (!selected || !notes.trim() || !token) return;

    const noteData = { date: selected, note: notes };

    try {
      const res = await fetch('http://10.0.2.2:5000/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(noteData),
      });

      const result = await res.json();

      if (res.ok) {
        setAllNotes((prev) => ({ ...prev, [selected]: notes }));
        setNotes('');
        const updatedNotes = { ...allNotes, [selected]: notes };
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      } else {
        console.error('❌ Backend error:', result);
      }
    } catch (err) {
      console.error('❌ Network error:', err);
    }
  };

  const handleDeleteNote = async () => {
    if (!selected || !token) return;

    try {
      const res = await fetch(`http://10.0.2.2:5000/api/calendar/${userId}/${selected}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const updatedNotes = { ...allNotes };
        delete updatedNotes[selected];
        setAllNotes(updatedNotes);
        setNotes('');
        setSelected('');
        Alert.alert('Success', 'Note deleted successfully!');
      } else {
        console.error('❌ Error deleting note');
        Alert.alert('Error', 'Failed to delete the note.');
      }
    } catch (err) {
      console.error('❌ Network error:', err);
    }
  };

  const getMarkedDates = () => {
    const marked = {};

    Object.keys(allNotes).forEach((date) => {
      marked[date] = {
        marked: true,
        dotColor: isDarkMode ? '#00BFFF' : '#FF6B00',
      };
    });

    if (membershipDeadline) {
      const deadline = moment(membershipDeadline).format('YYYY-MM-DD');
      marked[deadline] = {
        ...marked[deadline],
        customStyles: {
          container: {
            backgroundColor: '#cc0000', // Red background for expiration
            borderRadius: 50,
          },
          text: {
            color: 'white',
            fontWeight: 'bold',
          },
        },
      };
    }

    if (selected) {
      marked[selected] = {
        ...marked[selected],
        customStyles: {
          container: {
            backgroundColor: isDarkMode ? '#00BFFF' : '#FF6B00',
            borderRadius: 50,
          },
          text: {
            color: 'white',
            fontWeight: '600',
          },
        },
      };
    }

    return marked;
  };

  const theme = {
    calendarBackground: isDarkMode ? '#1a1a1a' : '#ffffff',
    dayTextColor: isDarkMode ? '#fff' : '#000',
    selectedDayBackgroundColor: '#4444ff',
    todayTextColor: isDarkMode ? '#00BFFF' : '#FF6B00',
    arrowColor: isDarkMode ? '#00BFFF' : '#FF6B00',
    textSectionTitleColor: isDarkMode ? '#ccc' : '#000',
    dotColor: isDarkMode ? '#00BFFF' : '#FF6B00',
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
          setNotes(allNotes[day.dateString] || '');
        }}
        markedDates={getMarkedDates()}
        markingType="custom"
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

          <TouchableOpacity
            onPress={handleDeleteNote}
            style={[styles.button, { backgroundColor: 'red', marginTop: 10 }]}
          >
            <Text style={{ color: '#fff' }}>Delete Note</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={[styles.membershipText, { color: isDarkMode ? '#ff6b6b' : '#cc0000' }]}>
        {countdown === 'EXPIRED' ? 'Membership has expired' : `Membership expires in: ${countdown}`}
      </Text>
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
  membershipText: {
    marginTop: 30,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CalendarScreen;
