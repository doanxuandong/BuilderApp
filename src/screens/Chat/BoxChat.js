import React, { useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    SafeAreaView,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import Sender from './Component/Sender';
import Receiver from './Component/Receiver';
const BoxChat = () => {
    const [messages, setMessages] = useState([
        { id: '1', type: 'receiver', text: 'Xin chào!' },
        { id: '2', type: 'sender', text: 'Chào bạn! Bạn khỏe không?' },
        { id: '3', type: 'receiver', text: 'Mình khỏe, cảm ơn. Còn bạn?' },
        { id: '4', type: 'sender', text: 'Cũng ổn luôn!' },
    ]);
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (inputText.trim() === '') return;

        const newMessage = {
            id: Date.now().toString(),
            type: 'sender',
            text: inputText.trim(),
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputText('');
    };

    const renderItem = ({ item }) => {
        if (item.type === 'sender') {
            return <Sender text={item.text} />;
        } else {
            return <Receiver text={item.text} />;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image
                    source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                    style={styles.avatar}
                />
                <Text style={styles.name}>Nguyễn Văn A</Text>
            </View>

            {/* Chat list */}
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messageContainer}
            />

            {/* Input + Send */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={80}
            >
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập tin nhắn..."
                        value={inputText}
                        onChangeText={setInputText}
                    />
                    <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                        <Text style={styles.sendText}>Gửi</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    messageContainer: {
        padding: 10,
        paddingBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 15,
        backgroundColor: '#fff',
    },
    sendButton: {
        marginLeft: 8,
        backgroundColor: '#0084ff',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    sendText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default BoxChat;
