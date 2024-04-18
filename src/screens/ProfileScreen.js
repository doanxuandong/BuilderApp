import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, CheckBox } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'

let userId = ''
const ProfileScreen = ({ navigation }) => {
  useEffect(() => {
    getUser()
  }, [])

  const getUser = async () => {
    userId = await AsyncStorage.getItem('USERID')
    
  }
console.log(userId)
  const handleSave = () => {
    // Xử lý lưu thông tin
    Alert.alert('Đã lưu thay đổi!')
    //console.log('Thông tin đã được lưu:', profile);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Thông Tin Cá Nhân</Text>
        <TouchableOpacity onPress={() => console.log('Edit name')} style={{ marginBottom: 20 }}>
          <Icon name="pencil" size={20} color="grey" />
        </TouchableOpacity>
      </View>
      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontWeight: 'bold', color: 'black', paddingVertical: 5, }}>Họ và Tên:</Text>
        <TextInput style={{ borderWidth: 1, borderRadius: 5, }}
          placeholder="Họ và Tên"
        />
        <Text style={{ fontWeight: 'bold', color: 'black', paddingVertical: 5, }} >Tên đăng nhập:</Text>
        <TextInput style={{ borderWidth: 1, borderRadius: 5, }}
          placeholder="Tên đăng nhập"
        />
        <Text style={{ fontWeight: 'bold', color: 'black', paddingVertical: 5, }} >Giới tính:</Text>
        <TextInput style={{ borderWidth: 1, borderRadius: 5, }}
          placeholder="Giới tính"
        />
        <Text style={{ fontWeight: 'bold', color: 'black', paddingVertical: 5, }}>Ngày sinh:</Text>
        <TextInput style={{ borderWidth: 1, borderRadius: 5, }}
          placeholder="Ngày sinh"
        />
        <Text style={{ fontWeight: 'bold', color: 'black', paddingVertical: 5, }}>Địa chỉ hiện tại:</Text>
        <TextInput style={{ borderWidth: 1, borderRadius: 5, }}
          placeholder="Địa chỉ hiện tại"
        />
      </View>
      <TouchableOpacity
        style={{ backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginTop: 20 }}
        onPress={handleSave}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Lưu</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginTop: 20 }}
        onPress={() => navigation.navigate('UserScreen')}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Quay lại trang trước</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
