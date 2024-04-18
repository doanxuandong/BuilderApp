import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image, FlatList } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'
import Edit from './Component/ListPro/Edit';


const MainScreen = ({ navigation }) => {

  useEffect(() => {
    getProducts();
  }, [])

  const [materialName, setMaterialName] = useState('');
  const [materialSize, setMaterialSize] = useState('');
  const [materialQuantity, setMaterialQuantity] = useState('');
  const [materialPrice, setMaterialPrice] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [hasMaterials, setHasMaterials] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);



  const [materialList, setMaterialList] = useState([]);

  const openEditModal = () => {
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
  };
  const handleEditModalSave = () => {
    // Đóng modal sửa khi nhấn nút "Lưu"
    closeEditModal();
  };

  const handleAddModalSave = () => {
    // Đóng modal thêm vật liệu khi nhấn nút "Hoàn thành"
    setAddModalVisible(false);
  };
  const handleMaterialPress = (material) => {
    setSelectedMaterial(material);
    setInfoModalVisible(true);
  };

  const handleMaterialDelete = () => {
    // Xử lý logic xóa vật liệu
    const updatedMaterialList = materialList.filter(material => material !== selectedMaterial);
    setMaterialList(updatedMaterialList);
    setInfoModalVisible(false);
  };
  const handleEditMaterial = (material) => {
    setEditingMaterial(material); // Cập nhật vật liệu đang được chỉnh sửa trước
    setMaterialName(material.name);
    setMaterialSize(material.size);
    setMaterialQuantity(material.quantity);
    setMaterialPrice(material.price);
    openEditModal(); // Mở modal sửa
    setInfoModalVisible(false); // Đóng modal hiển thị thông tin
  };

  const getProducts = async () => {

    let userId = await AsyncStorage.getItem('USERID')
    setMaterialList()
    let temp
    let doit = await firestore()
      .collection('Products')
      .where('userId', '==', userId)
      .get()
      .then(dt => {
        temp = dt._docs
      })
    let tt = []
    await temp.map(item => {
      tt.push(item._data);
    })
    setMaterialList(tt);
  }

  const handleAddMaterial = async () => {
    userId = await AsyncStorage.getItem('USERID');
    let idPro = uuid.v4();
    if (editingMaterial) {
      // Xử lý logic cập nhật thông tin vật liệu
      console.log('Cập nhật thông tin vật liệu:', editingMaterial);
      // Reset các trường sau khi cập nhật
      setMaterialName('');
      setMaterialSize('');
      setMaterialQuantity('');
      setMaterialPrice('');
      setEditingMaterial(null); // Reset vật liệu đang được chỉnh sửa
      closeEditModal(); // Đóng modal sửa

    } else {
      // Xử lý logic thêm vật liệu vào hệ thống
      // console.log('Thêm vật liệu mới:');
      // console.log('Tên vật liệu:', materialName);
      // console.log('Kích thước:', materialSize);
      // console.log('Số lượng:', materialQuantity);
      // console.log('Giá tiền:', materialPrice);
      // Reset các trường sau khi thêm



      let doit = firestore()
        .collection('Products')
        .doc(idPro)
        .set({
          proId: idPro,
          materialName: materialName,
          materialSize: materialSize,
          materialQuantity: materialQuantity,
          materialPrice: materialPrice,
          userId: userId,
        })

      setMaterialName('');
      setMaterialSize('');
      setMaterialQuantity('');
      setMaterialPrice('');
      // Đóng cửa sổ modal sau khi hoàn thành
      setAddModalVisible(false);
      setHasMaterials(true);
      // setMaterialList([...materialList, { name: materialName, size: materialSize, quantity: materialQuantity, price: materialPrice }]);
    }
  };



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('HomeScreen')} >
          <Icon name="arrow-left" size={30} color="#900" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
          <Text style={styles.headerTitle}>BuilderApp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIcon}>
          <Icon name='gear' size={30} color="#900" />
        </TouchableOpacity>
      </View>
      <View style={styles.materialList}>
        <Text style={styles.materialListTitle}>Danh sách vật liệu</Text>
        {/* // Kiểm tra xem có vật liệu nào không */}

        {
          materialList != null ? <FlatList
            data={materialList}
            renderItem={({ item, index }) => {
              return (
                <>
                  <TouchableOpacity
                    key={index}
                    style={styles.materialItem}
                  onPress={() => navigation.navigate('Edit',{item})}
                  >
                    <Text>{item.materialName}</Text>
                    {/* Hiển thị các thông tin khác của vật liệu (kích thước, số lượng, giá tiền) tùy ý */}
                  </TouchableOpacity>
                </>
              )
            }}
          />
            : <>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Text
                  style={{
                  }}
                >
                  Chưa có vật liệu
                </Text>
              </View>
            </>
        }

      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={infoModalVisible}
        onRequestClose={() => {
          setInfoModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedMaterial?.name}</Text>
            <Text>Kích thước: {selectedMaterial?.size}</Text>
            <Text>Số lượng: {selectedMaterial?.quantity}</Text>
            <Text>Giá tiền: {selectedMaterial?.price}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEditMaterial(selectedMaterial)}>
                <Text style={styles.buttonText}>Sửa</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={handleMaterialDelete}>
                <Text style={styles.buttonText}>Xóa</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setInfoModalVisible(false)}>
                <Text style={styles.closeButtonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingMaterial ? 'Sửa thông tin vật liệu' : 'Thêm vật liệu mới'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Tên vật liệu"
              value={editingMaterial ? editingMaterial.name : materialName}
              onChangeText={text => setMaterialName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Kích thước"
              value={editingMaterial ? editingMaterial.size : materialSize}
              onChangeText={text => setMaterialSize(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Số lượng"
              value={editingMaterial ? editingMaterial.quantity : materialQuantity}
              onChangeText={text => setMaterialQuantity(text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Giá tiền"
              value={editingMaterial ? editingMaterial.price : materialPrice}
              onChangeText={text => setMaterialPrice(text)}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.addButton} onPress={handleEditModalSave}>
              <Text style={styles.buttonText}>{editingMaterial ? 'Lưu' : 'Hoàn thành'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => {
          setAddModalVisible(false);
          setEditingMaterial(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingMaterial ? 'Sửa thông tin vật liệu' : 'Thêm vật liệu mới'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Tên vật liệu"
              value={editingMaterial ? editingMaterial.name : materialName}
              onChangeText={text => setMaterialName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Kích thước"
              value={editingMaterial ? editingMaterial.size : materialSize}
              onChangeText={text => setMaterialSize(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Số lượng"
              value={editingMaterial ? editingMaterial.quantity : materialQuantity}
              onChangeText={text => setMaterialQuantity(text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Giá tiền"
              value={editingMaterial ? editingMaterial.price : materialPrice}
              onChangeText={text => setMaterialPrice(text)}
              keyboardType="numeric"
            />
            {/* Thêm phần upload ảnh */}
            <TouchableOpacity style={styles.addButton} onPress={() => {
              handleAddMaterial()
              getProducts()
            }}>
              <Text style={styles.buttonText}>{editingMaterial ? 'Lưu' : 'Hoàn thành'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)}>
        <Text style={styles.buttonText}>Thêm vật liệu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#c65128',
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerIcon: {
    padding: 5,
  },
  iconImage: {
    width: 30,
    height: 30,
  },
  materialList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  materialListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',

  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'black',
    borderWidth: 3,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    alignSelf: 'center',
  },
  addButton: {
    width: '80%',
    height: 40,
    backgroundColor: '#c65128',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
    alignSelf: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#c65128',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
  deleteButton: {
    backgroundColor: '#c65128',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  materialItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#c65128',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MainScreen;
