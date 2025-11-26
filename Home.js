// Home.js (새 디자인 적용 버전)
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Animated,
  TouchableWithoutFeedback,
  useWindowDimensions,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import AuthService from './AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home({ navigation }) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const SIDEBAR_WIDTH = SCREEN_WIDTH;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const [sidebarTab, setSidebarTab] = useState('가계부');
  // ✅ 목표 / 월 합계 상태
  const [goals, setGoals] = useState([]);
  const [goalLoading, setGoalLoading] = useState(true);
  const [monthIncome, setMonthIncome] = useState(0);
  const [monthExpense, setMonthExpense] = useState(0);
  const [monthTotal, setMonthTotal] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await AuthService.getCurrentUser();
        if (!mounted) return;
        setUser(u);
        await loadGoals();
        await loadMonthTotal();
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

  // 화면 다시 포커스될 때마다 새로고침
  useEffect(() => {
    const unsub = navigation.addListener('focus', async () => {
      await loadGoals();
      await loadMonthTotal();
    });
    return unsub;
  }, [navigation]);

  // 화면 크기 변할 때 사이드바 위치 조정
  useEffect(() => {
    sidebarAnim.setValue(sidebarVisible ? 0 : -SIDEBAR_WIDTH);
  }, [SIDEBAR_WIDTH]);

  const loadGoals = async () => {
    try {
      const res = await AuthService.getGoals();
      if (res.success) setGoals(res.data);
    } catch (err) {
      console.error('목표 불러오기 실패:', err);
    }
  };

  const loadMonthTotal = async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const res = await AuthService.getMonthTotal(year, month);
    if (res.success) {
      setMonthIncome(res.income);
      setMonthExpense(res.expense);
      setMonthTotal(res.total);
    }
  };

  const toggleSidebar = () => {
    if (sidebarVisible) {
      Animated.timing(sidebarAnim, {
        toValue: -SIDEBAR_WIDTH,
        duration: 280,
        useNativeDriver: true,
      }).start(() => setSidebarVisible(false));
    } else {
      setSidebarVisible(true);
      Animated.timing(sidebarAnim, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }).start();
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#F4F8F7" />
      </View>
    );
  }

  const now = new Date();
  const monthLabel = `${now.getMonth() + 1}월 가계 내역`;

  return (
    <View style={styles.screen}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={toggleSidebar} style={styles.headerIconBtn}>
          <Ionicons name="menu" size={26} color="#F4F8F7" />
        </Pressable>

        <Text style={styles.headerTitle}>Smart Ledger</Text>

        <Pressable
          onPress={() => console.log('Alarm clicked')}
          style={styles.headerIconBtn}
        >
          <Ionicons name="notifications-outline" size={24} color="#F4F8F7" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollInner}
      >
        {/* 11월 가계 내역 + 월 요약 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{monthLabel}</Text>

          {/* 수입 / 지출 카드 */}
          <View style={styles.row}>
            <View style={[styles.summaryCard, styles.incomeCard]}>
              <View style={styles.summaryCardHeader}>
                <Ionicons name="arrow-up" size={18} color="#FF736A" />
                <Text style={styles.summaryLabel}>수입 내역</Text>
              </View>
              <Text style={styles.summaryAmount}>
                +{monthIncome.toLocaleString()}원
              </Text>
            </View>

            <View style={[styles.summaryCard, styles.expenseCard]}>
              <View style={styles.summaryCardHeader}>
                <Ionicons name="arrow-down" size={18} color="#4D9DFF" />
                <Text style={styles.summaryLabel}>지출 내역</Text>
              </View>
              <Text style={styles.summaryAmount}>
                -{monthExpense.toLocaleString()}원
              </Text>
            </View>
          </View>

          {/* 합계 버튼 */}
          <Pressable
            style={styles.totalButton}
            onPress={() => navigation.navigate('History')}
          >
            <View style={styles.totalButtonLeft}>
              <Ionicons name="logo-usd" size={16} color="#0D2D25" />
              <Text style={styles.totalButtonLabel}>이번 달 합계</Text>
            </View>
            <Text style={styles.totalButtonAmount}>
              {monthTotal.toLocaleString()}원
            </Text>
            <Ionicons
              name="chevron-forward-outline"
              size={18}
              color="#0D2D25"
            />
          </Pressable>
        </View>

        {/* 뉴스 카드 (이미지 영역 + 텍스트) */}
        <Pressable
          style={styles.newsCard}
          onPress={() => Linking.openURL('https://blog.hanabank.com/1338')}
        >
          <View style={styles.newsImageWrap}>
            <Image
              source={require('./assets/news_sample.png')}
              style={styles.newsImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.newsTextWrap}>
            <Text style={styles.newsTag}>데일리 뉴스</Text>
            <Text style={styles.newsTitle} numberOfLines={2}>
              부자들은 가계부 어떻게 쓸까? 숫자보다는 흐름이 중요!
            </Text>
            <Text style={styles.newsMeta} numberOfLines={1}>
              by 하나은행 · 2019. 11. 4.
            </Text>
          </View>
        </Pressable>

        {/* 자동 결제 알림 */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>자동결제 알림</Text>
            <Pressable onPress={() => navigation.navigate('AutoPay')}>
              <Ionicons
                name="chevron-forward-outline"
                size={18}
                color="#9FB8B3"
              />
            </Pressable>
          </View>

          {[
            '넷플릭스 자동 결제',
            '핸드폰 통신 요금 자동 결제',
            '자취방 월세 자동 이체',
            '월급 예정일',
          ].map((label, idx) => {
            const d =
              idx === 0 || idx === 1 ? 'D-2' : idx === 2 ? 'D-3' : 'D-4';
            return (
              <View key={idx} style={styles.autoPayRow}>
                <Text style={styles.autoPayLabel} numberOfLines={1}>
                  {label}
                </Text>
                <View style={styles.autoPayDDayBadge}>
                  <Text style={styles.autoPayDDayText}>{d}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* 목표 현황 */}
        <View style={[styles.section, { marginBottom: 70 }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { marginTop: -15 }]}>
              목표 현황
            </Text>
            <Pressable onPress={() => navigation.navigate('Motivation')}>
              <Ionicons
                name="chevron-forward-outline"
                size={18}
                color="#9FB8B3"
              />
            </Pressable>
          </View>

          {goalLoading ? (
            <ActivityIndicator size="small" color="#F4F8F7" />
          ) : goals.length === 0 ? (
            <Text style={styles.emptyText}>등록된 목표가 없습니다.</Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.goalScrollInner}
            >
              {goals.map((item) => (
                <View key={item.goalId} style={styles.goalCard}>
                  <View style={styles.goalThumb} />
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.goalAmount}>
                      {item.targetAmount.toLocaleString()}원
                    </Text>
                    <Text style={styles.goalProgress}>
                      달성률 {Math.round(item.progressRate * 100)}%
                    </Text>
                    {item.deadline ? (
                      <Text style={styles.goalDeadline} numberOfLines={1}>
                        {item.deadline}까지
                      </Text>
                    ) : null}
                  </View>
                </View>
              ))}

              {/* + 버튼 카드 */}
              <Pressable
                style={styles.addGoalCard}
                onPress={() => navigation.navigate('AddMotivation')}
              >
                <Ionicons name="add" size={32} color="#0D2D25" />
              </Pressable>
            </ScrollView>
          )}
        </View>
      </ScrollView>

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

      {/* 사이드바 오버레이 */}
      {sidebarVisible && (
        <TouchableWithoutFeedback onPress={toggleSidebar}>
          <View style={styles.sidebarOverlay} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View
        style={[
          styles.sidebarNew,
          { width: SIDEBAR_WIDTH, transform: [{ translateX: sidebarAnim }] },
        ]}
      >
        {/* 상단 X + 타이틀 */}
        <View style={styles.sidebarTopRow}>
          <Pressable onPress={toggleSidebar}>
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.sidebarTitleNew}>나의 Smart Ledger</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* 환영 메시지 */}
        <View style={styles.sidebarWelcomeBox}>
          <View style={styles.sidebarWelcomeRow}>
            <Text style={styles.sidebarNickname}>
              {user?.nickname || '사용자'}
            </Text>
            <Text style={styles.sidebarWelcomeSuffix}>님 환영합니다.</Text>
          </View>
        </View>

        {/* 카테고리 탭 */}
        <View style={styles.sidebarTabs}>
          {['가계부', '목표', '자산', '기타'].map((tab, idx) => (
            <Pressable
              key={idx}
              style={[
                styles.sidebarTabItem,
                sidebarTab === tab && styles.sidebarTabActive,
              ]}
              onPress={() => setSidebarTab(tab)}
            >
              <Text
                style={[
                  styles.sidebarTabText,
                  sidebarTab === tab && styles.sidebarTabTextActive,
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* 카테고리별 컨텐츠 */}
        <ScrollView style={{ flex: 1 }}>
          {sidebarTab === '가계부' && (
            <View style={styles.sidebarGroup}>
              {[
                { label: '월별 가계부 보기', route: 'History' },
                { label: '일별 가계부 보기', route: 'History' },
                { label: '가계부 추가하기', route: 'HistoryDetail' },
                {
                  label: '카테고리별 가계부 조회하기',
                  route: 'CategoryLedger',
                },
              ].map((item, idx) => (
                <Pressable
                  key={idx}
                  style={styles.sidebarRow}
                  onPress={() => {
                    toggleSidebar();
                    navigation.navigate(item.route);
                  }}
                >
                  <Text style={styles.sidebarRowBullet}>•</Text>
                  <Text style={styles.sidebarRowText}>{item.label}</Text>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={16}
                    color="#BFBFBF"
                  />
                </Pressable>
              ))}
            </View>
          )}

          {sidebarTab === '목표' && (
            <View style={styles.sidebarGroup}>
              <Pressable
                style={styles.sidebarRow}
                onPress={() => {
                  toggleSidebar();
                  navigation.navigate('Motivation');
                }}
              >
                <Text style={styles.sidebarRowBullet}>•</Text>
                <Text style={styles.sidebarRowText}>나의 목표 보기</Text>
                <Ionicons
                  name="chevron-forward-outline"
                  size={16}
                  color="#BFBFBF"
                />
              </Pressable>

              <Pressable
                style={styles.sidebarRow}
                onPress={() => {
                  toggleSidebar();
                  navigation.navigate('AddMotivation');
                }}
              >
                <Text style={styles.sidebarRowBullet}>•</Text>
                <Text style={styles.sidebarRowText}>나의 목표 추가하기</Text>
                <Ionicons
                  name="chevron-forward-outline"
                  size={16}
                  color="#BFBFBF"
                />
              </Pressable>
            </View>
          )}

          {/* 자산 */}
          {sidebarTab === '자산' && (
            <View style={styles.sidebarGroup}>
              {[
                '총자산 조회하기',
                '현금 자산 추가/수정',
                '은행 자산 추가/수정',
                '코인 자산 추가/수정',
                '주식 자산 추가/수정',
                '자산 차트 분석도 보기',
              ].map((label, idx) => (
                <View key={idx} style={styles.sidebarRow}>
                  <Text style={styles.sidebarRowBullet}>•</Text>
                  <Text style={styles.sidebarRowText}>{label}</Text>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={16}
                    color="#BFBFBF"
                  />
                </View>
              ))}
            </View>
          )}

          {/* 기타 */}
          {sidebarTab === '기타' && (
            <View style={styles.sidebarGroup}>
              {[
                '자동 결제 설정',
                '자동 월급 설정',
                '카테고리별 한도 설정',
                '기간별 사용내역 조회',
              ].map((label, idx) => (
                <View key={idx} style={styles.sidebarRow}>
                  <Text style={styles.sidebarRowBullet}>•</Text>
                  <Text style={styles.sidebarRowText}>{label}</Text>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={16}
                    color="#BFBFBF"
                  />
                </View>
              ))}
            </View>
          )}
        </ScrollView>

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
      </Animated.View>
    </View>
  );
}

const BG = '#022326';
const CARD = '#034040';
const CARD_DARK = '#034040';
const ACCENT = '#3AC08A';
const TEXT_MAIN = '#BFBFBF';
const TEXT_SUB = '#FFFFFF';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
    paddingTop: 40,
  },
  loadingWrap: {
    flex: 1,
    backgroundColor: BG,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /******** Header ********/
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 10,
  },
  headerIconBtn: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: TEXT_MAIN,
  },

  /******** Scroll ********/
  scroll: {
    flex: 1,
  },
  scrollInner: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },

  /******** Sections ********/
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    marginTop: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  /******** Month summary ********/
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: CARD,
  },
  incomeCard: {
    marginRight: 8,
  },
  expenseCard: {
    marginLeft: 8,
  },
  summaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryLabel: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_SUB,
  },
  summaryAmount: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_MAIN,
  },
  totalButton: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ACCENT,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  totalButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  totalButtonLabel: {
    marginLeft: 6,
    color: '#0D2D25',
    fontSize: 13,
    fontWeight: '600',
  },
  totalButtonAmount: {
    marginRight: 8,
    color: '#0D2D25',
    fontWeight: '800',
    fontSize: 15,
  },

  /******** News card ********/
  newsCard: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: CARD_DARK,
    marginBottom: 15,
  },
  newsImageWrap: {
    height: 160,
    width: '100%',
    backgroundColor: '#25393A',
    overflow: 'hidden',
  },
  newsImage: {
    width: '100%',
    height: '100%',
  },
  newsTextWrap: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  newsTag: {
    fontSize: 11,
    color: '#B9CBC7',
    marginBottom: 6,
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  newsMeta: {
    fontSize: 11,
    color: '#8FA6A1',
  },

  /******** Auto pay ********/
  autoPayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  autoPayLabel: {
    flex: 1,
    color: TEXT_MAIN,
    fontSize: 13,
  },
  autoPayDDayBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#4C6561',
  },
  autoPayDDayText: {
    color: TEXT_SUB,
    fontSize: 11,
    fontWeight: '600',
  },

  emptyText: {
    textAlign: 'center',
    color: TEXT_SUB,
    fontSize: 13,
    marginTop: 8,
  },

  /******** Goals ********/
  goalScrollInner: {
    paddingVertical: 4,
  },
  goalCard: {
    width: 220,
    backgroundColor: CARD,
    borderRadius: 18,
    marginRight: 12,
    overflow: 'hidden',
  },
  goalThumb: {
    height: 90,
    backgroundColor: '#224140',
  },
  goalInfo: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  goalTitle: {
    color: TEXT_MAIN,
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 4,
  },
  goalAmount: {
    color: TEXT_SUB,
    fontSize: 12,
    marginBottom: 2,
  },
  goalProgress: {
    color: '#D9F2E8',
    fontSize: 12,
    marginBottom: 2,
  },
  goalDeadline: {
    color: '#90AAA5',
    fontSize: 11,
  },
  addGoalCard: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginLeft: 4,
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
    backgroundColor: '#061D1D',
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

  /******** Sidebar ********/
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sidebarNew: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#022326',
    paddingTop: 50,
    paddingHorizontal: 18,
  },

  sidebarTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  sidebarTitleNew: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  sidebarWelcomeBox: {
    backgroundColor: '#035951',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },

  sidebarWelcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },

  sidebarNickname: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  sidebarWelcomeSuffix: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },

  sidebarTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 0.8,
    borderColor: '#2D4D4A',
    paddingBottom: 6,
  },

  sidebarTabItem: {
    paddingVertical: 6,
  },

  sidebarTabText: {
    color: '#7DA09B',
    fontSize: 14,
    fontWeight: '600',
  },

  sidebarTabActive: {
    borderBottomWidth: 2,
    borderColor: '#3AC08A',
  },

  sidebarTabTextActive: {
    color: '#3AC08A',
  },

  sidebarGroup: {
    paddingVertical: 12,
  },

  sidebarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },

  sidebarRowBullet: {
    fontSize: 16,
    color: '#BFBFBF',
    marginRight: 8,
  },

  sidebarRowText: {
    flex: 1,
    color: '#BFBFBF',
    fontSize: 14,
  },

  sidebarBottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 18,
    borderTopWidth: 0.7,
    borderColor: '#035951',
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
