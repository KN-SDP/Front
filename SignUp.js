// SignUp.js
import React, { useCallback, useMemo, useState } from 'react';
import { TextInput, ActivityIndicator, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { createBox, createText, useTheme } from '@shopify/restyle';
import AuthService from './AuthService';

const Box = createBox();
const T = createText();

const emailOk = (v) => /\S+@\S+\.\S+/.test(v);

/** ✅ 화면 바깥에 고정 + memo로 불필요 리렌더 방지 */
const Field = React.memo(function Field({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  returnKeyType,
  onSubmitEditing,
}) {
  const theme = useTheme();
  return (
    <Box borderWidth={1} borderColor="border" borderRadius="s" padding="m">
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        style={{ fontSize: 16 }}
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
      />
    </Box>
  );
});

export default function SignUp({ navigation }) {
  // 탭 제목
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

  const setEmail = (v) => setForm((f) => ({ ...f, email: v }));
  const setPassword = (v) => setForm((f) => ({ ...f, password: v }));
  const setPassword2 = (v) => setForm((f) => ({ ...f, password2: v }));
  const setName = (v) => setForm((f) => ({ ...f, name: v }));
  const setNickname = (v) => setForm((f) => ({ ...f, nickname: v }));
  const setBirth = (v) => setForm((f) => ({ ...f, birth: v }));
  const setPhone = (v) => setForm((f) => ({ ...f, phone: v }));

  const disabled = useMemo(
    () => submitting,
    [submitting]
  );

  const onSubmit = useCallback(async () => {
    setError('');

    // 명세 반영: 유효성 확인
    if (!emailOk(form.email)) return setError('올바른 이메일을 입력해 주세요.');
    if (form.password.length < 8 || form.password.length > 20)
      return setError('비밀번호는 8~20자여야 합니다.');
    if (form.password !== form.password2)
      return setError('비밀번호가 일치하지 않습니다.');
    if (!form.name?.trim()) return setError('이름을 입력해 주세요.');
    if (!form.nickname?.trim()) return setError('닉네임을 입력해 주세요.');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.birth))
      return setError('생년월일은 YYYY-MM-DD 형식입니다.');

    const phoneDigits = (form.phone || '').replace(/[^0-9]/g, '');
    if (!(phoneDigits.length === 10 || phoneDigits.length === 11))
      return setError('전화번호는 하이픈 없이 10~11자리 숫자입니다.');

    try {
      setSubmitting(true);
      const payload = {
        // 폼 키로 넘겨도 AuthService가 API 스펙으로 매핑합니다.
        email: form.email.trim(),
        password: form.password,
        password2: form.password2,
        name: form.name.trim(),
        nickname: form.nickname.trim(),
        birth: form.birth,
        phone: phoneDigits,
      };

      const res = await AuthService.signUp(payload);
      if (res?.success) {
        navigation.replace('Login');
      } else {
        setError(res?.message || '회원가입에 실패했습니다.');
      }
    } catch (e) {
      setError('회원가입에 실패했습니다. 입력값을 확인해 주세요.');
    } finally {
      setSubmitting(false);
    }
  }, [form, navigation]);

  return (
    <Box flex={1} padding="xl" gap="m">
      <T variant="title" textAlign="center">회원가입</T>

      <Field
        placeholder="이메일"
        value={form.email}
        onChangeText={setEmail}
        keyboardType="email-address"
        returnKeyType="next"
      />

      <Field
        placeholder="비밀번호 (8~20자)"
        value={form.password}
        onChangeText={setPassword}
        secureTextEntry
        returnKeyType="next"
      />

      <Field
        placeholder="비밀번호 확인"
        value={form.password2}
        onChangeText={setPassword2}
        secureTextEntry
        returnKeyType="next"
      />

      <Field
        placeholder="이름"
        value={form.name}
        onChangeText={setName}
        returnKeyType="next"
      />

      <Field
        placeholder="닉네임"
        value={form.nickname}
        onChangeText={setNickname}
        returnKeyType="next"
      />

      <Field
        placeholder="생년월일 (YYYY-MM-DD)"
        value={form.birth}
        onChangeText={setBirth}
        keyboardType="numbers-and-punctuation"
        returnKeyType="next"
      />

      <Field
        placeholder="전화번호 (하이픈 없이 입력)"
        value={form.phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        returnKeyType="done"
      />

      {!!error && (
        <T variant="error" style={{ marginTop: theme.spacing.xs }}>{error}</T>
      )}

      <Pressable
        onPress={onSubmit}
        disabled={disabled}
        style={{
          backgroundColor: disabled ? theme.colors.primaryDisabled : theme.colors.primary,
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
