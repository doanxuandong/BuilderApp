import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


const ProfileScreen = () => {
  const [profile, setProfile] = useState({
    hoTen: 'John Doe',
    soDienThoai: '0123456789',
    ngaySinh: '01/01/1990',
    gioiTinh: 'Nam',
    queQuan: 'Hà Nội',
    diaChi: '123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh'
  });

  const handleChange = (key, value) => {
    setProfile({ ...profile, [key]: value });
  };

  const handleSave = () => {
    // Xử lý lưu thông tin
    console.log('Thông tin đã được lưu:', profile);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Thông Tin Cá Nhân</Text>
      {Object.keys(profile).map((key, index) => (
        <View key={index} style={{ marginBottom: 10 }}>
          <TextInput
            style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 5, paddingRight: 30 }}
            value={profile[key]}
            onChangeText={text => handleChange(key, text)}
            placeholder={key}
          />
          {key === 'diaChi' ? ( // Chỉ hiển thị icon bút chì ở trường cuối cùng
            <TouchableOpacity style={{ position: 'absolute', right: 0, top: 10 }}>
              <FontAwesome name="pencil" size={20} color="grey" onPress={() => console.log('Edit address')} />
            </TouchableOpacity>
          ) : null}
        </View>
      ))}
      <TouchableOpacity
        style={{ backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginTop: 20 }}
        onPress={handleSave}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Lưu</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
