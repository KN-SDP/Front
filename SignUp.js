// SignUp.js
// 회원가입 화면
// 👉 입력한 데이터(이메일, 비밀번호, 이름 등)를 AuthService.signUp()으로 전달
// 👉 성공 시 로그인 화면으로 이동

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { signUp } from './AuthService';

export default function SignUp({ navigation }) {
  const [userEmail, setEmail] = useState('');
  const [userPassword, setPassword] = useState('');
  const [checkedPassword, setCheckedPassword] = useState('');
  const [userName, setName] = useState('');
  const [userNickname, setNickname] = useState('');
  const [userBirth, setBirth] = useState('');
  const [userPhoneNumber, setPhoneNumber] = useState('');

  const handleSignUp = async () => {
    if (userPassword !== checkedPassword) {
      Alert.alert('비밀번호 불일치', '비밀번호와 확인 비밀번호가 다릅니다.');
      return;
    }

    const userData = {
      userEmail,
      userPassword,
      checkedPassword,
      userName,
      userNickname,
      userBirth,
      userPhoneNumber,
    };
    const result = await signUp(userData);

    if (result.success) {
      Alert.alert('회원가입 성공', '이제 로그인해주세요.');
      navigation.navigate('Login');
    } else {
      Alert.alert('회원가입 실패', result.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={userEmail}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={userPassword}
        secureTextEntry
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호 확인"
        value={checkedPassword}
        secureTextEntry
        onChangeText={setCheckedPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="이름"
        value={userName}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="닉네임"
        value={userNickname}
        onChangeText={setNickname}
      />
      <TextInput
        style={styles.input}
        placeholder="생년월일 (yyyymmdd)"
        value={userBirth}
        onChangeText={setBirth}
      />
      <TextInput
        style={styles.input}
        placeholder="전화번호"
        value={userPhoneNumber}
        onChangeText={setPhoneNumber}
      />
      <Button title="회원가입" onPress={handleSignUp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
});
