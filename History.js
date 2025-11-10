// History.js
import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

export default function History({ navigation }) {
  const [baseDate, setBaseDate] = useState(dayjs());
  const [mode, setMode] = useState('day'); // ✅ 기본은 일별 모드

  // ✅ 주차 이동
  const moveWeek = useCallback((offset) => {
    setBaseDate((prev) => prev.add(offset, 'week'));
  }, []);

  // ✅ 연도 이동 (월별용)
  const moveYear = (offset) => {
    setBaseDate((prev) => prev.add(offset, 'year'));
  };

  const year = baseDate.year();

  // ✅ 이번 주 (월~일)
  const getWeekRange = useCallback((date) => {
    const startOfWeek = date.startOf('week').add(1, 'day'); // 월요일 기준
    const endOfWeek = startOfWeek.add(6, 'day');
    return { startOfWeek, endOfWeek };
  }, []);

  const getWeekInfo = useCallback((date) => {
    const year = date.year();
    const month = date.month() + 1;
    const startOfMonth = date.startOf('month');
    const weekOfMonth = Math.ceil((date.date() + startOfMonth.day()) / 7);
    return { year, month, weekOfMonth };
  }, []);

  const weekRange = useMemo(() => getWeekRange(baseDate), [baseDate]);
  const weekInfo = useMemo(() => getWeekInfo(baseDate), [baseDate]);

  // ✅ 이번 주 날짜 (일별)
  const daysOfWeek = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const d = weekRange.startOfWeek.add(i, 'day');
      arr.push({
        key: d.format('YYYY-MM-DD'),
        label: d.format('YYYY.MM.DD (dd)'),
      });
    }
    return arr;
  }, [weekRange]);

  // ✅ 월별용 1~12월
  const months = useMemo(() => {
    const arr = [];
    for (let i = 1; i <= 12; i++) {
      arr.push({
        key: i,
        label: `${i}월`,
      });
    }
    return arr;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* ===== 상단 헤더 (Smart Ledger) ===== */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Smart Ledger</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* ===== 공통 하위 바 (연도/주차 + 모드 전환) ===== */}
      <View style={styles.subHeader}>
        {/* 왼쪽 화살표 */}
        <Pressable
          onPress={() => (mode === 'day' ? moveWeek(-1) : moveYear(-1))}
        >
          <Ionicons name="chevron-back-outline" size={20} color="#000" />
        </Pressable>

        {/* 중앙 텍스트 (일별 ↔ 월별 공용 구조) */}
        <Text style={styles.subHeaderText}>
          {mode === 'day'
            ? `${weekInfo.year}년 ${weekInfo.month}월 ${weekInfo.weekOfMonth}주차`
            : `${year}년`}
        </Text>

        {/* 오른쪽 화살표 */}
        <Pressable onPress={() => (mode === 'day' ? moveWeek(1) : moveYear(1))}>
          <Ionicons name="chevron-forward-outline" size={20} color="#000" />
        </Pressable>

        {/* 모드 전환 버튼 */}
        <View style={styles.modeButtons}>
          <Pressable
            onPress={() => setMode('day')}
            style={[
              styles.modeButton,
              mode === 'day' && styles.modeButtonActive,
            ]}
          >
            <Text
              style={[
                styles.modeButtonText,
                mode === 'day' && styles.modeButtonTextActive,
              ]}
            >
              일별
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode('month')}
            style={[
              styles.modeButton,
              mode === 'month' && styles.modeButtonActive,
            ]}
          >
            <Text
              style={[
                styles.modeButtonText,
                mode === 'month' && styles.modeButtonTextActive,
              ]}
            >
              월별
            </Text>
          </Pressable>
        </View>
      </View>

      {/* ===== 월별 모드 ===== */}
      {mode === 'month' && (
        <ScrollView
          contentContainerStyle={styles.monthScroll}
          showsVerticalScrollIndicator={false}
        >
          {/* 상단 버튼 */}
          <View style={styles.analysisButtons}>
            <Pressable style={styles.analysisButton}>
              <Text style={styles.analysisText}>가계부 분석</Text>
            </Pressable>
            <Pressable style={styles.analysisButton}>
              <Text style={styles.analysisText}>공유 가계부</Text>
            </Pressable>
          </View>

          {/* 합계 카드 */}
          <View style={styles.summaryCard}>
            <Text style={styles.cardTitle}>{year}년 합계</Text>
            <Text style={styles.cardText}>수입</Text>
            <Text style={styles.cardText}>지출</Text>
            <Text style={styles.cardText}>합계</Text>
          </View>

          {/* 1~12월 카드 */}
          <View style={styles.monthGrid}>
            {months.map((m, i) => (
              <Pressable
                key={m.key}
                style={styles.monthBox}
                onPress={() =>
                  navigation.navigate('HistoryDetail', {
                    selectedMonth: m.key,
                    selectedYear: year,
                  })
                }
              >
                <Text style={styles.monthLabel}>{m.label}</Text>
                {i === 0 ? (
                  <>
                    <Text style={styles.totalText}>+300,000</Text>
                    <Text style={styles.incomeText}>+500,000</Text>
                    <Text style={styles.expenseText}>-200,200</Text>
                  </>
                ) : (
                  <View style={{ height: 40 }} />
                )}
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}

      {/* ===== 일별 모드 ===== */}
      {mode === 'day' && (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.cardTitle}>이번주 합계</Text>
            <Text style={styles.cardText}>수입</Text>
            <Text style={styles.cardText}>지출</Text>
            <Text style={styles.cardText}>합계</Text>
          </View>

          {daysOfWeek.map((d) => (
            <Pressable
              key={d.key}
              style={styles.card}
              onPress={() =>
                navigation.navigate('HistoryDetail', { selectedDate: d.key })
              }
            >
              <Text style={styles.cardTitle}>{d.label}</Text>
              <Text style={styles.cardText}>수입</Text>
              <Text style={styles.cardText}>지출</Text>
              <Text style={styles.cardText}>합계</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* ===== 하단 탭바 그대로 유지 ===== */}
      <View style={styles.bottomTab}>
        <Pressable style={styles.tabItem} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text style={styles.tabText}>뒤로가기</Text>
        </Pressable>

        <Pressable
          style={styles.tabItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="wallet-outline" size={24} color="#000" />
          <Text style={styles.tabText}>가계부 메인</Text>
        </Pressable>

        <Pressable style={styles.tabItem}>
          <Ionicons name="share-social-outline" size={24} color="#000" />
          <Text style={styles.tabText}>공유</Text>
        </Pressable>

        <Pressable style={styles.tabItem}>
          <Ionicons name="document-text-outline" size={24} color="#000" />
          <Text style={styles.tabText}>분석</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  subHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 8,
  },

  weekSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  weekText: { fontSize: 16, fontWeight: '700', marginHorizontal: 8 },

  modeButtons: {
    flexDirection: 'row',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
  },
  modeButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
  },
  modeButtonActive: { backgroundColor: '#000' },
  modeButtonText: { color: '#000', fontWeight: '700' },
  modeButtonTextActive: { color: '#fff' },

  // 월별 모드
  monthScroll: { paddingBottom: 120 },
  analysisButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 10,
  },
  analysisButton: {
    backgroundColor: '#D9D9D9',
    borderRadius: 30,
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  analysisText: { fontWeight: '700', color: '#000' },

  summaryCard: {
    backgroundColor: '#D9D9D9',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  cardTitle: { fontWeight: '700', fontSize: 15, marginBottom: 6 },
  cardText: { fontSize: 14, marginVertical: 2 },

  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  monthBox: {
    backgroundColor: '#D9D9D9',
    borderRadius: 16,
    width: '30%',
    aspectRatio: 0.7, // 👈 더 작게 줄임 (사진 비율처럼)
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  monthLabel: { fontWeight: '700', marginBottom: 4 },
  totalText: { fontWeight: '700', fontSize: 13, color: '#000' },
  incomeText: { color: '#007AFF', fontSize: 11 },
  expenseText: { color: '#FF3B30', fontSize: 11 },

  // 일별 카드
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#D9D9D9',
    borderRadius: 16,
    width: '48%',
    padding: 16,
    marginBottom: 12,
  },

  // 하단탭바 그대로
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 20,
    marginHorizontal: 10,
    marginBottom: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  tabText: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
  },
});
