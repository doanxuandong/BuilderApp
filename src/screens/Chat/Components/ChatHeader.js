import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import UpName from '../../Comment/UpName';
import UpAv from '../../Comment/UpAv';

const ChatHeader = ({ userId, navigation }) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>
            <View style={styles.userInfo}>
                <UpAv cons={userId} />
                <UpName cons={userId} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
});

export default ChatHeader; 