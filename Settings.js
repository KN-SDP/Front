// Settings.js
import React from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Settings({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#BFBFBF" />
        </Pressable>
        <Text style={styles.headerTitle}>설정</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* MENU LIST */}
      <View style={styles.menuWrap}>
        <View style={styles.separator} />
        <Pressable style={styles.menuItem}>
          <Text style={styles.menuText}>FAQ</Text>
        </Pressable>
        <View style={styles.separator} />

        <Pressable style={styles.menuItem}>
          <Text style={styles.menuText}>서비스 이용약관</Text>
        </Pressable>
        <View style={styles.separator} />

        <Pressable style={styles.menuItem}>
          <Text style={styles.menuText}>개인정보처리방침</Text>
        </Pressable>
        <View style={styles.separator} />
      </View>

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

/* -------------------------- STYLES -------------------------- */

const BG = '#022326';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  headerTitle: {
    color: '#BFBFBF',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
    textAlign: 'left',
  },

  menuWrap: {
    paddingTop: 8,
  },

  menuItem: {
    paddingVertical: 17,
    paddingHorizontal: 20,
  },

  menuText: {
    color: '#BFBFBF',
    fontSize: 15,
    fontWeight: '600',
  },

  separator: {
    height: 1,
    backgroundColor: '#034040',
    marginHorizontal: 16,
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

  bottomItem: { alignItems: 'center' },

  bottomItemText: {
    marginTop: 4,
    fontSize: 10,
    color: '#BFBFBF',
  },
});
