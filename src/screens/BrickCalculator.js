import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const BrickCalculator = () => {
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
