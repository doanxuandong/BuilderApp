import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image, FlatList, Button, Alert } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'

const ForgotPassword = ({navigation}) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    // Thực hiện gửi email để đặt lại mật khẩu tại đây
    Alert.alert('Đã gửi thông báo đặt lại mật khẩu tới Email:', email);
  };

  return (
    <View style={{
        flex: 1,
        backgroundColor: '#ffffff',
    }}>
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#c65128',
            padding: 10,
        }}>
          <TouchableOpacity style={{padding: 5,}} onPress={() => navigation.navigate('Login')} >
            <Icon name="arrow-left" size={30} color="#900" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
            <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#ffffff',}}>BuilderApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{padding: 5,}}>
            <Icon name='gear' size={30} color="#900" />
          </TouchableOpacity>
        </View>
        <View style={{margin: 20, padding: 10, borderWidth: 1, borderRadius: 15,marginTop: 100,}}>
            <Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center',}}>Quên mật khẩu</Text>
            <Text style={{fontSize: 16, marginBottom: 20, textAlign: 'center',}}>Vui lòng nhập địa chỉ email của bạn để đặt lại mật khẩu</Text>
            <TextInput
                style={{borderWidth: 1,
                    borderRadius: 5,
                    padding: 10,
                    marginBottom: 20,
                    width: '100%',}}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TouchableOpacity style={{backgroundColor: '#c65128', padding: 15, borderRadius: 5, width: '100%', alignItems: 'center',}} onPress={handleResetPassword}>
                <Text style={{color: '#ffffff', fontSize: 16, fontWeight: 'bold',}}>Gửi yêu cầu</Text>
            </TouchableOpacity>
        </View>
    </View>  
    );
}
export default ForgotPassword;
