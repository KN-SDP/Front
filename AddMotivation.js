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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import * as ImagePicker from 'expo-image-picker';
import AuthService from './AuthService';

const showAlert = (title, message) => {
  if (Platform.OS === 'web') alert(`${title}\n\n${message}`);
  else Alert.alert(title, message);
};

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

export default function AddMotivation({ navigation }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [imageUri, setImageUri] = useState(null); // 사진 담을 곳
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    title.trim() !== '' &&
    price.trim() !== '' &&
    Number(price) > 0 &&
    startDate &&
    endDate;

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

  // 미리보기/이미지 선택은 API 받으면 연결됨
  const handleImageSelect = () => {
    Alert.alert('추가 예정', '사진 업로드 API 받으면 연결할게!');
  };

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;

    setSubmitting(true);

    const payload = {
      title,
      imageUrl: imageUri,
      targetAmount: Number(price),
      deadline: endDate,
    };

    try {
      const res = await AuthService.createGoal(payload);

      if (res.success) {
        showAlert('완료', '목표가 저장되었습니다!');
        navigation.navigate('Motivation');
      } else {
        showAlert('오류', res.message || '문제가 발생했습니다.');
      }
    } catch (err) {
      showAlert('오류', '문제가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };
  const handleDayPress = (day) => {
    const selected = day.dateString; // 'YYYY-MM-DD'

    // 1) 시작/종료 둘 다 비어있거나, 둘 다 이미 선택된 상태 → 새로 시작 날짜만 지정
    if (!startDate || (startDate && endDate)) {
      setStartDate(selected);
      setEndDate('');
      return;
    }

    // 2) 시작만 있는 상태
    if (!endDate) {
      // 같은 날짜 다시 누르면 시작 해제
      if (selected === startDate) {
        setStartDate('');
        return;
      }

      // 선택한 날짜가 시작보다 이전이면 시작만 바꾸기
      if (selected < startDate) {
        setStartDate(selected);
        return;
      }

      // 선택한 날짜가 시작보다 이후면 종료로 설정
      setEndDate(selected);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#BFBFBF" />
        </Pressable>
      </View>

      {/* 사진 추가 영역 */}
      <View style={styles.imageArea}>
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.imageButtonText}>사진 추가하기</Text>
        </TouchableOpacity>

        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        )}
      </View>

      {/* 입력 폼 구분선 */}
      <View style={styles.sectionDivider} />

      {/* 이름 */}
      <Text style={styles.label}>이름</Text>
      <TextInput
        style={styles.input}
        placeholder="이름을 입력하세요"
        placeholderTextColor="#607072"
        value={title}
        onChangeText={setTitle}
      />

      {/* 가격 */}
      <Text style={styles.label}>가격</Text>
      <TextInput
        style={styles.input}
        placeholder="가격을 입력하세요"
        placeholderTextColor="#607072"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      {/* 기간 */}
      <View style={styles.dateRow}>
        <Ionicons name="time-outline" size={20} color="#BFBFBF" />
        <Text style={styles.dateLabel}>제한 기간</Text>
      </View>

      <View style={styles.dateSelectRow}>
        <Text style={styles.dateText}>{startDate || '2025.xx.xx'}</Text>
        <Text style={styles.dateArrow}>→</Text>
        <Text style={styles.dateText}>{endDate || '2025.xx.xx'}</Text>
      </View>

      {/* 캘린더 */}
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          ...(startDate && {
            [startDate]: {
              selected: true,
              selectedColor: '#3C7363',
            },
          }),
          ...(endDate && {
            [endDate]: {
              selected: true,
              selectedColor: '#6DC2B3',
            },
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

      {/* 완료 버튼 */}
      <Pressable
        onPress={handleSubmit}
        disabled={!canSubmit || submitting}
        style={[
          styles.submitBtn,
          { opacity: !canSubmit || submitting ? 0.5 : 1 },
        ]}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>완료</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#022326',
    paddingHorizontal: 18,
  },

  header: {
    paddingVertical: 20,
  },

  // 사진 추가 영역
  imageArea: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  imageButton: {
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#6DC2B3',
  },
  imageButtonText: {
    color: '#BFBFBF',
    fontSize: 15,
  },
  previewImage: {
    marginTop: 20,
    width: 220,
    height: 220,
    borderRadius: 14,
  },

  sectionDivider: {
    height: 1,
    backgroundColor: '#173033',
    marginVertical: 26,
  },

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

  // 기간 선택
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
  submitBtn: {
    backgroundColor: '#035951',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 40,
  },

  submitText: {
    color: '#BFBFBF',
    fontSize: 16,
    fontWeight: '600',
  },
});
