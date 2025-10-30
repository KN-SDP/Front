// Home.js
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AuthService from './AuthService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.3;

export default function Home({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await AuthService.getCurrentUser();
        if (!mounted) return;
        setUser(u);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const toggleSidebar = () => {
    if (sidebarVisible) {
      Animated.timing(sidebarAnim, {
        toValue: -SIDEBAR_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setSidebarVisible(false));
    } else {
      setSidebarVisible(true);
      Animated.timing(sidebarAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 내 폰 기준으로 헤더 쪽 (SmartLedger 아이콘) 이 안보여서 padding으로 내림.
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 40 }}>
      {/* 상단 바 */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#000',
        }}
      >
        <Pressable onPress={toggleSidebar}>
          <Ionicons name="menu" size={28} />
        </Pressable>
        <Text style={{ fontSize: 20, fontWeight: '800' }}>Smart Ledger</Text>
        <Pressable onPress={() => console.log('Alarm clicked')}>
          <Ionicons name="notifications-outline" size={28} />
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* 메인 박스 */}
        <View
          style={{
            backgroundColor: '#C4C4C4',
            paddingVertical: 40,
            paddingHorizontal: 24,
            marginHorizontal: 16,
            marginTop: 20,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 8 }}>
            스마트한 자동화
          </Text>
          <Text style={{ fontSize: 20, fontWeight: '700' }}>소비내역 관리</Text>
        </View>

        {/* 자동 결제 알리미 */}
        <View style={{ marginTop: 20, marginHorizontal: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700' }}>
              자동 결제 알리미
            </Text>
            <Text style={{ fontSize: 16, fontWeight: '700' }}>{'>'}</Text>
          </View>
          {['넷플릭스 자동 결제까지 D-2', '통신비 자동 결제까지 D-2'].map(
            (item, idx) => (
              <View
                key={idx}
                style={{
                  backgroundColor: '#E5E5EA',
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  marginBottom: 6,
                }}
              >
                <Text>{item}</Text>
              </View>
            )
          )}
        </View>

        {/* 목적 */}
        <View style={{ marginTop: 20, marginHorizontal: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700' }}>목적</Text>
            <Text style={{ fontSize: 16, fontWeight: '700' }}>{'>'}</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled // 카드 단위 스와이프 느낌
            snapToAlignment="start"
            decelerationRate="fast"
          >
            {Array(3)
              .fill(0)
              .map((_, idx) => (
                <View
                  key={idx}
                  style={{
                    backgroundColor: '#E5E5EA',
                    width: 180, // 조금 넓게 해서 스와이프 체감
                    padding: 12,
                    marginRight: 12,
                    borderRadius: 12,
                  }}
                >
                  <Text style={{ fontWeight: '700', marginBottom: 4 }}>
                    갤럭시 워치X
                  </Text>
                  <Text>200,000원</Text>
                  <Text style={{ marginTop: 8 }}>달성률 : 57%</Text>
                  <Text style={{ fontSize: 12, color: '#555' }}>
                    25.10.10 달성 목표
                  </Text>
                </View>
              ))}
          </ScrollView>
        </View>

        {/* 자산 / 내역 */}
        <View style={{ marginTop: 20, marginHorizontal: 16, marginBottom: 80 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700' }}>자산 / 내역</Text>
            <Text style={{ fontSize: 16, fontWeight: '700' }}>{'>'}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: '#000',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                flex: 1,
                padding: 12,
                borderRightWidth: 1,
                borderColor: '#000',
              }}
            >
              <Text
                style={{
                  color: 'blue',
                  fontWeight: '700',
                  textAlign: 'center',
                }}
              >
                900,000
              </Text>
              <Text style={{ textAlign: 'center' }}>수입</Text>
            </View>
            <View
              style={{
                flex: 1,
                padding: 12,
                borderRightWidth: 1,
                borderColor: '#000',
              }}
            >
              <Text
                style={{ color: 'red', fontWeight: '700', textAlign: 'center' }}
              >
                600,000
              </Text>
              <Text style={{ textAlign: 'center' }}>지출</Text>
            </View>
            <View style={{ flex: 1, padding: 12 }}>
              <Text style={{ fontWeight: '700', textAlign: 'center' }}>
                300,000
              </Text>
              <Text style={{ textAlign: 'center' }}>합계</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 하단 탭바 */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: 60,
          borderTopWidth: 1,
          borderTopColor: '#000',
          backgroundColor: '#fff',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <Pressable
          onPress={() => navigation.navigate('Home')}
          style={{ alignItems: 'center' }}
        >
          <Ionicons name="home" size={24} />
          <Text>홈</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('Motivation')}
          style={{ alignItems: 'center' }}
        >
          <Ionicons name="heart" size={24} />
          <Text>목적</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('History')}
          style={{ alignItems: 'center' }}
        >
          <Ionicons name="stats-chart" size={24} />
          <Text>내역</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('Assets')}
          style={{ alignItems: 'center' }}
        >
          <Ionicons name="logo-usd" size={24} />
          <Text>자산</Text>
        </Pressable>
      </View>
      {/* 사이드바 */}
      {sidebarVisible && (
        <TouchableWithoutFeedback onPress={toggleSidebar}>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
          />
        </TouchableWithoutFeedback>
      )}

      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: SIDEBAR_WIDTH,
          backgroundColor: '#fff',
          paddingTop: 40,
          paddingHorizontal: 16,
          transform: [{ translateX: sidebarAnim }],
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 20 }}>
          나의 Smart Ledger
        </Text>
        <Text style={{ marginBottom: 12 }}>
          {user?.nickname || '사용자'} 님 환영합니다.
        </Text>
        <Pressable
          style={{ marginBottom: 20 }}
          onPress={() => {
            toggleSidebar(); // 사이드바 닫기
            navigation.navigate('MyPage'); // 마이페이지로 이동
          }}
        >
          <Text>마이페이지</Text>
        </Pressable>

        {[
          '자동결제 알리미',
          '목적',
          '자산 / 내역',
          '예산 관리',
          '자동 지출 설정 / 월급 설정',
        ].map((item, idx) => (
          <Pressable key={idx} style={{ marginBottom: 12 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text>{item}</Text>
              <Text>{'>'}</Text>
            </View>
          </Pressable>
        ))}
        <Pressable
          style={{
            paddingVertical: 12,
            borderTopWidth: 1,
            borderColor: '#ccc',
          }}
          onPress={async () => {
            await AuthService.clearAuth();
            navigation.replace('Login');
          }}
        >
          <Text style={{ color: 'red', fontWeight: '700' }}>로그아웃</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
