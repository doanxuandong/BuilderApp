import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';


const ItemChat = ({ avatar, name, navigation }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => {
                navigation.navigate('BoxChat')
            }}
        >
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <View style={styles.textContainer}>
                <Text style={styles.name}>{name}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        backgroundColor: '#fff', // đổi nền trắng
        borderWidth: 1,           // thêm viền
        borderColor: '#ccc',      // màu viền xám nhạt
        borderRadius: 8,          // bo góc nhẹ
        marginVertical: 5,        // cách giữa các item nếu cần
        marginHorizontal: 10,     // lề hai bên
    },

    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    name: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    },
    message: {
        color: 'gray',
        marginTop: 2,
    },
    rightSection: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    time: {
        color: 'gray',
        fontSize: 12,
    },
    unreadDot: {
        width: 10,
        height: 10,
        backgroundColor: '#00AEEF',
        borderRadius: 5,
        marginTop: 5,
    },
});

export default ItemChat;
