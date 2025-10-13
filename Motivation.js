// Motivation.js
import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Motivation({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      {/* 상단 바 */}
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.title}>Smart Ledger</Text>
        <View style={styles.sortOptions}></View>
      </View>

      {/* 필터/정렬 바 */}
      <View style={styles.filterBar}>
        <Pressable style={styles.filterButton}>
          <Text>한줄</Text>
        </Pressable>
        <Pressable style={styles.filterButton}>
          <Text>최신순</Text>
          <Ionicons name="chevron-down" size={16} color="#000" />
        </Pressable>
        <Pressable style={styles.filterButton}>
          <Text>진행도순</Text>
          <Ionicons name="chevron-down" size={16} color="#000" />
        </Pressable>
      </View>

      {/* 본문 */}
      <View style={styles.container}>
        <Text style={styles.message}>
          마음에 꼭 드는 목표를 정하는 순간,{'\n'}저축은 더 즐거워져요.
        </Text>
        <Pressable style={styles.addButton}>
          <Ionicons name="add" size={30} color="#555" />
        </Pressable>
      </View>

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
          <Text>동기</Text>
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
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  filterButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomTab: {
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
  },
  tabItem: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    marginTop: 2,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  message: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 26,
  },
  addButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
