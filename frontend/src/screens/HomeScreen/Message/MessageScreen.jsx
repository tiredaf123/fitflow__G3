import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../../../navigation/ThemeProvider';

const MessageScreen = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const [messages, setMessages] = useState([
    { id: '1', sender: 'coach', text: 'Hey there! Ready to train today?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
    };
    setMessages([...messages, newMessage]);
    setInput('');
  };

  const renderItem = ({ item }) => (
    <View
      style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.coachBubble]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1e1e1e' : '#F5F5F5',
    },
    chatContainer: {
      padding: 15,
    },
    messageBubble: {
      padding: 12,
      borderRadius: 12,
      marginBottom: 10,
      maxWidth: '75%',
    },
    userBubble: {
      alignSelf: 'flex-end',
      backgroundColor: '#00BFFF',
    },
    coachBubble: {
      alignSelf: 'flex-start',
      backgroundColor: isDarkMode ? '#444' : '#DDD',
    },
    messageText: {
      color: isDarkMode ? '#fff' : '#000',
      fontSize: 16,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? '#444' : '#CCC',
      backgroundColor: isDarkMode ? '#2a2a2a' : '#FFF',
    },
    textInput: {
      flex: 1,
      height: 40,
      borderRadius: 20,
      paddingHorizontal: 15,
      backgroundColor: isDarkMode ? '#1e1e1e' : '#EEE',
      color: isDarkMode ? '#FFF' : '#000',
    },
    sendButton: {
      marginLeft: 10,
      backgroundColor: '#28A745',
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
    },
    sendText: {
      color: '#FFF',
      fontWeight: 'bold',
    },
  });

export default MessageScreen;
