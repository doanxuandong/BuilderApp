import React, { useRef, useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import MessageItem from './MessageItem';

const MessageList = ({ messages, currentUserId, navigation }) => {
    const flatListRef = useRef(null);

    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    const renderMessage = ({ item }) => (
        <MessageItem
            message={item}
            currentUserId={currentUserId}
            navigation={navigation}
        />
    );

    return (
        <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            style={styles.messagesList}
            inverted={false}
            onEndReached={() => {
                // Load more messages if needed
            }}
            onEndReachedThreshold={0.5}
            onContentSizeChange={() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }}
        />
    );
};

const styles = StyleSheet.create({
    messagesList: {
        flex: 1,
        padding: 10,
    },
});

export default MessageList; 