import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ItemChat = ({ name, navigation, email }) => {
    const handlePress = async () => {
        try {
            await AsyncStorage.setItem('data', email);
            navigation.navigate('BoxChat');
        } catch (error) {
            console.error('Error saving email:', error);
        }
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handlePress}
        >
            <View style={styles.textContainer}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.email}>{email}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginVertical: 5,
        marginHorizontal: 10,
    },
    textContainer: {
        flex: 1,
    },
    name: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    },
    email: {
        color: 'gray',
        marginTop: 4,
        fontSize: 14,
    },
});

export default ItemChat;
