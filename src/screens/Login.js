import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'

const Login = ({ navigation }) => {

  useEffect(() => {
  })


  const [email, setEmail] = useState('0855708546');
  const [password, setPassword] = useState('1');

  const handleLogin = async () => {
    // if (email === 'example@example.com' && password === 'password') {
    //   navigation.navigate('MainScreen');
    // } else {
    //   alert('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
    // }
    let listAcc = []
    let check = false;
    let idUser
    let doIt = await firestore()
      .collection('Users')
      .get()
      .then(dt => {
        dt.docs.map(item => {
          console.log(item._data, 1)
          if (item._data.phone === email) {
            if (item._data.pass === password) {
              check = true
              idUser = item._data.userId;
            }
          }
        })
        if (check === true) {
          Loging(idUser)
        }
        else {
          alert('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
        }
      })
    // console.log('Email:', email);
    // console.log('Password:', password);
  };

  const Loging = async idUser => {
    await AsyncStorage.setItem('USERID', idUser)
    navigation.navigate('HomeScreen');
  }

  const handleForgotPassword = () => {
    // Xử lý logic khi người dùng quên mật khẩu ở đây
    console.log('Quên mật khẩu');
  };

  const handleRegister = () => {
    // Xử lý logic khi người dùng nhấn vào đăng ký ở đây
    navigation.navigate('Register')
  };

  return (
    <View style={styles.container}>
      <Image source={require('./logo.png')} style={styles.logo} />
      <Text style={styles.title}>Đăng nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Email hoặc SĐT"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.linkText}>Quên mật khẩu?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.linkText}>Tạo tài khoản</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c65128',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    width: '80%',
    height: 40,
    backgroundColor: '#c65128',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 10,
  },
  linkText: {
    color: 'blue',
    fontSize: 15,
  },
});

export default Login;
