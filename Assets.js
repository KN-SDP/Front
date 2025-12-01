import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import AuthService from './AuthService';

export default function Assets({ navigation }) {
  const [loading, setLoading] = useState(true);

  const [totalAssets, setTotalAssets] = useState(0);
  const [changeRate, setChangeRate] = useState(0);
  const [changeAmount, setChangeAmount] = useState(0);

  const [assetsDetail, setAssetsDetail] = useState([
    { name: '현금', key: 'CASH', value: 0, icon: 'cash-outline' },
    { name: '은행', key: 'BANK', value: 0, icon: 'home-outline' },
    { name: '코인', key: 'COIN', value: 0, icon: 'logo-bitcoin' },
    { name: '주식', key: 'STOCK', value: 0, icon: 'trending-up-outline' },
  ]);

  // -------------------------------------------------------
  // 🔥 자산 불러오기
  // -------------------------------------------------------
  const loadAssets = async () => {
    setLoading(true);

    const res = await AuthService.getAssetSummary();

    if (res.success && res.data) {
      const summary = res.data;

      setTotalAssets(summary.totalAmount || 0);
      setChangeRate(summary.changeRate || 0);
      setChangeAmount(summary.changeAmount || 0);

      // details 매핑
      setAssetsDetail((prev) =>
        prev.map((item) => ({
          ...item,
          value: summary.details?.[item.key] || 0,
        }))
      );
    } else {
      // 자산 없을 때 → 자동 0
      setTotalAssets(0);
      setChangeRate(0);
      setChangeAmount(0);
      setAssetsDetail((prev) => prev.map((i) => ({ ...i, value: 0 })));
    }

    setLoading(false);
  };

  useEffect(() => {
    loadAssets();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadAssets();
    }, [])
  );

  const diffRate = changeRate?.toFixed(1) || 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* ---------------- 헤더 ---------------- */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#BFBFBF" />
        </Pressable>
        <Text style={styles.headerTitle}>총자산</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* ---------------- 총자산 박스 ---------------- */}
        <View style={styles.assetBox}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View>
              <Text style={styles.assetTitle}>총자산</Text>
              <Text style={styles.assetAmount}>
                {totalAssets.toLocaleString()}원
              </Text>
              <Text style={styles.assetSub}>
                전일 대비 {changeAmount >= 0 ? '+' : ''}
                {changeAmount.toLocaleString()}원
              </Text>
            </View>

            <Pressable
              style={styles.addBtn}
              onPress={() => navigation.navigate('AddAssets')}
            >
              <Text style={styles.addBtnText}>추가하기 +</Text>
            </Pressable>
          </View>

          <Text style={styles.assetRate}>{diffRate}%</Text>
        </View>

        {/* ---------------- 상세조회 ---------------- */}
        <View style={styles.detailBox}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailTitle}>상세조회</Text>
            <Text style={styles.detailSub}>전체 비율</Text>
          </View>

          {assetsDetail.map((item, idx) => (
            <View key={idx} style={styles.detailItem}>
              <View style={styles.detailLeft}>
                <Ionicons name={item.icon} size={26} color="#CFE8E4" />
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.detailName}>{item.name}</Text>
                  <Text style={styles.detailValue}>
                    {item.value.toLocaleString()}원
                  </Text>
                </View>
              </View>

              <Text style={styles.detailRate}>
                {totalAssets > 0
                  ? ((item.value / totalAssets) * 100).toFixed(0)
                  : 0}
                %
              </Text>
            </View>
          ))}
        </View>

        {/* ---------------- 자산 이력 조회 ---------------- */}
        <Pressable
          style={styles.historyBtn}
          onPress={() => navigation.navigate('AssetHistory')}
        >
          <Text style={styles.historyBtnText}>자산 이력 조회</Text>
        </Pressable>
      </ScrollView>

      {/* ---------------- 하단 탭바 ---------------- */}
      <View style={styles.bottomTab}>
        <Pressable
          style={styles.tabItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home" size={22} color="#9FB8B3" />
          <Text style={styles.tabLabel}>메인</Text>
        </Pressable>

        <Pressable
          style={styles.tabItem}
          onPress={() => navigation.navigate('Motivation')}
        >
          <Ionicons name="heart" size={22} color="#9FB8B3" />
          <Text style={styles.tabLabel}>목표</Text>
        </Pressable>

        <Pressable
          style={styles.tabItem}
          onPress={() => navigation.navigate('History')}
        >
          <Ionicons name="stats-chart" size={22} color="#9FB8B3" />
          <Text style={styles.tabLabel}>내역</Text>
        </Pressable>

        <Pressable style={styles.tabItem}>
          <Ionicons name="wallet-outline" size={22} color="#F4F8F7" />
          <Text style={styles.tabLabelActive}>자산</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#022326',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#BFBFBF',
  },

  /* 총자산 박스 */
  assetBox: {
    backgroundColor: '#053535',
    margin: 16,
    padding: 18,
    borderRadius: 18,
  },
  assetTitle: {
    color: '#CFE8E4',
    fontSize: 14,
  },
  assetAmount: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 4,
  },
  assetSub: {
    color: '#8FA7A5',
    marginTop: 6,
  },
  assetRate: {
    position: 'absolute',
    bottom: 18,
    right: 18,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },

  addBtn: {
    backgroundColor: '#022F2F',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6DC2B3',
    height: 34,
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#CFE8E4',
    fontWeight: '700',
  },

  /* 상세조회 */
  detailBox: {
    backgroundColor: '#053535',
    marginHorizontal: 16,
    marginTop: 6,
    padding: 14,
    borderRadius: 18,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  detailTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  detailSub: {
    color: '#9FB8B3',
    fontSize: 13,
  },

  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#184346',
  },

  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  detailValue: {
    color: '#9FB8B3',
    fontSize: 13,
    marginTop: 2,
  },

  detailRate: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    marginRight: 6,
  },

  /* 이력 조회 버튼 */
  historyBtn: {
    marginTop: 24,
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#CFE8E4',
    alignItems: 'center',
  },
  historyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },

  /* 하단 탭 */
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 68,
    paddingBottom: 8,
    paddingTop: 6,
    backgroundColor: '#061D1D',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  tabItem: {
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 11,
    color: '#9FB8B3',
    marginTop: 2,
  },
  tabLabelActive: {
    fontSize: 11,
    color: '#F4F8F7',
    marginTop: 2,
    fontWeight: '700',
  },
});
