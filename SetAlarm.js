// SetAlarm.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Switch,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SetAlarm({ navigation }) {
  const [autoSpend, setAutoSpend] = useState(true);
  const [limitOver, setLimitOver] = useState(false);
  const [eventNews, setEventNews] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#BFBFBF" />
        </Pressable>
        <Text style={styles.headerTitle}>알림 설정</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* LIST */}
      <View style={styles.list}>
        {/* 자동 지출 알림 */}
        <View style={styles.row}>
          <Text style={styles.rowText}>자동 지출 알림</Text>
          <Switch
            value={autoSpend}
            onValueChange={setAutoSpend}
            trackColor={{ false: '#1C3D3A', true: '#035951' }}
            thumbColor="#FFFFFF"
          />
        </View>
        <View style={styles.separator} />

        {/* 한도 초과 알림 */}
        <View style={styles.row}>
          <Text style={styles.rowText}>한도 초과 알림</Text>
          <Switch
            value={limitOver}
            onValueChange={setLimitOver}
            trackColor={{ false: '#1C3D3A', true: '#035951' }}
            thumbColor="#FFFFFF"
          />
        </View>
        <View style={styles.separator} />

        {/* 이벤트 및 소식 알림 */}
        <View style={styles.row}>
          <Text style={styles.rowText}>이벤트 및 소식 알림</Text>
          <Switch
            value={eventNews}
            onValueChange={setEventNews}
            trackColor={{ false: '#1C3D3A', true: '#035951' }}
            thumbColor="#FFFFFF"
          />
        </View>
        <View style={styles.separator} />
      </View>
    </SafeAreaView>
  );
}

/* ------------------ STYLE ------------------ */
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

  list: {
    marginTop: 20,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },

  rowText: {
    color: '#BFBFBF',
    fontSize: 15,
    fontWeight: '600',
  },

  separator: {
    height: 1,
    backgroundColor: '#1C3D3A',
    marginHorizontal: 20,
  },
});
