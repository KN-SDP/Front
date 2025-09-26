// Home.js
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import AuthService from './AuthService';

export default function Home({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // { userId, email, username, nickname }
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await AuthService.getCurrentUser();
        if (!mounted) return;
        setUser(u);
        // 로그인 직후 진입 시 환영 배너 한 번 노출
        setShowWelcome(!!u);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const onLogout = async () => {
    await AuthService.clearAuth();
    setUser(null);
    setShowWelcome(false);
    // 필요 시 로그인으로 이동
    // navigation.replace('Login');
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  const displayName = user?.nickname || user?.username || '사용자';

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* ✅ 상단 환영 배너 (한 줄, 닫기 가능) */}
      {showWelcome && (
        <View
          style={{
            backgroundColor: '#E6F7EE', // 연한 그린
            borderBottomWidth: 1,
            borderBottomColor: '#D6F0E3',
            paddingVertical: 10,
            paddingHorizontal: 14,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ color: '#137C4B', fontWeight: '700' }}>
            ✅ 로그인되었습니다. 환영해요, {displayName} 님!
          </Text>
          <Pressable onPress={() => setShowWelcome(false)} hitSlop={10}>
            <Text style={{ color: '#137C4B', fontWeight: '700' }}>닫기</Text>
          </Pressable>
        </View>
      )}

      {/* 상단바 영역: 좌측 타이틀, 우측 상태 Pill + 로그아웃 */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: '#EFEFF4',
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '800' }}>Home</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {/* ✅ 로그인 상태 Pill */}
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 999,
              backgroundColor: user ? '#EEF9F1' : '#F2F2F7',
              borderWidth: 1,
              borderColor: user ? '#BFEAD1' : '#E5E5EA',
              marginRight: 6,
            }}
          >
            <Text style={{ fontSize: 12, color: user ? '#137C4B' : '#666' }}>
              {user ? `로그인: ${displayName}` : '비로그인'}
            </Text>
          </View>

          {/* 로그아웃 / 로그인 버튼 */}
          {user ? (
            <Pressable
              onPress={onLogout}
              style={{
                backgroundColor: '#000',
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>
                로그아웃
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => navigation.replace('Login')}
              style={{
                backgroundColor: '#000',
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>
                로그인
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* 본문 예시 */}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 16 }}>
          {user
            ? `${displayName} 님, 반가워요! 최근 활동을 이어가 보세요.`
            : '로그인하면 더 많은 기능을 이용할 수 있어요.'}
        </Text>
      </View>
    </View>
  );
}
