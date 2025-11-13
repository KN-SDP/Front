import React, { useState, useMemo, useCallback, useEffect } from 'react';
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

import AuthService from './AuthService';

dayjs.locale('ko');

export default function History({ navigation }) {
  const [baseDate, setBaseDate] = useState(dayjs());
  const [mode, setMode] = useState('day');

  // 요약 데이터 상태
  const [daySummary, setDaySummary] = useState({});
  const [monthSummary, setMonthSummary] = useState({});
  const [yearSummary, setYearSummary] = useState({
    income: 0,
    expense: 0,
    total: 0,
  });

  // 월별 카드에서 사용되는 getter
  const getMonthStats = (month) => {
    const data = monthSummary[month];
    if (!data) return { income: 0, expense: 0, total: 0 };
    return {
      income: data.income ?? 0,
      expense: data.expense ?? 0,
      total: data.total ?? 0,
    };
  };

  // 🔥 올해 전체 합계 계산
  const loadYearSummary = () => {
    let totalIncome = 0;
    let totalExpense = 0;

    Object.values(monthSummary).forEach((m) => {
      totalIncome += m.income;
      totalExpense += m.expense;
    });

    setYearSummary({
      income: totalIncome,
      expense: totalExpense,
      total: totalIncome - totalExpense,
    });
  };

  // 🔥 월별 요약
  const loadMonthSummary = async (year) => {
    try {
      const promises = [];
      for (let m = 1; m <= 12; m++) {
        promises.push(AuthService.getLedgerByMonth(year, m));
      }

      const results = await Promise.all(promises);
      const summary = {};

      for (let i = 0; i < 12; i++) {
        const month = i + 1;
        const res = results[i];
        if (res.success && Array.isArray(res.data)) {
          let income = 0;
          let expense = 0;

          res.data.forEach((t) => {
            if (t.type === 'INCOME') income += t.amount;
            else if (t.type === 'EXPENSE') expense += t.amount;
          });

          summary[month] = {
            income,
            expense,
            total: income - expense,
          };
        } else {
          summary[month] = { income: 0, expense: 0, total: 0 };
        }
      }

      setMonthSummary(summary);
    } catch (err) {
      console.error('❌ loadMonthSummary Error:', err);
    }
  };

  // 🔥 일별 요약 (이번 주)
  const loadDaySummary = async (year, month, daysOfWeek) => {
    const res = await AuthService.getLedgerByMonth(year, month);
    const data = res.success ? res.data : [];
    const summary = {};

    daysOfWeek.forEach((d) => {
      const daily = data.filter((t) => t.date === d.key);
      let income = 0;
      let expense = 0;

      daily.forEach((t) => {
        if (t.type === 'INCOME') income += t.amount;
        else if (t.type === 'EXPENSE') expense += t.amount;
      });

      summary[d.key] = {
        income,
        expense,
        total: income - expense,
      };
    });

    setDaySummary(summary);
  };

  // ============= 날짜 계산 =============

  const moveWeek = useCallback((offset) => {
    setBaseDate((prev) => prev.add(offset, 'week'));
  }, []);

  const moveYear = (offset) => {
    setBaseDate((prev) => prev.add(offset, 'year'));
  };

  const year = baseDate.year();

  const getWeekRange = useCallback((date) => {
    const startOfWeek = date.startOf('week').add(1, 'day');
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

  // 🔥 daysOfWeek는 반드시 useEffect보다 위에 있어야 함!
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

  const months = useMemo(() => {
    const arr = [];
    for (let i = 1; i <= 12; i++) arr.push({ key: i, label: `${i}월` });
    return arr;
  }, []);
  // ============= 날짜 계산 끝 → 여기까지 위로!! ==========

  // 🔥 전체 로드 (월 요약만 불러옴)
  const loadAllSummaries = async () => {
    const year = baseDate.year();
    await loadMonthSummary(year);
  };

  // 화면에 돌아올 때마다 최신값 로딩
  useEffect(() => {
    const unsub = navigation.addListener('focus', loadAllSummaries);
    return unsub;
  }, [baseDate]);

  // 월 요약이 바뀌면 연도 총합 갱신
  useEffect(() => {
    loadYearSummary(monthSummary);
  }, [monthSummary]);

  // 🔥 NEW: daysOfWeek가 바뀌면 일별 요약 다시 로드 (핵심)
  useEffect(() => {
    const year = baseDate.year();
    const month = baseDate.month() + 1;

    if (daysOfWeek.length > 0) {
      loadDaySummary(year, month, daysOfWeek);
    }
  }, [daysOfWeek]);

  // ============= 렌더 =============
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Smart Ledger</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 상단 옵션 */}
      <View style={styles.subHeader}>
        <Pressable
          onPress={() => (mode === 'day' ? moveWeek(-1) : moveYear(-1))}
        >
          <Ionicons name="chevron-back-outline" size={20} />
        </Pressable>

        <Text style={styles.subHeaderText}>
          {mode === 'day'
            ? `${weekInfo.year}년 ${weekInfo.month}월 ${weekInfo.weekOfMonth}주차`
            : `${year}년`}
        </Text>

        <Pressable onPress={() => (mode === 'day' ? moveWeek(1) : moveYear(1))}>
          <Ionicons name="chevron-forward-outline" size={20} />
        </Pressable>

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

      {/* 월별 */}
      {mode === 'month' && (
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          {/* 연도합계 */}
          <View style={styles.summaryCard}>
            <Text style={styles.cardTitle}>{year}년 전체</Text>
            <Text style={styles.cardText}>
              수입: {yearSummary.income.toLocaleString()}원
            </Text>
            <Text style={styles.cardText}>
              지출: {yearSummary.expense.toLocaleString()}원
            </Text>
            <Text style={styles.cardText}>
              합계: {yearSummary.total.toLocaleString()}원
            </Text>
          </View>

          {/* 월 grid */}
          <View style={styles.monthGrid}>
            {months.map((m) => {
              const stats = getMonthStats(m.key);

              return (
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
                  <Text style={styles.totalText}>
                    합계: {stats.total.toLocaleString()}원
                  </Text>
                  <Text style={styles.incomeText}>
                    수입: {stats.income.toLocaleString()}
                  </Text>
                  <Text style={styles.expenseText}>
                    지출: {stats.expense.toLocaleString()}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* 일별 */}
      {mode === 'day' && (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {daysOfWeek.map((d) => (
            <Pressable
              key={d.key}
              style={styles.card}
              onPress={() =>
                navigation.navigate('HistoryDetail', { selectedDate: d.key })
              }
            >
              <Text style={styles.cardTitle}>{d.label}</Text>
              <Text style={styles.cardText}>
                수입: {daySummary[d.key]?.income?.toLocaleString() ?? 0}원
              </Text>
              <Text style={styles.cardText}>
                지출: {daySummary[d.key]?.expense?.toLocaleString() ?? 0}원
              </Text>
              <Text style={styles.cardText}>
                합계: {daySummary[d.key]?.total?.toLocaleString() ?? 0}원
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* 하단 탭 */}
      <View style={styles.bottomTab}>
        <Pressable style={styles.tabItem} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
          <Text style={styles.tabText}>뒤로가기</Text>
        </Pressable>

        <Pressable
          style={styles.tabItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="wallet-outline" size={24} />
          <Text style={styles.tabText}>가계부 메인</Text>
        </Pressable>

        <Pressable style={styles.tabItem}>
          <Ionicons name="share-social-outline" size={24} />
          <Text style={styles.tabText}>공유</Text>
        </Pressable>

        <Pressable style={styles.tabItem}>
          <Ionicons name="document-text-outline" size={24} />
          <Text style={styles.tabText}>분석</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /* 기존 너 코드 그대로 유지됨 */
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
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
  subHeaderText: { fontSize: 16, fontWeight: '700', marginHorizontal: 8 },

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
    aspectRatio: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  monthLabel: { fontWeight: '700', marginBottom: 4 },
  totalText: { fontSize: 13, fontWeight: '700' },
  incomeText: { fontSize: 11, color: '#007AFF' },
  expenseText: { fontSize: 11, color: '#FF3B30' },

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
  cardTitle: { fontWeight: '700', fontSize: 15, marginBottom: 6 },
  cardText: { fontSize: 14, marginVertical: 2 },

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
  tabText: { marginTop: 4, fontSize: 13, fontWeight: '700' },
});
