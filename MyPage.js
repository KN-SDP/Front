// MyPage.js (Smart Ledger 스타일 전체 리디자인)
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthService from './AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openSidebarRef } from './Home';
import { useIsFocused } from '@react-navigation/native';

export default function MyPage({ navigation }) {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');

  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setNickname(user?.nickname || '');
        setEmail(user?.email || '');
      } catch (e) {
        console.log('유저 정보 불러오기 실패:', e);
      }
    };

    if (isFocused) {
      fetchUser(); // 🔥 화면 포커스될 때마다 실행됨
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            navigation.navigate('Home');
            setTimeout(() => {
              openSidebarRef?.();
            }, 10);
          }}
        >
          <Ionicons name="chevron-back" size={26} color="#BFBFBF" />
        </Pressable>
        <Text style={styles.headerTitle}>마이페이지</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* 사용자 프로필 카드 */}
      <View style={styles.profileCard}>
        <Ionicons name="person-circle-outline" size={72} color="#FFFFFF" />
        <Text style={styles.nickname}>{nickname}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      {/* 메뉴 리스트 */}
      <View style={styles.menuGroup}>
        <Pressable
          style={styles.menuRow}
          onPress={() => navigation.navigate('Management')}
        >
          <Text style={styles.menuText}>계정 관리</Text>
          <Ionicons name="chevron-forward-outline" size={18} color="#8FA6A1" />
        </Pressable>

        <View style={styles.separator} />

        <Pressable
          style={styles.menuRow}
          onPress={() => navigation.navigate('SetAlarm')}
        >
          <Text style={styles.menuText}>알림 설정</Text>
          <Ionicons name="chevron-forward-outline" size={18} color="#8FA6A1" />
        </Pressable>

        <View style={styles.separator} />

        <Pressable
          style={styles.menuRow}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={[styles.menuText, { color: '#FF6E6E' }]}>로그아웃</Text>
          <Ionicons name="log-out-outline" size={18} color="#FF6E6E" />
        </Pressable>
      </View>

      {/* 앱 정보 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>현재 버전 정보</Text>
        <Text style={styles.sectionValue}>0.0.1v</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>앱 정보</Text>
        <Text style={styles.sectionValue}>가계부 관리 APP</Text>
      </View>

      {/* 하단 메뉴 */}
      <View style={styles.sidebarBottomMenu}>
        <Pressable
          style={styles.bottomItem}
          onPress={() => {
            AsyncStorage.removeItem('accessToken');
            navigation.navigate('Login');
          }}
        >
          <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
          <Text style={styles.bottomItemText}>로그아웃</Text>
        </Pressable>

        <Pressable style={styles.bottomItem}>
          <Ionicons name="headset-outline" size={22} color="#FFFFFF" />
          <Text style={styles.bottomItemText}>문의</Text>
        </Pressable>

        <Pressable
          style={styles.bottomItem}
          onPress={() => navigation.navigate('MyPage')}
        >
          <Ionicons name="person-outline" size={22} color="#FFFFFF" />
          <Text style={styles.bottomItemText}>마이페이지</Text>
        </Pressable>

        <Pressable
          style={styles.bottomItem}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={22} color="#FFFFFF" />
          <Text style={styles.bottomItemText}>설정</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const BG = '#022326';
const CARD = '#034040';
const TEXT_MAIN = '#FFFFFF';
const TEXT_SUB = '#BFBFBF';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.7,
    borderColor: '#2D4D4A',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_MAIN,
  },

  profileCard: {
    marginVertical: 26,
    alignItems: 'center',
  },
  nickname: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_MAIN,
    marginTop: 8,
  },
  email: {
    fontSize: 13,
    color: TEXT_SUB,
    marginTop: 2,
  },

  menuGroup: {
    marginTop: 10,
    marginHorizontal: 20,
    backgroundColor: CARD,
    borderRadius: 16,
    paddingVertical: 6,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  menuText: {
    color: TEXT_MAIN,
    fontSize: 15,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#1C3D3A',
    marginHorizontal: 14,
  },

  section: { paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: { color: TEXT_MAIN, fontSize: 14, marginBottom: 6 },
  sectionValue: { color: TEXT_SUB, fontSize: 13 },

  sidebarBottomMenu: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingHorizontal: 50,
    paddingVertical: 18,

    borderTopWidth: 0.7,
    borderColor: '#035951',
    backgroundColor: '#022326',
  },

  bottomItem: {
    alignItems: 'center',
  },

  bottomItemText: {
    marginTop: 4,
    fontSize: 10,
    color: '#BFBFBF',
  },
});
