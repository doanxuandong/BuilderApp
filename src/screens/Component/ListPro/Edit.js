import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image, FlatList, Button } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'

const Edit = ({ navigation, route }) => {
  let { materialName, materialPrice, materialQuantity, materialSize, proId } = route.params.item
  console.log(route)


  const [productName, setProductName] = useState(materialName);
  const [quantity, setQuantity] = useState(materialQuantity);
  const [price, setPrice] = useState(materialPrice);
  const [size, setSize] = useState(materialSize);


  const handleSave = async () => {
    // Thực hiện lưu thông tin sản phẩm vào cơ sở dữ liệu hoặc thực hiện các hành động khác tại đây
    // Ví dụ:
    let doIt = await firestore()
      .collection('Products')
      .doc(proId)
      .update({
        materialName: productName,
        materialPrice: price,
        materialQuantity: quantity,
        materialSize: size,

      }).then()
    navigation.navigate('MainScreen')
  };

  const handleDelete = async () => {
    // Thực hiện xóa sản phẩm khỏi cơ sở dữ liệu hoặc thực hiện các hành động khác tại đây
    // Ví dụ:
    let doIt = await firestore()
      .collection('Products')
      .doc(proId)
      .delete()
    navigation.navigate('MainScreen')

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
        <TouchableOpacity style={{ padding: 5, }} onPress={() => navigation.navigate('HomeScreen')} >
          <Icon name="arrow-left" size={30} color="#900" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MainScreen')}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#ffffff',
          }}>BuilderApp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 5, }}>
          <Icon name='gear' size={30} color="#900" />
        </TouchableOpacity>
      </View>

      <View style={{ margin: 20, padding: 10, borderWidth: 1, borderRadius: 15, }}>
        <Text style={{ fontWeight: 'bold', color: 'black', paddingVertical: 5, }}>Tên sản phẩm:</Text>
        <TextInput style={{ borderWidth: 1, borderRadius: 5, }}
          value={productName}
          onChangeText={(txt) => { setProductName(txt) }}
          placeholder="Nhập tên sản phẩm"
        />
        <Text style={{ fontWeight: 'bold', color: 'black', paddingVertical: 5, }} >Kích thước:</Text>
        <TextInput style={{ borderWidth: 1, borderRadius: 5, }}
          value={size}
          onChangeText={(txt) => { setSize(txt) }}
          placeholder="Nhập kích thước"
        />
        <Text style={{ fontWeight: 'bold', color: 'black', paddingVertical: 5, }}>Số lượng:</Text>
        <TextInput style={{ borderWidth: 1, borderRadius: 5, }}
          value={quantity}
          onChangeText={(txt) => { setQuantity(txt) }}
          placeholder="Nhập số lượng"
          keyboardType="numeric"
        />
        <Text style={{ fontWeight: 'bold', color: 'black', paddingVertical: 5, }} >Giá sản phẩm:</Text>
        <TextInput style={{ borderWidth: 1, borderRadius: 5, }}
          value={price}
          onChangeText={(txt) => setPrice(txt)}
          placeholder="Nhập giá sản phẩm"
          keyboardType="numeric"
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, }}>
          <TouchableOpacity onPress={() => handleSave()} style={{
            backgroundColor: '#c65128',
            padding: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            marginTop: 10,
            alignSelf: 'center',
          }} >
            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold', alignSelf: 'center', }}>Lưu</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            handleDelete()
          }} style={{
            backgroundColor: '#c65128',
            padding: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            marginTop: 10,
            alignSelf: 'center',
          }} >
            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold', alignSelf: 'center', }}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Edit;