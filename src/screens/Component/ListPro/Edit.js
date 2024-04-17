import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image, FlatList, Button } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'

const Edit = () => {
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [size, setSize] = useState('');
  
    const handleSave = () => {
      // Thực hiện lưu thông tin sản phẩm vào cơ sở dữ liệu hoặc thực hiện các hành động khác tại đây
      // Ví dụ:
      console.log('Tên sản phẩm:', productName);
      console.log('Số lượng:', quantity);
      console.log('Giá sản phẩm:', price);
      console.log('Kích thước:', size);
    };
  
    const handleDelete = () => {
      // Thực hiện xóa sản phẩm khỏi cơ sở dữ liệu hoặc thực hiện các hành động khác tại đây
      // Ví dụ:
      console.log('Đã xóa sản phẩm');
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
          <TouchableOpacity style={{padding: 5,}} onPress={() => navigation.navigate('HomeScreen')} >
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
        
      <View style={{ margin: 20, padding: 10, borderWidth: 1, borderRadius: 15,}}>
        <Text style={{fontWeight:'bold', color:'black', paddingVertical: 5,}}>Tên sản phẩm:</Text>
        <TextInput style={{borderWidth: 1, borderRadius: 5,}}
          value={productName}
          onChangeText={setProductName}
          placeholder="Nhập tên sản phẩm"
        />
        <Text style={{fontWeight:'bold', color:'black', paddingVertical: 5,}} >Kích thước:</Text>
        <TextInput style={{borderWidth: 1, borderRadius: 5,}}
          value={size}
          onChangeText={setSize}
          placeholder="Nhập kích thước"
        />
        <Text style={{fontWeight:'bold', color:'black', paddingVertical: 5,}}>Số lượng:</Text>
        <TextInput style={{borderWidth: 1, borderRadius: 5,}}
          value={quantity}
          onChangeText={setQuantity}
          placeholder="Nhập số lượng"
          keyboardType="numeric"
        />
        <Text style={{fontWeight:'bold', color:'black', paddingVertical: 5,}} >Giá sản phẩm:</Text>
        <TextInput style={{borderWidth: 1, borderRadius: 5,}}
          value={price}
          onChangeText={setPrice}
          placeholder="Nhập giá sản phẩm"
          keyboardType="numeric"
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20,}}>
          <TouchableOpacity onPress={handleSave} style ={{ backgroundColor: '#c65128',
                                                            padding: 10,
                                                            paddingHorizontal: 20,
                                                            borderRadius: 5,
                                                            marginTop: 10,
                                                            alignSelf: 'center',}} >
            <Text style={{color: '#ffffff', fontSize: 16, fontWeight: 'bold', alignSelf: 'center',}}>Lưu</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style ={{ backgroundColor: '#c65128',
                                                            padding: 10,
                                                            paddingHorizontal: 20,
                                                            borderRadius: 5,
                                                            marginTop: 10,
                                                            alignSelf: 'center',}} >
            <Text style={{color: '#ffffff', fontSize: 16, fontWeight: 'bold', alignSelf: 'center',}}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>  
    );
  };

export default Edit;