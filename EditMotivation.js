import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import * as ImagePicker from 'expo-image-picker';
import { useRoute } from '@react-navigation/native';

// ===== 공통 Alert =====
const showAlert = (title, message) => {
  if (Platform.OS === 'web') alert(`${title}\n\n${message}`);
  else Alert.alert(title, message);
};

// ===== 캘린더 한국어 =====
LocaleConfig.locales['kr'] = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
};
LocaleConfig.defaultLocale = 'kr';

export default function EditMotivation({ navigation }) {
  const { params } = useRoute();
  const goal = params?.goal;

  // ===== 초기값 세팅 =====
  const [imageUri, setImageUri] = useState(goal?.imageUrl || null);
  const [title, setTitle] = useState(goal?.title || '');
  const [price, setPrice] = useState(String(goal?.targetAmount || ''));
  const [startDate, setStartDate] = useState(goal?.startDate || ''); // 서버 없으므로 비워둠
  const [endDate, setEndDate] = useState(goal?.deadline || '');

  // ===== 이미지 선택 =====
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return showAlert('권한 필요', '사진 접근 권한을 허용해주세요.');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // ===== 날짜 선택 =====
  const handleDayPress = (day) => {
    const selected = day.dateString;

    if (!startDate || (startDate && endDate)) {
      setStartDate(selected);
      setEndDate('');
      return;
    }

    if (!endDate) {
      if (selected === startDate) {
        setStartDate('');
        return;
      }

      if (selected < startDate) {
        setStartDate(selected);
        return;
      }

      setEndDate(selected);
    }
  };

  // ===== 완료 버튼 =====
  const handleSubmit = () => {
    showAlert('알림', 'API 연결되면 수정사항을 저장할게!');
  };

  return (
    <ScrollView style={styles.container}>
      {/* ===== 상단 헤더 ===== */}
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#BFBFBF" />
        </Pressable>

        <View style={styles.topRight}>
          <Pressable style={styles.editBtn}>
            <Text style={styles.editText}>편집</Text>
          </Pressable>
          <Pressable style={styles.deleteBtn}>
            <Text style={styles.deleteText}>삭제</Text>
          </Pressable>
        </View>
      </View>

      {/* ===== 이미지 영역 ===== */}
      <View style={styles.imageWrap}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <View style={[styles.imagePreview, { backgroundColor: '#173033' }]} />
        )}

        <TouchableOpacity style={styles.imageChangeBtn} onPress={pickImage}>
          <Text style={styles.imageChangeText}>사진 수정하기</Text>
        </TouchableOpacity>
      </View>

      {/* 구분선 */}
      <View style={styles.sectionDivider} />

      {/* ===== 이름 ===== */}
      <Text style={styles.label}>이름</Text>
      <TextInput
        style={styles.input}
        placeholder="수정할 이름을 입력하세요"
        placeholderTextColor="#607072"
        value={title}
        onChangeText={setTitle}
      />

      {/* ===== 가격 ===== */}
      <Text style={styles.label}>가격</Text>
      <TextInput
        style={styles.input}
        placeholder="수정할 가격을 입력하세요"
        placeholderTextColor="#607072"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      {/* ===== 기간 ===== */}
      <View style={styles.dateRow}>
        <Ionicons name="time-outline" size={20} color="#BFBFBF" />
        <Text style={styles.dateLabel}>제한 기간</Text>
      </View>

      <View style={styles.dateSelectRow}>
        <Text style={styles.dateText}>{startDate || '2025.xx.xx'}</Text>
        <Text style={styles.dateArrow}>→</Text>
        <Text style={styles.dateText}>{endDate || '2025.xx.xx'}</Text>
      </View>

      {/* ===== 캘린더 ===== */}
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          ...(startDate && {
            [startDate]: { selected: true, selectedColor: '#3C7363' },
          }),
          ...(endDate && {
            [endDate]: { selected: true, selectedColor: '#6DC2B3' },
          }),
        }}
        theme={{
          backgroundColor: '#001A1D',
          calendarBackground: '#001A1D',
          dayTextColor: '#BFBFBF',
          monthTextColor: '#BFBFBF',
          arrowColor: '#6DC2B3',
          todayTextColor: '#6DC2B3',
        }}
        style={styles.calendar}
      />

      {/* ===== 완료 버튼 ===== */}
      <TouchableOpacity style={styles.finishButton} onPress={handleSubmit}>
        <Text style={styles.finishButtonText}>완료</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ========= 스타일 ========= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001A1D',
    paddingHorizontal: 18,
  },

  /* ===== Top bar ===== */
  topBar: {
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  editBtn: {},
  editText: {
    color: '#BFBFBF',
    fontSize: 15,
  },
  deleteBtn: {},
  deleteText: {
    color: '#FF5C5C',
    fontSize: 15,
  },

  /* ===== 이미지 ===== */
  imageWrap: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  imagePreview: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  imageChangeBtn: {
    position: 'absolute',
    bottom: 14,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  imageChangeText: {
    color: '#fff',
    fontSize: 14,
  },

  sectionDivider: {
    height: 1,
    backgroundColor: '#173033',
    marginVertical: 26,
  },

  /* ===== 기본 입력 ===== */
  label: {
    color: '#BFBFBF',
    fontSize: 15,
    marginBottom: 6,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#2F4C4C',
    paddingVertical: 10,
    fontSize: 15,
    color: '#fff',
    marginBottom: 20,
  },

  /* ===== 날짜 ===== */
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  dateLabel: {
    marginLeft: 10,
    color: '#BFBFBF',
    fontSize: 15,
  },
  dateSelectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  dateText: {
    color: '#BFBFBF',
    fontSize: 16,
  },
  dateArrow: {
    marginHorizontal: 18,
    color: '#BFBFBF',
    fontSize: 16,
  },

  calendar: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 30,
  },

  finishButton: {
    backgroundColor: '#173033',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  finishButtonText: {
    color: '#BFBFBF',
    fontSize: 16,
    fontWeight: '600',
  },
});
