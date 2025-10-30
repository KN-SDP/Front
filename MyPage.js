// MyPage.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MyPage({ navigation }) {
  const [nickname, setNickname] = useState('1000sh');
  const [email, setEmail] = useState('kangnam@naver.com');

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>마이페이지</Text>
        <Ionicons name="settings-outline" size={24} color="#000" />
      </View>

      {/* 사용자 정보 박스 */}
      <View style={styles.infoBox}>
        <Text style={styles.nickname}>{nickname}</Text>
        <Text style={styles.email}>{email}</Text>

        <Pressable style={styles.changeButton}>
          <Text style={styles.changeText}>닉네임 변경하기</Text>
        </Pressable>
      </View>

      {/* 앱 리뷰 작성 */}
      <View style={{ marginTop: 100 }}>
        <Text style={styles.reviewText}>앱 리뷰 작성</Text>
      </View>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },

  infoBox: {
    backgroundColor: '#d9d9d9',
    marginTop: 30,
    marginHorizontal: 10,
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
  },
  nickname: { fontWeight: '700', fontSize: 18, marginBottom: 4 },
  email: { fontSize: 14, color: '#333' },

  changeButton: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 40,
    marginTop: 12,
    borderRadius: 4,
  },
  changeText: { fontSize: 14 },

  reviewText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
  },

  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#000',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
  tabItem: { alignItems: 'center' },
});
