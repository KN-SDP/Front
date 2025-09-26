// Login.js
import React, { useState } from 'react';
import {
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
  Text,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AuthService from './AuthService';

const CONTENT_MAX_WIDTH = 360;
const PH = '#999';

export default function Login({ navigation }) {
  useFocusEffect(
    React.useCallback(() => {
      if (typeof document !== 'undefined')
        document.title = '로그인 - Smart Ledger';
    }, [])
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true); // ✅ 가시성 토글 상태
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const canSubmit =
    email.trim() && password.length >= 8 && password.length <= 20;

  const onLogin = async () => {
    if (!canSubmit) {
      Alert.alert('알림', '이메일/비밀번호를 확인해 주세요.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      // 명세: { email, password }
      const data = await AuthService.login({ email: email.trim(), password });
      Alert.alert('로그인', `환영합니다, ${data?.username || '사용자'} 님!`);
      navigation.replace('Home');
    } catch (e) {
      const status = e?.response?.status;
      const code = e?.response?.data?.error_code;
      const message = e?.response?.data?.message;

      if (status === 401 && code === 'InvalidCredentials') {
        Alert.alert('로그인 실패', '이메일 또는 비밀번호가 올바르지 않습니다.');
      } else if (status === 400 && code === 'ValidationError') {
        Alert.alert('유효성 오류', message || '올바른 이메일 형식이 아닙니다.');
      } else if (status === 500) {
        Alert.alert('서버 오류', '서버에 문제가 발생했습니다.');
      } else {
        Alert.alert(
          '오류',
          message || '로그인에 실패했습니다. 다시 시도해 주세요.'
        );
      }
      setError(message || '로그인 실패');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={{ flex: 1, backgroundColor: '#fff' }}
    >
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 16,
        }}
      >
        <View style={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH }}>
          <Text style={{ fontSize: 22, fontWeight: '800', marginBottom: 16 }}>
            로그인
          </Text>

          <Text style={styles.label}>이메일</Text>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="example@domain.com"
              placeholderTextColor={PH}
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
            />
          </View>

          <Text style={styles.label}>비밀번호</Text>
          <View style={styles.inputRow}>
            <TextInput
              placeholder="비밀번호 입력"
              placeholderTextColor={PH}
              value={password}
              onChangeText={setPassword}
              style={[styles.input, { paddingRight: 56 }]} // 버튼 공간
              secureTextEntry={secure}
              returnKeyType="done"
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => setSecure((s) => !s)}
              style={styles.eyeBtn}
            >
              <Text style={styles.eyeText}>{secure ? '보기' : '숨기기'}</Text>
            </Pressable>
          </View>

          {!!error && (
            <Text style={{ color: '#d00', marginTop: 10 }}>{error}</Text>
          )}

          <Pressable
            onPress={onLogin}
            disabled={!canSubmit || submitting}
            style={[
              styles.submitBtn,
              { opacity: !canSubmit || submitting ? 0.5 : 1 },
            ]}
          >
            {submitting ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.submitText}>로그인</Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => navigation.replace('SignUp')}
            style={{ alignSelf: 'center', marginTop: 14 }}
          >
            <Text style={{ fontSize: 13, color: '#555' }}>
              계정이 없으신가요? 회원가입
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = {
  label: { fontSize: 13, fontWeight: '700', marginTop: 14, marginBottom: 6 },
  inputWrap: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  inputRow: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    position: 'relative',
    minHeight: 48,
    justifyContent: 'center',
  },
  input: { fontSize: 15, paddingVertical: 12, paddingLeft: 0, paddingRight: 0 },
  eyeBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  eyeText: { fontSize: 13, color: '#555', fontWeight: '700' },
  submitBtn: {
    marginTop: 20,
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
};
