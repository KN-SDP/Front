// SignUp.js
import React, { useState } from 'react';
import { TextInput, ActivityIndicator, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { createBox, createText, useTheme } from '@shopify/restyle';
import AuthService from './AuthService';

const Box = createBox();
const T = createText();

const emailOk = (v) => /\S+@\S+\.\S+/.test(v);

export default function SignUp({ navigation }) {
  // 웹 탭 제목
  useFocusEffect(
    React.useCallback(() => {
      if (typeof document !== 'undefined') document.title = '회원가입 - Jajup';
    }, [])
  );

  const theme = useTheme();
  const [form, setForm] = useState({
    email: '',
    password: '',
    password2: '',
    name: '',
    nickname: '',
    birth: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const onSubmit = async () => {
    setError('');
    if (!emailOk(form.email)) return setError('올바른 이메일을 입력해 주세요.');
    if (form.password.length < 6) return setError('비밀번호는 6자 이상이어야 합니다.');
    if (form.password !== form.password2) return setError('비밀번호가 일치하지 않습니다.');

    try {
      setSubmitting(true);
      const payload = {
        email: form.email.trim(),
        password: form.password,
        name: form.name || undefined,
        nickname: form.nickname || undefined,
        birth: form.birth || undefined,   // 백엔드 명세(예: YYYY-MM-DD)에 맞춰 입력
        phone: form.phone || undefined,
      };
      await AuthService.signUp(payload);
      navigation.replace('Login');
    } catch (e) {
      setError('회원가입에 실패했습니다. 입력값을 확인해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const Input = ({ value, onChangeText, placeholder, secureTextEntry, keyboardType, returnKeyType, onSubmitEditing }) => (
    <Box borderWidth={1} borderColor="border" borderRadius="s" padding="m">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        style={{ fontSize: 16 }}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </Box>
  );

  return (
    <Box flex={1} padding="xl" gap="m">
      <T variant="title" textAlign="center">회원가입</T>

      <Input placeholder="이메일" value={form.email} onChangeText={(v) => set('email', v)} keyboardType="email-address" returnKeyType="next" />
      <Input placeholder="비밀번호" value={form.password} onChangeText={(v) => set('password', v)} secureTextEntry returnKeyType="next" />
      <Input placeholder="비밀번호 확인" value={form.password2} onChangeText={(v) => set('password2', v)} secureTextEntry returnKeyType="next" />

      <Input placeholder="이름(선택)" value={form.name} onChangeText={(v) => set('name', v)} returnKeyType="next" />
      <Input placeholder="닉네임(선택)" value={form.nickname} onChangeText={(v) => set('nickname', v)} returnKeyType="next" />
      <Input placeholder="생년월일 예: 2000-03-09 (선택)" value={form.birth} onChangeText={(v) => set('birth', v)} returnKeyType="next" />
      <Input placeholder="전화번호(선택)" value={form.phone} onChangeText={(v) => set('phone', v)} keyboardType="phone-pad" returnKeyType="done" onSubmitEditing={onSubmit} />

      {!!error && <T variant="error">{error}</T>}

      <Pressable
        onPress={onSubmit}
        disabled={submitting}
        style={{
          backgroundColor: submitting ? theme.colors.primaryDisabled : theme.colors.primary,
          padding: theme.spacing['2xl'],
          borderRadius: theme.radii.m,
          alignItems: 'center',
          marginTop: theme.spacing.s,
        }}
      >
        {submitting ? <ActivityIndicator color="#fff" /> : <T variant="button">회원가입</T>}
      </Pressable>
    </Box>
  );
}
