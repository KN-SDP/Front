// Home.js
import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { createBox, createText, useTheme } from '@shopify/restyle';
import AuthService from './AuthService';

const Box = createBox();
const T = createText();

export default function Home({ navigation }) {
  // 웹 탭 제목
  useFocusEffect(
    React.useCallback(() => {
      if (typeof document !== 'undefined') document.title = '홈 - Jajup';
    }, [])
  );

  const theme = useTheme();
  const [loading, setLoading] = useState(true);        // 초기 로딩
  const [refreshing, setRefreshing] = useState(false); // 당겨서 새로고침
  const [user, setUser] = useState(null);              // 로그인 유저(없으면 게스트)
  const [err, setErr] = useState('');                  // 안내/오류 메시지

  // ✅ AuthService 내부 구현에 의존하지 않고, 프로필 호출 성공/실패로 상태 판단
  const loadProfile = useCallback(async (isPull = false) => {
    if (isPull) setRefreshing(true);
    else setLoading(true);
    setErr('');
    try {
      const me = await AuthService.getProfile();
      setUser(me || null);
      if (!me) setErr('로그인 정보가 없거나 만료되었을 수 있어요.');
    } catch (e) {
      setUser(null);
      setErr('로그인 정보가 없거나 만료되었을 수 있어요.');
    } finally {
      if (isPull) setRefreshing(false);
      else setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile(false);
  }, [loadProfile]);

  const onRefresh = () => loadProfile(true);

  const onLogout = async () => {
    try {
      if (typeof AuthService.logout === 'function') await AuthService.logout();
    } catch {}
    setUser(null);
    setErr('');
  };

  // 초기 로딩
  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" padding="xl" gap="s">
        <ActivityIndicator />
        <T variant="hint">로그인 상태 확인 중...</T>
      </Box>
    );
  }

  // 로그인 상태
  if (user) {
    const displayName =
      user?.name ?? user?.nickname ?? user?.username ?? user?.email ?? '사용자';

    return (
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: theme.spacing.xl }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {!!err && <T variant="error" marginBottom="s">{err}</T>}
        <T variant="title" marginBottom="s">{displayName}님, 환영합니다!</T>

        {/* 홈 콘텐츠 영역 */}
        <T marginBottom="l">여기에 대시보드/리스트/버튼 등을 배치하세요.</T>

        <Box flexDirection="row" gap="m" marginTop="m">
          <Pressable
            onPress={onRefresh}
            style={{
              backgroundColor: '#444',
              padding: theme.spacing.m,
              borderRadius: theme.radii.s,
            }}
          >
            <T color="background">프로필 새로고침</T>
          </Pressable>

          <Pressable
            onPress={onLogout}
            style={{
              backgroundColor: theme.colors.primary,
              padding: theme.spacing.m,
              borderRadius: theme.radii.s,
            }}
          >
            <T variant="button">로그아웃</T>
          </Pressable>
        </Box>
      </ScrollView>
    );
  }

  // 게스트 상태
  return (
    <Box flex={1} padding="xl" justifyContent="center" gap="m">
      {!!err && <T variant="error" textAlign="center">{err}</T>}

      <T variant="title" textAlign="center">환영합니다! 먼저 로그인해 주세요.</T>
      <T variant="hint" textAlign="center">로그인하면 프로필과 개인화된 콘텐츠가 표시됩니다.</T>

      <Pressable
        onPress={() => navigation.navigate('Login')}
        style={{
          backgroundColor: theme.colors.primary,
          padding: theme.spacing['2xl'],
          borderRadius: theme.radii.m,
          alignItems: 'center',
          marginTop: theme.spacing.s,
        }}
      >
        <T variant="button">로그인</T>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('SignUp')} style={{ alignItems: 'center', padding: theme.spacing.s }}>
        <T>아직 계정이 없으신가요? 회원가입</T>
      </Pressable>
    </Box>
  );
}
