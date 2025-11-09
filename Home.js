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
import { Ionicons } from '@expo/vector-icons';

import AuthService from './AuthService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.7;

export default function Home({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  // ✅ 목표 목록 상태 추가
  const [goals, setGoals] = useState([]);
  const [goalLoading, setGoalLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await AuthService.getCurrentUser();
        if (!mounted) return;
        setUser(u);
        await loadGoals();
      } finally {
        if (mounted) {
          setLoading(false);
          setGoalLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // ✅ 목표 불러오기 함수
  const loadGoals = async () => {
    try {
      const res = await AuthService.getGoals();
      if (res.success) setGoals(res.data);
    } catch (err) {
      console.error('목표 불러오기 실패:', err);
    }
  };

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

        {/* 목표 */}
        <View style={{ marginTop: 20, marginHorizontal: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700' }}>목표</Text>
            <Pressable onPress={() => navigation.navigate('Motivation')}>
              <Text style={{ fontSize: 16, fontWeight: '700' }}>{'>'}</Text>
            </Pressable>
          </View>

          {goalLoading ? (
            <ActivityIndicator size="small" />
          ) : goals.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#777' }}>
              등록된 목표가 없습니다.
            </Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToAlignment="start"
              decelerationRate="fast"
            >
              {goals.map((item) => (
                <View
                  key={item.goalId}
                  style={{
                    backgroundColor: '#E5E5EA',
                    width: 180,
                    padding: 12,
                    marginRight: 12,
                    borderRadius: 12,
                  }}
                >
                  <Text style={{ fontWeight: '700', marginBottom: 4 }}>
                    {item.title}
                  </Text>
                  <Text>{item.targetAmount.toLocaleString()}원</Text>
                  <Text style={{ marginTop: 8 }}>
                    달성률 : {Math.round(item.progressRate * 100)}%
                  </Text>
                  <Text style={{ fontSize: 12, color: '#555' }}>
                    {item.deadline ? `${item.deadline} 목표` : ''}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
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
          <Text>목표</Text>
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
          transform: [{ translateX: sidebarAnim }],
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        {/* 상단 제목 + 설정 아이콘 */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            paddingHorizontal: 16,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700' }}>
            나의 Smart Ledger
          </Text>
          <Ionicons name="settings-outline" size={22} color="#000" />
        </View>

        {/* 사용자 인사 + 마이페이지 버튼 */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 14, marginBottom: 8 }}>
            {user?.nickname || '사용자'} 님 환영합니다.
          </Text>
          <Pressable
            onPress={() => {
              toggleSidebar();
              navigation.navigate('MyPage');
            }}
            style={{
              backgroundColor: '#000',
              paddingVertical: 6,
              paddingHorizontal: 20,
              borderRadius: 8,
              alignSelf: 'flex-start',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>
              마이페이지
            </Text>
          </Pressable>
        </View>

        {/* 메뉴 목록 */}
        {[
          { label: '자동결제 알리미', route: 'AutoPay' },
          { label: '동기부여', route: 'Motivation' },
          { label: '자산 / 내역', route: 'History' },
          { label: '예산 관리', route: 'Budget' },
          { label: '자동 지출 설정 / 월급 설정', route: 'Setting' },
        ].map((item, idx) => (
          <Pressable
            key={idx}
            onPress={() => {
              toggleSidebar();
              navigation.navigate(item.route);
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTopWidth: 1,
                borderColor: '#000',
                paddingVertical: 12,
                paddingHorizontal: 16,
              }}
            >
              <Text style={{ fontSize: 14 }}>{item.label}</Text>
              {/* ✅ label만 출력 */}
              <Ionicons name="chevron-forward-outline" size={16} color="#000" />
            </View>
          </Pressable>
        ))}

        {/* 로그아웃 위 구분선 + 로그아웃 버튼 */}
        <View
          style={{
            borderTopWidth: 1, // ✅ 검정색 구분선
            borderColor: '#000',
          }}
        />

        <Pressable
          onPress={async () => {
            await AuthService.clearAuth();
            navigation.replace('Login');
          }}
          style={{
            paddingVertical: 16,
            paddingHorizontal: 16,
          }}
        >
          <Text style={{ color: 'red', fontWeight: '700' }}>로그아웃</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
