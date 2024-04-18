import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image, FlatList, Button, ScrollView } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'

const Tabsatthep = ({navigation}) => {
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
        <View style={{borderWidth: 1, alignItems: 'center', justifyContent: 'center', padding: 10,margin: 10,}}>
            <Text style={{fontWeight: 'bold', color: 'black', fontSize: 20,}}>MẸO CHỌN SẮT THÉP</Text>
        </View>
        {/* <ScrollView style={{margin: 10, justifyContent: 'center', alignItems: 'center'}}> 
            <View style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>Kinh nghiệm chọn sắt thép xây nhà</Text>
                <Text style={{ fontSize: 16, marginTop: 10 }}>
                    Đây là nội dung kinh nghiệm chọn sắt thép. Bạn có thể nhập vào đây những gì bạn muốn chia sẻ về việc chọn sắt thép trong xây nhà.
                </Text>
                <Text style={{ fontSize: 16, marginTop: 10 }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dignissim fringilla sem, nec scelerisque velit feugiat sit amet. Sed commodo fringilla est vel cursus.
                </Text>
            </View>
        </ScrollView> */}
    </View>  
    );
  };

export default Tabsatthep;