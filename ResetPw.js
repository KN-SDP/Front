// ResetPw.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthService from './AuthService';

// 공통 알림
const showAlert = (title, message) => {
  if (Platform.OS === 'web') alert(`${title}\n\n${message}`);
  else Alert.alert(title, message);
};

export default function ResetPw({ navigation }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(''); // 인증번호 (있다면)
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // 비밀번호 유효성 검사
  const validatePassword = (pw) => {
    if (pw.length < 8) return '비밀번호는 8자 이상이어야 합니다.';
    if (!/[0-9]/.test(pw) || !/[a-zA-Z]/.test(pw))
      return '영문과 숫자를 모두 포함해야 합니다.';
    return '';
  };

  const handleResetPw = async () => {
    if (!email.trim()) return showAlert('알림', '이메일을 입력해주세요.');
    if (!newPw.trim()) return showAlert('알림', '새 비밀번호를 입력해주세요.');
    if (!confirmPw.trim())
      return showAlert('알림', '비밀번호 확인을 입력해주세요.');
    if (newPw !== confirmPw)
      return showAlert('알림', '비밀번호가 일치하지 않습니다.');

    const pwError = validatePassword(newPw);
    if (pwError) return showAlert('알림', pwError);

    try {
      if (submitting) return;
      setSubmitting(true);
      setError('');

      const payload = {
        email: email.trim(),
        newPassword: newPw,
        checkedPassword: confirmPw, // ✅ 백엔드 명세에 맞게 key 수정
      };

      const res = await AuthService.resetPw(payload);

      if (res.success) {
        showAlert('완료', res.message);
        navigation.replace('Login');
      } else {
        showAlert('알림', res.message);
      }
    } catch (err) {
      console.error('ResetPw Error:', err);
      showAlert('오류', '서버 요청 중 문제가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </Pressable>
        <Text style={styles.headerTitle}>비밀번호 재설정</Text>
      </View>

      {/* 입력 폼 */}
      <View style={styles.form}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="가입한 이메일을 입력하세요."
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* <Text style={styles.label}>인증번호</Text>
        <TextInput
          style={styles.input}
          value={code}
          onChangeText={setCode}
          placeholder="이메일로 받은 인증번호 (있을 경우)"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
        /> */}

        <Text style={styles.label}>새 비밀번호</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputField}
            value={newPw}
            onChangeText={setNewPw}
            placeholder="새 비밀번호를 입력하세요."
            placeholderTextColor="#aaa"
            secureTextEntry={!showNewPw}
            autoCapitalize="none"
          />
          <Pressable onPress={() => setShowNewPw(!showNewPw)}>
            <Ionicons
              name={showNewPw ? 'eye' : 'eye-off'}
              size={22}
              color="#444"
            />
          </Pressable>
        </View>

        <Text style={styles.label}>비밀번호 확인</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputField}
            value={confirmPw}
            onChangeText={setConfirmPw}
            placeholder="비밀번호를 다시 입력하세요."
            placeholderTextColor="#aaa"
            secureTextEntry={!showConfirmPw}
            autoCapitalize="none"
          />
          <Pressable onPress={() => setShowConfirmPw(!showConfirmPw)}>
            <Ionicons
              name={showConfirmPw ? 'eye' : 'eye-off'}
              size={22}
              color="#444"
            />
          </Pressable>
        </View>
      </View>

      {/* 버튼 */}
      <Pressable
        style={[styles.button, submitting && { opacity: 0.6 }]}
        onPress={handleResetPw}
        disabled={submitting}
      >
        <Text style={styles.buttonText}>
          {submitting ? '처리 중...' : '비밀번호 재설정'}
        </Text>
      </Pressable>
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    marginBottom: 24,
  },
  inputField: {
    flex: 1,
    paddingVertical: 6,
    fontSize: 16,
  },
});
