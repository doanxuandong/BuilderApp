import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import UpName from '../../Comment/UpName';
import UpAv from '../../Comment/UpAv';

const MessageItem = ({ message, currentUserId, navigation }) => {
    const isMyMessage = message.userId === currentUserId;

    return (
        <View style={[
            styles.messageContainer,
            isMyMessage ? styles.myMessage : styles.otherMessage
        ]}>
            {!isMyMessage && (
                <TouchableOpacity
                    onPress={() => {
                        if (message.userId !== currentUserId) {
                            navigation.navigate('ProfileUser', { userId: message.userId });
                        }
                    }}
                >
                    <UpAv cons={message.userId} />
                </TouchableOpacity>
            )}
            <View style={styles.messageContent}>
                {!isMyMessage && (
                    <TouchableOpacity
                        onPress={() => {
                            if (message.userId !== currentUserId) {
                                navigation.navigate('ProfileUser', { userId: message.userId });
                            }
                        }}
                    >
                        <UpName cons={message.userId} />
                    </TouchableOpacity>
                )}
                <Text style={styles.messageText}>{message.text}</Text>
                <Text style={styles.timestamp}>
                    {message.createdAt ? new Date(message.createdAt.toDate()).toLocaleString() : ''}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        maxWidth: '80%',
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
        borderRadius: 10,
        padding: 10,
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#E8E8E8',
        borderRadius: 10,
        padding: 10,
    },
    messageContent: {
        marginLeft: 10,
    },
    messageText: {
        fontSize: 16,
    },
    timestamp: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
});

export default MessageItem; 