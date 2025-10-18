import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';

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
  today: '오늘',
};
LocaleConfig.defaultLocale = 'kr';

export default function AddMotivation({ navigation }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  return (
    <ScrollView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Smart Ledger</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* 제목 입력 */}
      <Text style={styles.label}>제목</Text>
      <TextInput
        style={styles.input}
        placeholder="예) 갤럭시 워치X"
        value={title}
        onChangeText={setTitle}
      />

      {/* 제한 기간 */}
      <Text style={styles.label}>🕒 제한 기간</Text>
      <View style={styles.dateRow}>
        <Text style={{ fontSize: 16 }}>{startDate || '시작일 선택'}</Text>
        <Text style={{ fontSize: 16 }}> ➝ </Text>
        <Text style={{ fontSize: 16 }}>{endDate || '종료일 선택'}</Text>
      </View>

      {/* 달력 */}
      <Calendar
        onDayPress={(day) => {
          if (!startDate) {
            setStartDate(day.dateString);
          } else if (startDate && !endDate) {
            setEndDate(day.dateString);
          } else {
            setStartDate(day.dateString);
            setEndDate('');
          }
        }}
        markedDates={{
          [startDate]: { selected: true, selectedColor: 'black' },
          [endDate]: { selected: true, selectedColor: 'gray' },
        }}
        theme={{
          todayTextColor: 'black',
        }}
        style={{ marginTop: 15 }}
      />

      {/* 가격 입력 */}
      <Text style={styles.label}>가격</Text>
      <TextInput
        style={styles.input}
        placeholder="예) 200,000"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      {/* 사진첨부 */}
      <Text style={styles.label}>사진첨부</Text>
      <View style={styles.photoRow}>
        <TouchableOpacity style={styles.photoButton}>
          <Text>내 Phone</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.photoButton}>
          <Text>카메라</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.photoBox} />

      {/* 하단 탭바 */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: 60,
          borderTopWidth: 1,
          borderTopColor: '#000',
          backgroundColor: '#fff',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <Pressable
          onPress={() => navigation.navigate('Home')}
          style={{ alignItems: 'center' }}
        >
          <Ionicons name="home" size={24} />
          <Text>홈</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('Motivation')}
          style={{ alignItems: 'center' }}
        >
          <Ionicons name="heart" size={24} />
          <Text>동기</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('History')}
          style={{ alignItems: 'center' }}
        >
          <Ionicons name="stats-chart" size={24} />
          <Text>내역</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('Assets')}
          style={{ alignItems: 'center' }}
        >
          <Ionicons name="logo-usd" size={24} />
          <Text>자산</Text>
        </Pressable>
      </View>
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
    paddingTop: 40, // 내 폰 기준으로 헤더 쪽 (SmartLedger 아이콘) 이 안보여서 padding으로 내림.
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  label: { fontSize: 16, fontWeight: '600', marginTop: 20 },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
    fontSize: 16,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  photoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  photoButton: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  photoBox: {
    width: '100%',
    height: 200,
    backgroundColor: '#eee',
    marginTop: 10,
    borderRadius: 10,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
  },
});
