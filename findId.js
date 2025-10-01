import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthService from './AuthService';

// 웹/앱 모두 지원하는 알림 함수
const showAlert = (title, message) => {
  if (Platform.OS === 'web') {
    alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

export default function FindId({ navigation }) {
  const [name, setName] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [birth, setBirth] = useState('');
  const [error, setError] = useState('');

  // 전화번호 자동 하이픈
  const formatPhoneNumber = (input) => {
    const numbers = input.replace(/\D/g, '');
    if (numbers.length < 4) return numbers;
    if (numbers.length < 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    if (numbers.length < 11)
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(
        6
      )}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
      7,
      11
    )}`;
  };

  // 생년월일 자동 슬래시
  const formatBirthDate = (input) => {
    const numbers = input.replace(/\D/g, '');
    if (numbers.length < 5) return numbers;
    if (numbers.length < 7) return `${numbers.slice(0, 4)}/${numbers.slice(4)}`;
    return `${numbers.slice(0, 4)}/${numbers.slice(4, 6)}/${numbers.slice(
      6,
      8
    )}`;
  };

  const handleTelChange = (text) => setPhoneNum(formatPhoneNumber(text));
  const handleBirthChange = (text) => setBirth(formatBirthDate(text));

  // 입력 검증
  const validateInputs = () => {
    if (!name.trim()) return '이름을 입력해주세요.';
    if (!phoneNum.match(/^\d{3}-\d{3,4}-\d{4}$/))
      return '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)';
    if (!birth.match(/^\d{4}\/\d{2}\/\d{2}$/))
      return '생년월일 형식이 올바르지 않습니다. (예: 1990/01/01)';
    return '';
  };

  const handleFindId = async () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      showAlert('알림', validationError);
      return;
    }

    try {
      setError('');
      const response = await AuthService.findId({
        name,
        phoneNum: phoneNum.replace(/-/g, ''), // 서버 요구사항: 숫자만
        birth: birth.replace(/\//g, ''), // 서버 요구사항: YYYYMMDD
      });

      if (response.success) {
        showAlert('아이디 찾기 결과', `가입된 이메일: ${response.email}`);
      } else {
        setError(response.message);
        showAlert('알림', response.message || '아이디를 찾을 수 없습니다.');
      }
    } catch (err) {
      console.error('Find ID Error:', err);
      setError('서버 요청 중 문제가 발생했습니다.');
      showAlert('오류', '서버 요청 중 문제가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </Pressable>
        <Text style={styles.headerTitle}>ID 찾기</Text>
      </View>

      <View style={styles.form}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Text style={styles.label}>이름</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="이름을 입력하세요."
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Tel</Text>
        <TextInput
          style={styles.input}
          value={phoneNum}
          onChangeText={handleTelChange}
          placeholder="전화번호를 입력하세요."
          placeholderTextColor="#aaa"
          keyboardType="phone-pad"
          maxLength={13}
        />

        <Text style={styles.label}>생년월일</Text>
        <TextInput
          style={styles.input}
          value={birth}
          onChangeText={handleBirthChange}
          placeholder="yyyy/mm/dd"
          placeholderTextColor="#aaa"
          maxLength={10}
        />
      </View>

      <Pressable style={styles.button} onPress={handleFindId}>
        <Text style={styles.buttonText}>ID 찾기</Text>
      </Pressable>

      <View style={styles.footer}>
        <Text style={styles.footerText}>이용약관</Text>
        <Text style={styles.footerText}>개인정보처리방침</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 8 },
  form: { flex: 1 },
  label: { fontWeight: 'bold', marginBottom: 6 },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    marginBottom: 24,
    paddingVertical: 6,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 'auto',
    gap: 20,
  },
  footerText: { color: '#000', fontSize: 13 },
  errorText: { color: 'red', marginBottom: 16, fontSize: 14 },
});
