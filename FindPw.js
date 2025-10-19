// FindPw.js
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

// 공통 알림
const showAlert = (title, message) => {
  if (Platform.OS === 'web') {
    alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

// 숫자만 남기기
const onlyDigits = (s = '') => s.replace(/\D/g, '');

// 전화번호 자동 하이픈
const formatPhoneNumber = (input) => {
  const numbers = onlyDigits(input);
  if (numbers.length < 4) return numbers;
  if (numbers.length < 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  if (numbers.length < 11) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  }
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
    7,
    11
  )}`;
};

// 생년월일 자동 하이픈(YYYY-MM-DD)
const formatBirthDate = (input) => {
  const numbers = onlyDigits(input);
  if (numbers.length < 5) return numbers;
  if (numbers.length < 7) return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
  return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`;
};

// YYYYMMDD 유효성 검사
const isValidYMD = (yyyymmdd) => {
  if (!/^\d{8}$/.test(yyyymmdd)) return false;
  const y = +yyyymmdd.slice(0, 4);
  const m = +yyyymmdd.slice(4, 6);
  const d = +yyyymmdd.slice(6, 8);
  const dt = new Date(y, m - 1, d);
  return (
    dt.getFullYear() === y && dt.getMonth() + 1 === m && dt.getDate() === d
  );
};

export default function FindPw({ navigation }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [birth, setBirth] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleTelChange = (text) => setPhoneNum(formatPhoneNumber(text));
  const handleBirthChange = (text) => setBirth(formatBirthDate(text));

  const validateInputs = () => {
    if (!email.trim()) return '이메일(ID)을 입력해주세요.';
    if (!/\S+@\S+\.\S+/.test(email))
      return '유효한 이메일 주소를 입력해주세요.';
    if (!name.trim()) return '이름을 입력해주세요.';
    if (!/^\d{3}-\d{3,4}-\d{4}$/.test(phoneNum))
      return '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birth))
      return '생년월일 형식이 올바르지 않습니다. (예: 1990-01-01)';
    const ymd = onlyDigits(birth);
    if (!isValidYMD(ymd)) return '유효한 생년월일이 아닙니다.';
    return '';
  };

  const handleFindPw = async () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      showAlert('알림', validationError);
      return;
    }

    try {
      if (submitting) return;
      setSubmitting(true);
      setError('');

      const payload = {
        email: email.trim(),
        name: name.trim(),
        phoneNum: onlyDigits(phoneNum),
        birth: birth,
      };

      const response = await AuthService.findPw(payload);

      if (response.success) {
        showAlert('비밀번호 재설정 안내', response.message);
        navigation.navigate('ResetPw');
      } else {
        setError(response.message);
        showAlert('알림', response.message);
      }
    } catch (err) {
      console.error('Find PW Error:', err);
      const msg = '서버 요청 중 문제가 발생했습니다.';
      setError(msg);
      showAlert('오류', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation?.goBack?.()}
          hitSlop={8}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={28} color="black" />
        </Pressable>
        <Text style={styles.headerTitle}>PW 찾기</Text>
      </View>

      {/* 폼 */}
      <View style={styles.form}>
        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <Text style={styles.label}>ID</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="예) kangnam@naver.com"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
        />

        <Text style={styles.label}>이름</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="이름을 입력하세요."
          placeholderTextColor="#aaa"
          autoCapitalize="words"
          textContentType="name"
        />

        <Text style={styles.label}>Tel</Text>
        <TextInput
          style={styles.input}
          value={phoneNum}
          onChangeText={handleTelChange}
          placeholder="전화번호를 입력하세요."
          placeholderTextColor="#aaa"
          keyboardType={Platform.OS === 'web' ? 'default' : 'number-pad'}
          inputMode="numeric"
          maxLength={13}
        />

        <Text style={styles.label}>생년월일</Text>
        <TextInput
          style={styles.input}
          value={birth}
          onChangeText={handleBirthChange}
          placeholder="yyyy-mm-dd"
          placeholderTextColor="#aaa"
          keyboardType={Platform.OS === 'web' ? 'default' : 'number-pad'}
          inputMode="numeric"
          maxLength={10}
        />
      </View>

      {/* 버튼 */}
      <Pressable
        style={[styles.button, submitting && { opacity: 0.6 }]}
        onPress={handleFindPw}
        disabled={submitting}
      >
        <Text style={styles.buttonText}>
          {submitting ? '전송 중...' : '비밀번호 재설정'}
        </Text>
      </Pressable>

      {/* 푸터 */}
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
  backBtn: { padding: 4 },
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
