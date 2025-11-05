import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import AuthService from './AuthService';

// ✅ 날짜 한국어 설정
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
    '수요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'kr';

export default function AddMotivation({ navigation }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) return Alert.alert('알림', '제목을 입력해주세요.');
    if (!price.trim() || Number(price) <= 0)
      return Alert.alert('알림', '금액을 올바르게 입력해주세요.');
    if (!endDate) return Alert.alert('알림', '마감 날짜를 선택해주세요.');

    const payload = {
      title: title.trim(),
      imageUrl: null, // 아직 이미지 업로드 없으므로 null
      targetAmount: Number(price),
      deadline: endDate,
    };

    const res = await AuthService.createGoal(payload);

    if (res.success) {
      Alert.alert('완료', '목표가 등록되었습니다.');
      navigation.navigate('Motivation');
    } else {
      Alert.alert('오류', res.message || '문제가 발생했습니다.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>새 목표 만들기</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* 제목 */}
      <Text style={styles.label}>제목</Text>
      <TextInput
        style={styles.input}
        placeholder="예) 닌텐도 스위치"
        value={title}
        onChangeText={setTitle}
      />

      {/* 날짜 */}
      <Text style={styles.label}>목표 날짜 선택</Text>
      <Text style={{ fontSize: 16 }}>{endDate || '날짜를 선택하세요'}</Text>

      <Calendar
        onDayPress={(day) => {
          setEndDate(day.dateString);
        }}
        markedDates={{
          [endDate]: { selected: true, selectedColor: 'black' },
        }}
        theme={{ todayTextColor: 'black' }}
        style={{ marginTop: 15 }}
      />

      {/* 금액 */}
      <Text style={styles.label}>목표 금액</Text>
      <TextInput
        style={styles.input}
        placeholder="예) 400000"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      {/* 저장 버튼 */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.saveButtonText}>저장하기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop: 40,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  label: { fontSize: 16, fontWeight: '600', marginTop: 20 },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
    fontSize: 16,
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
