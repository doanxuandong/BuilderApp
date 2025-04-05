import React from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, Text, Image } from 'react-native';
import Sender from './Component/Sender';
import Receiver from './Component/Receiver';

const mockMessages = [
    { id: '1', type: 'receiver', text: 'Xin chào!' },
    { id: '2', type: 'sender', text: 'Chào bạn! Bạn khỏe không?' },
    { id: '3', type: 'receiver', text: 'Mình khỏe, cảm ơn. Còn bạn?' },
    { id: '4', type: 'sender', text: 'Cũng ổn luôn!' },
];

const BoxChat = () => {
    const renderItem = ({ item }) => {
        if (item.type === 'sender') {
            return <Sender text={item.text} />;
        } else {
            return <Receiver text={item.text} />;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header tên người nhận */}
            <View style={styles.header}>
                <Image
                    source={{ uri: 'https://i.pravatar.cc/150?img=12' }} // ảnh đại diện mẫu
                    style={styles.avatar}
                />
                <Text style={styles.name}>Nguyễn Văn A</Text>
            </View>

            {/* Danh sách tin nhắn */}
            <FlatList
                data={mockMessages}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messageContainer}
            />
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
    },
});

export default BoxChat;
