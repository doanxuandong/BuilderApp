import React, { useEffect, useState } from 'react';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'
import { View, Image, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';

import { NavigationContainer, useNavigation } from '@react-navigation/native';

const RegisterScreen = ({ navigation }) => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const getAcc = async () => {
    let userId = uuid.v4();
    let t = await firestore()
      .collection('Users')
      .doc(userId)
      .set({
        name: firstName,
        phone: phoneNumber,
        email: email,
        userName: username,
        pass: password,
        userId: userId,
        sex: false,
        address: '',
        pic: ''
      })
  }

  const handleRegister = () => {
    let errors = {};
    let check = false
    if (!firstName.trim()) {
      errors.firstName = 'Vui lòng nhập Họ và Tên';
    }

    if (!phoneNumber.trim()) {
      errors.phoneNumber = 'Vui lòng nhập Số điện thoại';
    } else if (!/^(0\d{9})$/.test(phoneNumber)) {
      errors.phoneNumber = 'Số điện thoại không hợp lệ';
    }

    if (!email.trim()) {
      errors.email = 'Vui lòng nhập Email';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email không hợp lệ';
    }

    if (!username.trim()) {
      errors.username = 'Vui lòng nhập Tên đăng nhập';
    }

    if (!password.trim()) {
      errors.password = 'Vui lòng nhập Mật khẩu';
    }

    if (!confirmPassword.trim()) {
      errors.confirmPassword = 'Vui lòng xác nhận Mật khẩu';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Mật khẩu không khớp';
    }

    if (Object.keys(errors).length === 0) {
      getAcc();
      Alert.alert('Đăng ký thành công', 'Chuyển đến trang đăng nhập', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } else {
      setErrors(errors);
    }

  };

  return (
    <View style={styles.container}>
      <Image source={require('./logo.png')} style={styles.logo} />
      <Text style={styles.title}>Tạo tài khoản mới</Text>
      <TextInput
        style={styles.input}
        placeholder="Họ và Tên"
        value={firstName}
        onChangeText={text => setFirstName(text)}
      />
      {errors.firstName && <Text style={styles.error}>{errors.firstName}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={phoneNumber}
        onChangeText={text => setPhoneNumber(text)}
      />
      {errors.phoneNumber && <Text style={styles.error}>{errors.phoneNumber}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}
      {/* <TextInput
        style={styles.input}
        placeholder="Năm sinh"
        keyboardType="numeric"
        value={dateOfBirth}
        onChangeText={text => setDateOfBirth(text)}
      />
      {errors.dateOfBirth && <Text style={styles.error}>{errors.dateOfBirth}</Text>} */}
      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập"
        value={username}
        onChangeText={text => setUsername(text)}
      />
      {errors.username && <Text style={styles.error}>{errors.username}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={text => setPassword(text)}
      />
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu"
        secureTextEntry
        value={confirmPassword}
        onChangeText={text => setConfirmPassword(text)}
      />
      {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}
      <TouchableOpacity style={styles.button} onPress={() => handleRegister()}>
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Đã có tài khoản? Đăng nhập ngay</Text>
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
    width: 250,
    height: 250,
    marginBottom: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#c65128',
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
    marginBottom: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: 'blue',
    fontSize: 14,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
});

export default RegisterScreen;
