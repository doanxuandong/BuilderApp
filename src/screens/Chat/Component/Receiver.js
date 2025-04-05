import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Receiver = ({ text }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-start',
        backgroundColor: '#e5e5ea',
        borderRadius: 10,
        padding: 10,
        marginVertical: 4,
        maxWidth: '70%',
    },
    text: {
        color: '#000',
        fontSize: 16,
    },
});

export default Receiver;
