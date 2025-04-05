import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Sender = ({ text }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-end',
        backgroundColor: '#0084ff',
        borderRadius: 10,
        padding: 10,
        marginVertical: 4,
        maxWidth: '70%',
    },
    text: {
        color: 'white',
        fontSize: 16,
    },
});

export default Sender;
