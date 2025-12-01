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

  const [daySummary, setDaySummary] = useState({});
  const [monthSummary, setMonthSummary] = useState({});
  const [yearSummary, setYearSummary] = useState({
    income: 0,
    expense: 0,
    total: 0,
  });

  const getMonthStats = (month) => {
    const data = monthSummary[month];
    if (!data) return { income: 0, expense: 0, total: 0 };
    return {
      income: data.income ?? 0,
      expense: data.expense ?? 0,
      total: data.total ?? 0,
    };
  };

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

  const loadAllSummaries = async () => {
    const year = baseDate.year();
    await loadMonthSummary(year);
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      loadAllSummaries();
      const year = baseDate.year();
      const month = baseDate.month() + 1;
      loadDaySummary(year, month, daysOfWeek);
    });
    return unsub;
  }, [baseDate, daysOfWeek]);

  useEffect(() => {
    loadYearSummary(monthSummary);
  }, [monthSummary]);
  useEffect(() => {
    loadAllSummaries();
  }, [baseDate]);

  useEffect(() => {
    const year = baseDate.year();
    const month = baseDate.month() + 1;
    if (daysOfWeek.length > 0) loadDaySummary(year, month, daysOfWeek);
  }, [daysOfWeek]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header — 내역 + 우측 상단 토글 */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.navigate('Home')}>
          <Ionicons name="chevron-back" size={26} color="#BFBFBF" />
        </Pressable>

        <Text style={styles.headerTitle}>내역</Text>

        {/* 🔥 오른쪽 상단 토글 */}
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
              주별
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

      {/* 두 번째 줄 — 날짜 + 화살표 */}
      <View style={styles.dateRow}>
        <Pressable
          onPress={() => (mode === 'day' ? moveWeek(-1) : moveYear(-1))}
          style={styles.arrowArea}
        >
          <Ionicons name="chevron-back-outline" size={22} color="#CFE8E4" />
        </Pressable>

        <Text style={styles.dateText}>
          {mode === 'day'
            ? `${weekRange.startOfWeek.format(
                'YYYY.MM.DD'
              )}~${weekRange.endOfWeek.format('YYYY.MM.DD')}`
            : `${year}년`}
        </Text>

        <Pressable
          onPress={() => (mode === 'day' ? moveWeek(1) : moveYear(1))}
          style={styles.arrowArea}
        >
          <Ionicons name="chevron-forward-outline" size={22} color="#CFE8E4" />
        </Pressable>
      </View>

      {/* Month View */}
      {mode === 'month' && (
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          <View style={styles.yearCard}>
            <Text style={styles.yearTitle}>{year}년 전체</Text>
            <Text style={styles.yearText}>
              수입: {yearSummary.income.toLocaleString()}원
            </Text>
            <Text style={styles.yearText}>
              지출: {yearSummary.expense.toLocaleString()}원
            </Text>
            <Text style={styles.yearText}>
              합계: {yearSummary.total.toLocaleString()}원
            </Text>
          </View>

          <View style={styles.monthGrid}>
            {months.map((m) => {
              const stats = getMonthStats(m.key);
              return (
                <View key={m.key} style={styles.monthBox}>
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
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* Day View */}
      {mode === 'day' && (
        <ScrollView contentContainerStyle={styles.dayContainer}>
          {daysOfWeek.map((d) => (
            <Pressable
              key={d.key}
              style={styles.dayCard}
              onPress={() =>
                navigation.navigate('HistoryDetail', { selectedDate: d.key })
              }
            >
              <View style={styles.cardRow}>
                <Ionicons name="logo-usd" size={26} color="#1FBF74" />
                <View style={{ marginLeft: 8 }}>
                  <Text
                    style={[
                      styles.dayLabel,
                      d.label.includes('(일)') && { color: '#FF6A6A' },
                    ]}
                  >
                    {d.label}
                  </Text>

                  <Text style={styles.cardText}>
                    수입 : {daySummary[d.key]?.income?.toLocaleString() ?? 0}원
                  </Text>
                  <Text style={styles.cardText}>
                    지출 : {daySummary[d.key]?.expense?.toLocaleString() ?? 0}원
                  </Text>
                  <Text style={styles.cardText}>
                    합계 : {daySummary[d.key]?.total?.toLocaleString() ?? 0}원
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* 하단 탭바 */}
      <View style={styles.tabBar}>
        <Pressable
          onPress={() => navigation.navigate('Home')}
          style={styles.tabItem}
        >
          <Ionicons name="home" size={22} color="#F4F8F7" />
          <Text style={styles.tabLabelActive}>메인</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('Motivation')}
          style={styles.tabItem}
        >
          <Ionicons name="heart" size={22} color="#9FB8B3" />
          <Text style={styles.tabLabel}>목표</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('History')}
          style={styles.tabItem}
        >
          <Ionicons name="stats-chart" size={22} color="#9FB8B3" />
          <Text style={styles.tabLabel}>내역</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('Assets')}
          style={styles.tabItem}
        >
          <Ionicons name="wallet-outline" size={22} color="#9FB8B3" />
          <Text style={styles.tabLabel}>자산</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
const TEXT_MAIN = '#BFBFBF';
const TEXT_SUB = '#FFFFFF';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#022326',
  },
  /* 첫 줄: 내역 + 토글 */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  headerTitle: {
    color: '#BFBFBF',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: -200,
  },

  /* 날짜 줄 */
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#184346',
  },

  dateText: {
    flex: 1,
    textAlign: 'center',
    color: '#CFE8E4',
    fontSize: 15,
    fontWeight: '700',
  },

  arrowArea: {
    width: 150,
    alignItems: 'center',
  },

  /* 우측 토글 버튼 */
  modeButtons: {
    flexDirection: 'row',
    backgroundColor: '#123A3E',
    padding: 4,
    borderRadius: 20,
  },

  modeButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
  },

  modeButtonActive: {
    backgroundColor: '#1FBF74',
  },

  modeButtonText: {
    color: '#A0AFAF',
    fontWeight: '700',
  },

  modeButtonTextActive: {
    color: '#0B2A2D',
  },

  /* Month */
  yearCard: {
    backgroundColor: '#134246',
    padding: 16,
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 16,
  },
  yearTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 6,
  },
  yearText: {
    color: '#CFE8E4',
    fontSize: 14,
  },

  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  monthBox: {
    width: '30%',
    backgroundColor: '#134246',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
  },
  monthLabel: {
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    fontSize: 15,
  },
  totalText: { fontWeight: '700', color: '#CFE8E4' },
  incomeText: { color: '#8DD9C4', fontSize: 12, marginTop: 4 },
  expenseText: { color: '#FF8A85', fontSize: 12 },

  /* Day mode */
  dayContainer: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  dayCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1D4F52',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dayLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 4,
  },
  cardText: {
    color: '#CFE8E4',
    fontSize: 13,
    marginTop: 2,
  },

  /******** Tab bar ********/
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 68,
    paddingBottom: 8,
    paddingTop: 6,
    backgroundColor: '#061D1D', // 진한 다크그린
    borderTopWidth: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    marginTop: 2,
    fontSize: 11,
    color: TEXT_SUB,
  },
  tabLabelActive: {
    marginTop: 2,
    fontSize: 11,
    color: TEXT_MAIN,
    fontWeight: '700',
  },
});
