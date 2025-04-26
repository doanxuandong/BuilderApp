import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image, FlatList } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'
import Edit from './Component/ListPro/Edit';

// Component cho Material Item
const MaterialItem = React.memo(({ item, onPress }) => (
  <TouchableOpacity
    style={styles.materialItem}
    onPress={() => onPress(item)}
  >
    <Text style={styles.materialName}>{item.materialName}</Text>
    <Text style={styles.materialInfo}>Kích thước: {item.materialSize}</Text>
    <Text style={styles.materialInfo}>Số lượng: {item.materialQuantity}</Text>
    <Text style={styles.materialInfo}>Giá: {item.materialPrice}đ</Text>
  </TouchableOpacity>
));

// Component cho Modal thêm/sửa vật liệu
const MaterialModal = React.memo(({
  visible,
  onClose,
  onSave,
  materialName,
  setMaterialName,
  materialSize,
  setMaterialSize,
  materialQuantity,
  setMaterialQuantity,
  materialPrice,
  setMaterialPrice,
  isEditing
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{isEditing ? 'Sửa thông tin vật liệu' : 'Thêm vật liệu mới'}</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Tên vật liệu:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên vật liệu"
            value={materialName}
            onChangeText={setMaterialName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Kích thước:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập kích thước"
            value={materialSize}
            onChangeText={setMaterialSize}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Số lượng:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số lượng"
            value={materialQuantity}
            onChangeText={setMaterialQuantity}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Giá tiền:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập giá tiền"
            value={materialPrice}
            onChangeText={setMaterialPrice}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.modalButtons}>
          <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onClose}>
            <Text style={styles.buttonText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={onSave}>
            <Text style={styles.buttonText}>{isEditing ? 'Lưu' : 'Thêm'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
));

const MainScreen = ({ navigation }) => {
  const [materialList, setMaterialList] = useState([]);
  const [materialName, setMaterialName] = useState('');
  const [materialSize, setMaterialSize] = useState('');
  const [materialQuantity, setMaterialQuantity] = useState('');
  const [materialPrice, setMaterialPrice] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem('USERID');
      const snapshot = await firestore()
        .collection('Products')
        .where('userId', '==', userId)
        .get();

      const materials = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMaterialList(materials);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  }, []);

  const handleAddMaterial = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem('USERID');
      const idPro = uuid.v4();

      if (isEditing && selectedMaterial) {
        await firestore()
          .collection('Products')
          .doc(selectedMaterial.id)
          .update({
            materialName,
            materialSize,
            materialQuantity,
            materialPrice,
          });
      } else {
        await firestore()
          .collection('Products')
          .doc(idPro)
          .set({
            proId: idPro,
            materialName,
            materialSize,
            materialQuantity,
            materialPrice,
            userId,
          });
      }

      // Reset form
      setMaterialName('');
      setMaterialSize('');
      setMaterialQuantity('');
      setMaterialPrice('');
      setModalVisible(false);
      setIsEditing(false);
      setSelectedMaterial(null);

      // Refresh list
      fetchMaterials();
    } catch (error) {
      console.error('Error saving material:', error);
    }
  }, [materialName, materialSize, materialQuantity, materialPrice, isEditing, selectedMaterial]);

  const handleEditMaterial = useCallback((material) => {
    setSelectedMaterial(material);
    setMaterialName(material.materialName);
    setMaterialSize(material.materialSize);
    setMaterialQuantity(material.materialQuantity);
    setMaterialPrice(material.materialPrice);
    setIsEditing(true);
    setModalVisible(true);
  }, []);

  const handleDeleteMaterial = useCallback(async (materialId) => {
    try {
      await firestore()
        .collection('Products')
        .doc(materialId)
        .delete();
      fetchMaterials();
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  }, []);

  const renderMaterialItem = useCallback(({ item }) => (
    <MaterialItem
      item={item}
      onPress={() => handleEditMaterial(item)}
    />
  ), [handleEditMaterial]);

  const keyExtractor = useCallback(item => item.id, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('HomeScreen')}>
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
        <View style={styles.materialListHeader}>
          <Text style={styles.materialListTitle}>Danh sách vật liệu</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setIsEditing(false);
              setModalVisible(true);
            }}
          >
            <Icon name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {materialList.length > 0 ? (
          <FlatList
            data={materialList}
            renderItem={renderMaterialItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Chưa có vật liệu</Text>
          </View>
        )}
      </View>

      <MaterialModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setIsEditing(false);
          setSelectedMaterial(null);
        }}
        onSave={handleAddMaterial}
        materialName={materialName}
        setMaterialName={setMaterialName}
        materialSize={materialSize}
        setMaterialSize={setMaterialSize}
        materialQuantity={materialQuantity}
        setMaterialQuantity={setMaterialQuantity}
        materialPrice={materialPrice}
        setMaterialPrice={setMaterialPrice}
        isEditing={isEditing}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerIcon: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  materialList: {
    flex: 1,
    padding: 15,
  },
  materialListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  materialListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#900',
    padding: 10,
    borderRadius: 5,
  },
  listContainer: {
    paddingBottom: 20,
  },
  materialItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  materialName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  materialInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  saveButton: {
    backgroundColor: '#900',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MainScreen;
