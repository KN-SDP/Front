// Login.js
import React, { useState } from 'react';
import {
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

// Restyle
import { createBox, createText, useTheme } from '@shopify/restyle';
import AuthService from './AuthService';

const Box = createBox();
const T = createText();

export default function Login({ navigation }) {
  // 웹 탭 제목
  useFocusEffect(
    React.useCallback(() => {
      if (typeof document !== 'undefined') document.title = '로그인 - Jajup';
    }, [])
  );

  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해 주세요.');
      return;
    }
    try {
      setSubmitting(true);
      const res = await AuthService.login(email.trim(), password);
      if (res?.success) {
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      } else {
        setError(res?.message || '로그인에 실패했습니다. 입력 정보를 확인해 주세요.');
      }
    } catch (e) {
      setError('로그인에 실패했습니다. 입력 정보를 확인해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const goSignUp = () => navigation.navigate('SignUp');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <Box flex={1} padding="xl" justifyContent="center" gap="m">
        <T variant="title" textAlign="center" marginBottom="s">로그인</T>

        {/* 이메일 */}
        <Box borderWidth={1} borderColor="border" borderRadius="s" padding="m">
          <TextInput
            placeholder="이메일"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCorrect={false}
            returnKeyType="next"
            style={{ fontSize: 16 }}
          />
        </Box>

        {/* 비밀번호 */}
        <Box borderWidth={1} borderColor="border" borderRadius="s" padding="m">
          <TextInput
            placeholder="비밀번호"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="password"
            returnKeyType="done"
            style={{ fontSize: 16 }}
          />
        </Box>

        {!!error && (
          <T variant="error" style={{ marginTop: theme.spacing.xs }}>{error}</T>
        )}

        <Pressable
          onPress={onLogin}
          disabled={submitting}
          style={{
            backgroundColor: submitting ? theme.colors.primaryDisabled : theme.colors.primary,
            padding: theme.spacing['2xl'],
            borderRadius: theme.radii.m,
            alignItems: 'center',
            marginTop: theme.spacing.s,
          }}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <T variant="button">로그인</T>
          )}
        </Pressable>

        {/* 회원가입 링크 */}
        <Pressable onPress={goSignUp} style={{ alignItems: 'center', padding: theme.spacing.s }}>
          <T>아직 계정이 없으신가요? 회원가입</T>
        </Pressable>
      </Box>
    </KeyboardAvoidingView>
  );
}
