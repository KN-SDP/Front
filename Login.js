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
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { createBox, createText, useTheme } from '@shopify/restyle';
import AuthService from './AuthService';

const Box = createBox();
const T = createText();

const CONTENT_MAX_WIDTH = 360; // 모바일 기준 폭, 웹에서는 가운데 정렬 + 좌우 여백

export default function Login({ navigation }) {
  useFocusEffect(
    React.useCallback(() => {
      if (typeof document !== 'undefined') document.title = '로그인 - Smart Ledger';
    }, [])
  );

  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
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
    } catch {
      setError('로그인에 실패했습니다. 입력 정보를 확인해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const goSignUp = () => navigation.navigate('SignUp');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <Box
        flex={1}
        alignItems="center"
        justifyContent="center"
        padding="xl"
      >
        {/* 가운데 카드 컨테이너 (웹에서 maxWidth 적용) */}
        <Box
          width="100%"
          style={{
            maxWidth: CONTENT_MAX_WIDTH,
            alignSelf: 'center',
          }}
        >

          {/* 브랜드 타이틀 */}
          <Box marginBottom="2xl">
            <T
              style={{ fontSize: 40, fontWeight: '800', lineHeight: 48 }}
              textAlign="center"
            >
              Smart
            </T>
            <T
              style={{ fontSize: 40, fontWeight: '800', lineHeight: 48 }}
              textAlign="center"
            >
              Ledger
            </T>
          </Box>

          {/* ID 라벨 + 입력 */}
          <T variant="hint" marginBottom="xs">ID</T>
          <Box
            borderWidth={1}
            borderColor="border"
            borderRadius="s"
            padding="m"
            marginBottom="l"
          >
            <TextInput
              placeholder="예) kangnam@naver.com"
              placeholderTextColor="#999"
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

          {/* PW 라벨 + 입력 + 보기 토글 */}
          <T variant="hint" marginBottom="xs">PW</T>
          <Box
            borderWidth={1}
            borderColor="border"
            borderRadius="s"
            paddingHorizontal="m"
            paddingVertical="m"
            marginBottom="l"
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                placeholder="비밀번호"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secure}
                textContentType="password"
                returnKeyType="done"
                style={{ fontSize: 16, flex: 1 }}
              />
              <Pressable
                onPress={() => setSecure((v) => !v)}
                hitSlop={8}
                style={{ paddingLeft: 8, paddingVertical: 4 }}
              >
                {/* 간단 아이콘(웹/모바일 공통 유니코드) */}
                <Text style={{ fontSize: 20 }}>{secure ? '🙈' : '👁️'}</Text>
              </Pressable>
            </View>
          </Box>

          {/* 에러 메시지 */}
          {!!error && (
            <T variant="error" marginBottom="s">{error}</T>
          )}

          {/* 기본 로그인 버튼 */}
          <Pressable
            onPress={onLogin}
            disabled={submitting}
            style={{
              backgroundColor: submitting ? theme.colors.primaryDisabled : '#000',
              padding: theme.spacing['2xl'],
              borderRadius: theme.radii.m,
              alignItems: 'center',
              marginTop: theme.spacing.s,
            }}
          >
            {submitting ? <ActivityIndicator color="#fff" /> : (
              <T variant="button">로그인</T>
            )}
          </Pressable>

          {/* 하단 링크: 회원가입 | ID 찾기 | PW 찾기 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: theme.spacing.l,
            }}
          >
            <Pressable onPress={goSignUp}><Text>회원가입</Text></Pressable>
            <Text style={{ color: theme.colors.border }}>|</Text>
            <Pressable onPress={() => { /* TODO: 아이디 찾기 라우팅 */ }}>
              <Text>ID 찾기</Text>
            </Pressable>
            <Text style={{ color: theme.colors.border }}>|</Text>
            <Pressable onPress={() => { /* TODO: 비밀번호 찾기 라우팅 */ }}>
              <Text>PW 찾기</Text>
            </Pressable>
          </View>

          {/* or 구분선 */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: theme.spacing.s }}>
            <View style={{ flex: 1, height: 1, backgroundColor: theme.colors.border }} />
            <Text style={{ marginHorizontal: 8, color: theme.colors.muted }}>or</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: theme.colors.border }} />
          </View>

          {/* 소셜 버튼들 */}
          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: '#03C75A', // Naver
              padding: theme.spacing['2xl'],
              borderRadius: theme.radii.m,
              alignItems: 'center',
              marginTop: theme.spacing.l,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>NAVER</Text>
          </Pressable>

          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: '#FEE500', // Kakao
              padding: theme.spacing['2xl'],
              borderRadius: theme.radii.m,
              alignItems: 'center',
              marginTop: theme.spacing.s,
            }}
          >
            <Text style={{ color: '#111', fontWeight: '700' }}>카카오</Text>
          </Pressable>

          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: '#8E8E93', // Google(무채색 버튼 느낌)
              padding: theme.spacing['2xl'],
              borderRadius: theme.radii.m,
              alignItems: 'center',
              marginTop: theme.spacing.s,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>Google</Text>
          </Pressable>

          {/* 하단 정책 링크 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: theme.spacing['2xl'],
            }}
          >
            <Pressable onPress={() => { /* TODO: 이용약관 라우팅 */ }}>
              <Text style={{ color: theme.colors.muted }}>이용약관</Text>
            </Pressable>
            <Pressable onPress={() => { /* TODO: 개인정보처리방침 라우팅 */ }}>
              <Text style={{ color: theme.colors.muted }}>개인정보처리방침</Text>
            </Pressable>
          </View>
        </Box>
      </Box>
    </KeyboardAvoidingView>
  );
}
