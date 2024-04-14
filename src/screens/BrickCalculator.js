import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

const BrickCalculator = ({navigation}) => {
  const [surfaceArea, setSurfaceArea] = useState('');
  const [brickSize, setBrickSize] = useState('');
  const [brickNeeded, setBrickNeeded] = useState(0);

  const calculateBricks = () => {
    if (surfaceArea && brickSize) {
      const bricks = Math.ceil(surfaceArea / brickSize);
      setBrickNeeded(bricks);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('BookScreen')} >
            <Icon name="arrow-left" size={30} color="#900" />
        </TouchableOpacity> 
        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
          <Text style={styles.headerTitle}>BuilderApp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIcon}>
            <Icon name='gear' size={30} color="#900" />
        </TouchableOpacity> 
      </View>
      <View style={styles.mainview}>
        <Text style={styles.label}>Nhập diện tích bề mặt cần xây (m²):</Text>
        <TextInput
          style={styles.input}
          value={surfaceArea}
          onChangeText={text => setSurfaceArea(text)}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Nhập kích thước viên gạch men (m²/viên):</Text>
        <TextInput
          style={styles.input}
          value={brickSize}
          onChangeText={text => setBrickSize(text)}
          keyboardType="numeric"
        />
        <Button title="Tính số lượng gạch cần" onPress={calculateBricks} />
        <Text style={styles.result}>Số lượng gạch cần: {brickNeeded}</Text>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#c65128',
    padding: 10,
  },
  mainview: {
    paddingTop: 200,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerIcon: {
    padding: 5,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  result: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default BrickCalculator;
