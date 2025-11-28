// Management.js (계정 관리)
import React from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Management({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#BFBFBF" />
        </Pressable>
        <Text style={styles.headerTitle}>계정 관리</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* 목록 그룹 */}
      <View style={styles.menuGroup}>
        <Pressable
          style={styles.menuRow}
          onPress={() => navigation.navigate('ChangeNick')}
        >
          <Text style={styles.menuText}>닉네임 수정</Text>
          <Ionicons name="chevron-forward-outline" size={18} color="#8FA6A1" />
        </Pressable>

        <View style={styles.separator} />

        <Pressable
          style={styles.menuRow}
          onPress={() => navigation.navigate('LoginResetPw')}
        >
          <Text style={styles.menuText}>비밀번호 변경</Text>
          <Ionicons name="chevron-forward-outline" size={18} color="#8FA6A1" />
        </Pressable>

        <View style={styles.separator} />

        <Pressable
          style={styles.menuRow}
          onPress={() => navigation.navigate('Secession')}
        >
          <Text style={[styles.menuText, { color: '#FF6E6E' }]}>회원 탈퇴</Text>
          <Ionicons name="close-circle-outline" size={18} color="#FF6E6E" />
        </Pressable>
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

  /******** Header ********/
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

  /******** Menu Group ********/
  menuGroup: {
    marginTop: 10,
    marginHorizontal: 20,
    backgroundColor: CARD,
    borderRadius: 16,
    paddingVertical: 8,
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
