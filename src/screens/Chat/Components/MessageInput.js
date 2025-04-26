import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const MessageInput = ({ text, setText, onSend }) => {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                value={text}
                onChangeText={setText}
                placeholder="Nhập tin nhắn..."
                multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={onSend}>
                <Icon name="send" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: '#c65128',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MessageInput; 