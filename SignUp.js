/*
signUp() 모킹 함수 사용
API 연동 시 :
  - axois ~ 로 호출
  - 서버 응답에 따라 가입 성공/실패 처리
*/
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { signUp } from './AuthService'; // 모킹용 회원가입

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const onSignUp = async () => {
    if (!email || !password || !name) {
      Alert.alert('알림', '모든 필드를 입력해주세요.');
      return;
    }

    const result = await signUp(email, password, name); // 모킹용
    if (result.success) {
      Alert.alert('회원가입 완료', '이제 로그인 해주세요.');
      navigation.replace('Login');
    } else {
      Alert.alert('회원가입 실패', result.message || '다시 시도해주세요.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>회원가입</Text>

      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="이름"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={styles.button} onPress={onSignUp}>
        <Text style={styles.buttonText}>가입 완료</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>이미 계정이 있으신가요? 로그인</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#bbb',
    marginBottom: 16,
    paddingVertical: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  linkText: {
    marginTop: 16,
    fontSize: 14,
    textAlign: 'center',
    color: '#000',
  },
});
