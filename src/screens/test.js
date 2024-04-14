import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'

const TestScreen = ({ navigation }) => {


  const handleStartPress = () => {
    navigation.navigate('Login'); // Chuyển hướng đến trang đăng nhập khi nhấn vào nút "Start"
  };


  return (
    <View style={styles.container}>
      <Image
        source={require('./screen1.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <Text style={styles.title}>BuilderApp</Text>
      <TouchableOpacity style={styles.button} onPress={()=>{handleStartPress();}}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
    paddingTop: 20,
    paddingRight: 45,
    paddingBottom: 20,
    paddingLeft: 45,    
    borderRadius: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute', 
}});

export default TestScreen;
