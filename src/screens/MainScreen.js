import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image, FlatList, ScrollView, Dimensions, Alert } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import * as FileSystem from 'react-native-fs';
import Share from 'react-native-share';
import DateTimePicker from '@react-native-community/datetimepicker';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'
import Edit from './Component/ListPro/Edit';

// Component cho Material Item
const MaterialItem = React.memo(({ item, onPress, onStockIn, onStockOut }) => (
  <View style={styles.materialItem}>
    <TouchableOpacity
      style={styles.materialInfo}
      onPress={() => onPress(item)}
    >
      <Text style={styles.materialName}>{item.materialName}</Text>
      <Text style={styles.materialInfo}>Kích thước: {item.materialSize}</Text>
      <Text style={styles.materialInfo}>Số lượng: {item.materialQuantity}</Text>
      <Text style={styles.materialInfo}>Giá: {item.materialPrice}đ</Text>
    </TouchableOpacity>

    <View style={styles.materialActions}>
      <TouchableOpacity
        style={[styles.stockButton, styles.stockInButton]}
        onPress={() => onStockIn(item)}
      >
        <Icon name="plus" size={16} color="#fff" />
        <Text style={styles.stockButtonText}>Nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.stockButton, styles.stockOutButton]}
        onPress={() => onStockOut(item)}
      >
        <Icon name="minus" size={16} color="#fff" />
        <Text style={styles.stockButtonText}>Xuất</Text>
      </TouchableOpacity>
    </View>
  </View>
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showStatistics, setShowStatistics] = useState(false);
  const [statisticsData, setStatisticsData] = useState({
    totalValue: 0,
    totalItems: 0,
    categoryDistribution: [],
    priceDistribution: [],
    monthlyTrend: []
  });
  const [showWarehouse, setShowWarehouse] = useState(false);
  const [warehouseHistory, setWarehouseHistory] = useState([]);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAction, setStockAction] = useState(''); // 'in' or 'out'
  const [stockQuantity, setStockQuantity] = useState('');
  const [stockDate, setStockDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [lowStockThreshold, setLowStockThreshold] = useState(10); // Ngưỡng cảnh báo hết hàng

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
      onStockIn={(material) => {
        setSelectedMaterial(material);
        setStockAction('in');
        setShowStockModal(true);
      }}
      onStockOut={(material) => {
        setSelectedMaterial(material);
        setStockAction('out');
        setShowStockModal(true);
      }}
    />
  ), [handleEditMaterial]);

  const keyExtractor = useCallback(item => item.id, []);

  // Hàm lọc và sắp xếp vật liệu
  const filteredMaterials = useMemo(() => {
    let result = [...materialList];

    // Lọc theo tên
    if (searchQuery) {
      result = result.filter(item =>
        item.materialName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Lọc theo khoảng giá
    if (priceRange.min) {
      result = result.filter(item =>
        Number(item.materialPrice) >= Number(priceRange.min)
      );
    }
    if (priceRange.max) {
      result = result.filter(item =>
        Number(item.materialPrice) <= Number(priceRange.max)
      );
    }

    // Sắp xếp
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.materialName.localeCompare(b.materialName);
          break;
        case 'price':
          comparison = Number(a.materialPrice) - Number(b.materialPrice);
          break;
        case 'quantity':
          comparison = Number(a.materialQuantity) - Number(b.materialQuantity);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [materialList, searchQuery, priceRange, sortBy, sortOrder]);

  // Hàm tính toán thống kê
  const calculateStatistics = useCallback(() => {
    const totalValue = materialList.reduce((sum, item) =>
      sum + (Number(item.materialPrice) * Number(item.materialQuantity)), 0);

    const totalItems = materialList.reduce((sum, item) =>
      sum + Number(item.materialQuantity), 0);

    // Phân bố theo loại vật liệu (giả sử có trường category)
    const categoryDistribution = materialList.reduce((acc, item) => {
      const category = item.category || 'Khác';
      const existing = acc.find(c => c.name === category);
      if (existing) {
        existing.quantity += Number(item.materialQuantity);
      } else {
        acc.push({ name: category, quantity: Number(item.materialQuantity) });
      }
      return acc;
    }, []);

    // Phân bố giá
    const priceRanges = [
      { min: 0, max: 1000000, label: 'Dưới 1M' },
      { min: 1000000, max: 5000000, label: '1M-5M' },
      { min: 5000000, max: 10000000, label: '5M-10M' },
      { min: 10000000, max: Infinity, label: 'Trên 10M' }
    ];

    const priceDistribution = priceRanges.map(range => ({
      name: range.label,
      quantity: materialList.filter(item =>
        Number(item.materialPrice) >= range.min &&
        Number(item.materialPrice) < range.max
      ).length
    }));

    setStatisticsData({
      totalValue,
      totalItems,
      categoryDistribution,
      priceDistribution,
      monthlyTrend: [] // Có thể thêm dữ liệu xu hướng theo thời gian
    });
  }, [materialList]);

  useEffect(() => {
    calculateStatistics();
  }, [materialList]);

  // Hàm xuất báo cáo PDF
  const exportReport = async () => {
    try {
      const reportContent = `
        BÁO CÁO VẬT LIỆU
        ================
        
        Tổng giá trị: ${statisticsData.totalValue.toLocaleString()}đ
        Tổng số lượng: ${statisticsData.totalItems} items
        
        Phân bố theo loại:
        ${statisticsData.categoryDistribution.map(cat =>
        `- ${cat.name}: ${cat.quantity} items`
      ).join('\n')}
        
        Phân bố theo giá:
        ${statisticsData.priceDistribution.map(price =>
        `- ${price.name}: ${price.quantity} items`
      ).join('\n')}
      `;

      const filePath = `${FileSystem.CachesDirectoryPath}/report.txt`;
      await FileSystem.writeFile(filePath, reportContent, 'utf8');

      await Share.open({
        url: `file://${filePath}`,
        type: 'text/plain',
        title: 'Báo cáo vật liệu'
      });
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  // Hàm lấy lịch sử kho
  const fetchWarehouseHistory = useCallback(async () => {
    try {
      const snapshot = await firestore()
        .collection('WarehouseHistory')
        .orderBy('date', 'desc')
        .get();

      const history = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWarehouseHistory(history);
    } catch (error) {
      console.error('Error fetching warehouse history:', error);
    }
  }, []);

  useEffect(() => {
    fetchWarehouseHistory();
  }, []);

  // Hàm kiểm tra vật liệu sắp hết
  const checkLowStock = useCallback(() => {
    const lowStockItems = materialList.filter(
      item => Number(item.materialQuantity) <= lowStockThreshold
    );
    if (lowStockItems.length > 0) {
      Alert.alert(
        'Cảnh báo',
        `Có ${lowStockItems.length} vật liệu sắp hết hàng:\n${lowStockItems
          .map(item => `- ${item.materialName}: ${item.materialQuantity} items`)
          .join('\n')}`
      );
    }
  }, [materialList, lowStockThreshold]);

  // Hàm xử lý nhập/xuất kho
  const handleStockAction = async () => {
    try {
      if (!selectedMaterial || !stockQuantity || stockQuantity <= 0) {
        Alert.alert('Lỗi', 'Vui lòng nhập số lượng hợp lệ');
        return;
      }

      const quantity = Number(stockQuantity);
      const newQuantity = stockAction === 'in'
        ? Number(selectedMaterial.materialQuantity) + quantity
        : Number(selectedMaterial.materialQuantity) - quantity;

      if (newQuantity < 0) {
        Alert.alert('Lỗi', 'Số lượng xuất không được lớn hơn số lượng hiện có');
        return;
      }

      // Cập nhật số lượng vật liệu
      await firestore()
        .collection('Products')
        .doc(selectedMaterial.id)
        .update({
          materialQuantity: newQuantity.toString()
        });

      // Thêm vào lịch sử kho
      await firestore()
        .collection('WarehouseHistory')
        .add({
          materialId: selectedMaterial.id,
          materialName: selectedMaterial.materialName,
          action: stockAction,
          quantity: quantity,
          date: firestore.FieldValue.serverTimestamp(),
          previousQuantity: selectedMaterial.materialQuantity,
          newQuantity: newQuantity.toString()
        });

      // Refresh dữ liệu
      fetchMaterials();
      fetchWarehouseHistory();
      setShowStockModal(false);
      setStockQuantity('');
      checkLowStock();
    } catch (error) {
      console.error('Error handling stock action:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi xử lý nhập/xuất kho');
    }
  };

  // Component Filter Modal
  const FilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showFilters}
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.filterModalContent}>
          <Text style={styles.modalTitle}>Bộ lọc</Text>

          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Khoảng giá</Text>
            <View style={styles.priceInputContainer}>
              <TextInput
                style={styles.priceInput}
                placeholder="Giá tối thiểu"
                value={priceRange.min}
                onChangeText={(text) => setPriceRange(prev => ({ ...prev, min: text }))}
                keyboardType="numeric"
              />
              <Text style={styles.priceSeparator}>-</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="Giá tối đa"
                value={priceRange.max}
                onChangeText={(text) => setPriceRange(prev => ({ ...prev, max: text }))}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Sắp xếp theo</Text>
            <View style={styles.sortButtons}>
              <TouchableOpacity
                style={[styles.sortButton, sortBy === 'name' && styles.activeSortButton]}
                onPress={() => setSortBy('name')}
              >
                <Text style={styles.sortButtonText}>Tên</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortButton, sortBy === 'price' && styles.activeSortButton]}
                onPress={() => setSortBy('price')}
              >
                <Text style={styles.sortButtonText}>Giá</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortButton, sortBy === 'quantity' && styles.activeSortButton]}
                onPress={() => setSortBy('quantity')}
              >
                <Text style={styles.sortButtonText}>Số lượng</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Thứ tự</Text>
            <View style={styles.orderButtons}>
              <TouchableOpacity
                style={[styles.orderButton, sortOrder === 'asc' && styles.activeOrderButton]}
                onPress={() => setSortOrder('asc')}
              >
                <Icon2 name="arrow-upward" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.orderButton, sortOrder === 'desc' && styles.activeOrderButton]}
                onPress={() => setSortOrder('desc')}
              >
                <Icon2 name="arrow-downward" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.resetButton]}
              onPress={() => {
                setPriceRange({ min: '', max: '' });
                setSortBy('name');
                setSortOrder('asc');
              }}
            >
              <Text style={styles.buttonText}>Đặt lại</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.applyButton]}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.buttonText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Component Statistics Modal
  const StatisticsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showStatistics}
      onRequestClose={() => setShowStatistics(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.statisticsModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Thống kê và Báo cáo</Text>
            <TouchableOpacity onPress={() => setShowStatistics(false)}>
              <Icon name="times" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.statisticsContent}>
            {/* Tổng quan */}
            <View style={styles.statisticsSection}>
              <Text style={styles.sectionTitle}>Tổng quan</Text>
              <View style={styles.summaryContainer}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Tổng giá trị</Text>
                  <Text style={styles.summaryValue}>
                    {statisticsData.totalValue.toLocaleString()}đ
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Tổng số lượng</Text>
                  <Text style={styles.summaryValue}>
                    {statisticsData.totalItems} items
                  </Text>
                </View>
              </View>
            </View>

            {/* Biểu đồ phân bố loại vật liệu */}
            <View style={styles.statisticsSection}>
              <Text style={styles.sectionTitle}>Phân bố theo loại</Text>
              <PieChart
                data={statisticsData.categoryDistribution.map((item, index) => ({
                  name: item.name,
                  quantity: item.quantity,
                  color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                  legendFontColor: '#7F7F7F',
                  legendFontSize: 12
                }))}
                width={Dimensions.get('window').width - 60}
                height={220}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="quantity"
                backgroundColor="transparent"
                paddingLeft="15"
              />
            </View>

            {/* Biểu đồ phân bố giá */}
            <View style={styles.statisticsSection}>
              <Text style={styles.sectionTitle}>Phân bố theo giá</Text>
              <BarChart
                data={{
                  labels: statisticsData.priceDistribution.map(item => item.name),
                  datasets: [{
                    data: statisticsData.priceDistribution.map(item => item.quantity)
                  }]
                }}
                width={Dimensions.get('window').width - 60}
                height={220}
                yAxisLabel=""
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(144, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16
                  }
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}
              />
            </View>
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.exportButton]}
              onPress={exportReport}
            >
              <Text style={styles.buttonText}>Xuất báo cáo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Component Stock Modal
  const StockModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showStockModal}
      onRequestClose={() => setShowStockModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.stockModalContent}>
          <Text style={styles.modalTitle}>
            {stockAction === 'in' ? 'Nhập kho' : 'Xuất kho'}
          </Text>

          <View style={styles.stockInfo}>
            <Text style={styles.stockLabel}>Vật liệu:</Text>
            <Text style={styles.stockValue}>{selectedMaterial?.materialName}</Text>
          </View>

          <View style={styles.stockInfo}>
            <Text style={styles.stockLabel}>Số lượng hiện có:</Text>
            <Text style={styles.stockValue}>{selectedMaterial?.materialQuantity}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Số lượng {stockAction === 'in' ? 'nhập' : 'xuất'}:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={stockQuantity}
              onChangeText={setStockQuantity}
              placeholder="Nhập số lượng"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Ngày:</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{stockDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={stockDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setStockDate(selectedDate);
                }
              }}
            />
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowStockModal(false)}
            >
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleStockAction}
            >
              <Text style={styles.buttonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Component Warehouse History Modal
  const WarehouseHistoryModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showWarehouse}
      onRequestClose={() => setShowWarehouse(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.warehouseModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Lịch sử kho</Text>
            <TouchableOpacity onPress={() => setShowWarehouse(false)}>
              <Icon name="times" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={warehouseHistory}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.historyItem}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyMaterial}>{item.materialName}</Text>
                  <Text style={[
                    styles.historyAction,
                    { color: item.action === 'in' ? '#28a745' : '#dc3545' }
                  ]}>
                    {item.action === 'in' ? 'Nhập kho' : 'Xuất kho'}
                  </Text>
                </View>
                <Text style={styles.historyQuantity}>
                  Số lượng: {item.quantity} items
                </Text>
                <Text style={styles.historyDate}>
                  Ngày: {item.date?.toDate().toLocaleString()}
                </Text>
                <Text style={styles.historyQuantity}>
                  Từ {item.previousQuantity} → {item.newQuantity} items
                </Text>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('HomeScreen')}>
          <Icon name="arrow-left" size={30} color="#900" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
          <Text style={styles.headerTitle}>BuilderApp</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => setShowStatistics(true)}
        >
          <Icon name="bar-chart" size={30} color="#900" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => setShowWarehouse(true)}
        >
          <Icon name="history" size={30} color="#900" />
        </TouchableOpacity>
      </View>

      <View style={styles.materialList}>
        <View style={styles.materialListHeader}>
          <Text style={styles.materialListTitle}>Danh sách vật liệu</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilters(true)}
            >
              <Icon name="filter" size={20} color="#900" />
            </TouchableOpacity>
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
        </View>

        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm vật liệu..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Icon name="times-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>

        {filteredMaterials.length > 0 ? (
          <FlatList
            data={filteredMaterials}
            renderItem={renderMaterialItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không tìm thấy vật liệu</Text>
          </View>
        )}
      </View>

      <FilterModal />
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
      <StatisticsModal />
      <StockModal />
      <WarehouseHistoryModal />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  materialName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  materialInfo: {
    flex: 1,
  },
  materialActions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  stockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
    marginLeft: 5,
  },
  stockInButton: {
    backgroundColor: '#28a745',
  },
  stockOutButton: {
    backgroundColor: '#dc3545',
  },
  stockButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 14,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    padding: 10,
    marginRight: 10,
  },
  filterModalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 8,
    fontSize: 16,
  },
  priceSeparator: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  sortButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sortButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  activeSortButton: {
    backgroundColor: '#900',
  },
  sortButtonText: {
    color: '#333',
  },
  orderButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  orderButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeOrderButton: {
    backgroundColor: '#900',
  },
  resetButton: {
    backgroundColor: '#666',
  },
  applyButton: {
    backgroundColor: '#900',
  },
  statisticsModalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statisticsContent: {
    maxHeight: '80%',
  },
  statisticsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#900',
  },
  exportButton: {
    backgroundColor: '#900',
    marginTop: 20,
  },
  stockModalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  stockInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  stockLabel: {
    fontSize: 16,
    color: '#666',
  },
  stockValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  warehouseModalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '90%',
  },
  historyItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  historyMaterial: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyAction: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  historyQuantity: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  historyDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
});

export default MainScreen;
