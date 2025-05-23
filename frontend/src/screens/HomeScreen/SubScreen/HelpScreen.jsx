import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking,
} from 'react-native';
import { useTheme } from '../../../navigation/ThemeProvider';
import BottomTabBar from '../../../components/BottomTabBar';

const HelpScreen = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const [sender, setSender] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { from: 'bot', text: 'Hi! How can I help you today?' },
  ]);
  const [isChatVisible, setIsChatVisible] = useState(true);

  const handleSend = () => {
    if (!sender || !senderEmail || !message) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const subject = `Help Request from ${sender} (${senderEmail})`;
    const body = encodeURIComponent(message);
    const mailtoURL = `mailto:koiralam613@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

    Linking.openURL(mailtoURL).catch(() =>
      Alert.alert('Error', 'Unable to open email client')
    );
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;

    const userMessage = { from: 'user', text: chatInput.trim() };
    const botReply = getBotReply(chatInput.trim().toLowerCase());

    setChatMessages([...chatMessages, userMessage, { from: 'bot', text: botReply }]);
    setChatInput('');
  };

  // Simple AI response simulation
  const getBotReply = (text) => {
    if (text.includes('reset')) {
      return 'To reset your password, go to Settings > Account > Reset Password.';
    } else if (text.includes('contact')) {
      return 'You can email us at koiralam613@gmail.com.';
    } else if (text.includes('features')) {
      return 'Our app lets you manage your profile, upload images, and more!';
    } else if (text.includes('hello') || text.includes('hi')) {
      return 'Hello! How can I assist you today?';
    } else if (text.includes('thanks')) {
      return 'You\'re welcome! Let me know if you need further help.';
    }
    return "I'm not sure about that. Try asking something else or email us at koiralam613@gmail.com!";
  };

  const handleQuickQuestion = (question) => {
    const userMessage = { from: 'user', text: question };
    const botReply = getBotReply(question.toLowerCase());

    setChatMessages([...chatMessages, userMessage, { from: 'bot', text: botReply }]);
  };

  const clearChat = () => {
    setChatMessages([{ from: 'bot', text: 'Hi! How can I help you today?' }]);  // Reset to initial message
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Contact Form */}
        <Text style={styles.heading}>Contact Support</Text>
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          placeholderTextColor="#888"
          value={sender}
          onChangeText={setSender}
        />
        <TextInput
          style={styles.input}
          placeholder="Your Email"
          placeholderTextColor="#888"
          value={senderEmail}
          onChangeText={setSenderEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Your Message"
          placeholderTextColor="#888"
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={6}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send Message</Text>
        </TouchableOpacity>

        {/* Chatbot UI */}
        {isChatVisible && (
          <View style={styles.chatBox}>
            <ScrollView
              style={styles.chatMessages}
              contentContainerStyle={styles.chatMessagesContainer}
              keyboardShouldPersistTaps="handled"
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={true}  // Show vertical scroll bar
            >
              {/* Quick Response Buttons inside the chatbox */}
              <View style={styles.quickResponsesContainer}>
                <TouchableOpacity
                  style={[styles.quickButton, { backgroundColor: '#4863A0' }]}
                  onPress={() => handleQuickQuestion('reset password')}
                >
                  <Text style={styles.quickButtonText}>How to reset password?</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.quickButton, { backgroundColor: '#4863A0' }]}
                  onPress={() => handleQuickQuestion('contact')}
                >
                  <Text style={styles.quickButtonText}>Contact support</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.quickButton, { backgroundColor: '#4863A0' }]}
                  onPress={() => handleQuickQuestion('features')}
                >
                  <Text style={styles.quickButtonText}>What features does this app have?</Text>
                </TouchableOpacity>
              </View>

              {/* Chat Messages */}
              {chatMessages.map((msg, index) => (
                <Text
                  key={index}
                  style={msg.from === 'bot' ? styles.botText : styles.userText}
                >
                  {msg.text}
                </Text>
              ))}
            </ScrollView>

            <View style={styles.chatInputContainer}>
              <TextInput
                style={styles.chatInput}
                placeholder="Ask a question..."
                placeholderTextColor="#888"
                value={chatInput}
                onChangeText={setChatInput}
                onSubmitEditing={handleChatSend}
                returnKeyType="send"
              />
              <TouchableOpacity onPress={handleChatSend}>
                <Text style={styles.sendIcon}>✔️</Text>
              </TouchableOpacity>
            </View>

            {/* Clear Chat Button */}
            <TouchableOpacity onPress={clearChat} style={styles.clearChatButton}>
              <Text style={styles.clearChatButtonText}>Clear Chat</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity onPress={() => setIsChatVisible(!isChatVisible)}>
          <Text style={styles.toggleChatButton}>
            {isChatVisible ? 'Hide Chatbot' : 'Show Chatbot'}
          </Text>
        </TouchableOpacity>

      </ScrollView>

      <BottomTabBar />
    </View>
  );
};

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1e1e1e' : '#F5F5F5',
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 100,
    },
    heading: {
      fontSize: 22,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFF' : '#000',
      marginBottom: 15,
    },
    input: {
      backgroundColor: isDarkMode ? '#2a2a2a' : '#FFF',
      color: isDarkMode ? '#FFF' : '#000',
      borderWidth: 1,
      borderColor: isDarkMode ? '#444' : '#DDD',
      borderRadius: 10,
      padding: 12,
      fontSize: 16,
      marginBottom: 20,
    },
    textArea: {
      height: 120,
      textAlignVertical: 'top',
    },
    sendButton: {
      backgroundColor: '#1167b1',
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 40,
    },
    sendButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    chatBox: {
      marginBottom: 30,
      padding: 15,
      backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
      borderRadius: 10,
      borderColor: isDarkMode ? '#444' : '#ccc',
      borderWidth: 1,
      flex: 1,  // Make chatbox flexible
    },
    chatMessages: {
      flexGrow: 1, // Allow chat area to expand with content
    },
    chatMessagesContainer: {
      paddingBottom: 10,
    },
    botText: {
      backgroundColor: isDarkMode ? '#444' : '#eee',
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
      color: isDarkMode ? '#fff' : '#000',
      fontSize: 18,
    },
    userText: {
      backgroundColor: isDarkMode ? '#007bff55' : '#cce5ff',
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
      alignSelf: 'flex-end',
      color: isDarkMode ? '#fff' : '#000',
      fontSize: 18,
    },
    chatInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 25,
    },
    chatInput: {
      flex: 1,
      backgroundColor: isDarkMode ? '#333' : '#f0f0f0',
      borderRadius: 8,
      paddingHorizontal: 15,
      color: isDarkMode ? '#fff' : '#000',
      fontSize: 18,
    },
    sendIcon: {
      fontSize: 25,
      marginLeft: 15,
    },
    toggleChatButton: {
      textAlign: 'center',
      color: '#FF6B00',
      fontSize: 16,
      marginTop: 15,
    },
    quickResponsesContainer: {
      marginBottom: 20,
    },
    quickButton: {
      padding: 12,
      borderRadius: 8,
      marginBottom: 10,
      alignItems: 'left',
      width: 200,  // Adjust size of buttons
      backgroundColor: 'B4CFEC',
    },
    quickButtonText: {
      color: '#FFF',
      fontSize: 14,
    },
    clearChatButton: {
      backgroundColor: '#FF0000',
      paddingVertical: 10,
      borderRadius: 8,
      marginTop: 10,
      alignItems: 'center',
    },
    clearChatButtonText: {
      color: '#FFF',
      fontSize: 16,
    },
  });

export default HelpScreen;