import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
dayjs.locale('ko');

export default function HistoryDetail({ route, navigation }) {
  const { selectedDate, selectedMonth, selectedYear } = route.params || {};
  const [showAddModal, setShowAddModal] = useState(false);
  const [mainType, setMainType] = useState('지출'); // 수입 / 지출
  const [subType, setSubType] = useState('이체'); // 이체 / 저축
  const [amount, setAmount] = useState('');

  const dateText = selectedDate
    ? dayjs(selectedDate).format('YYYY년 M월 D일 dddd')
    : `${selectedYear}년 ${selectedMonth}월`;

  // 예시 데이터
  const totalIncome = 1500000;
  const totalExpense = 500000;
  const balance = totalIncome - totalExpense;

  const transactions = [
    { id: 1, title: '강남대 재맞고 수당', amount: 1000000, time: '08:10' },
    { id: 2, title: '스타벅스', amount: -500000, time: '08:15' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* ===== 상단 헤더 ===== */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Smart Ledger</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* ===== 날짜 표시 ===== */}
      <Text style={styles.dateText}>{dateText}</Text>

      {/* ===== 합계 ===== */}
      <View style={styles.summaryBox}>
        <Text style={styles.balanceText}>{balance.toLocaleString()}원</Text>
        <Text style={styles.subText}>
          수입 : {totalIncome.toLocaleString()}원
        </Text>
        <Text style={styles.subText}>
          지출 : {totalExpense.toLocaleString()}원
        </Text>
      </View>

      {/* ===== 내역 리스트 ===== */}
      <ScrollView contentContainerStyle={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>전체</Text>

          {/* ➕ 버튼 */}
          <Pressable onPress={() => setShowAddModal(true)}>
            <Ionicons name="add-circle-outline" size={28} color="#000" />
          </Pressable>
        </View>

        {transactions.map((item) => (
          <View key={item.id} style={styles.listItem}>
            <View>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemTime}>{item.time}</Text>
            </View>
            <Text
              style={[
                styles.itemAmount,
                { color: item.amount > 0 ? '#007700' : '#cc0000' },
              ]}
            >
              {item.amount > 0 ? '+' : ''}
              {item.amount.toLocaleString()}원
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* ===== 바텀시트 모달 ===== */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* 닫기 화살표 */}
            <Pressable
              style={{ alignSelf: 'center', paddingVertical: 4 }}
              onPress={() => setShowAddModal(false)}
            >
              <Ionicons name="chevron-down" size={24} color="#000" />
            </Pressable>

            <Text style={styles.modalTitle}>이용내역 추가하기</Text>
            <Text style={styles.modalDate}>{dayjs().format('YYYY.MM.DD')}</Text>

            {/* 상단 타입 선택 */}
            <View style={styles.rowGroup}>
              {['수입', '지출'].map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setMainType(t)}
                  style={[
                    styles.typeButton,
                    mainType === t && styles.typeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.typeText,
                      mainType === t && styles.typeTextActive,
                    ]}
                  >
                    {t}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* 하위 타입 선택 */}
            <View style={styles.rowGroup}>
              {['이체', '저축'].map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setSubType(t)}
                  style={[
                    styles.typeButton,
                    subType === t && styles.typeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.typeText,
                      subType === t && styles.typeTextActive,
                    ]}
                  >
                    {t}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* 금액 입력 */}
            <Text style={styles.label}>금액</Text>
            <TextInput
              placeholder="예) 200,000"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              style={styles.input}
            />

            {/* 결제방식 (지출일 때만 표시) */}
            {mainType === '지출' && (
              <>
                <View style={styles.divider} />
                <Text style={styles.label}>결제방식</Text>
                <View style={styles.optionRow}>
                  {['현금', '카드', '상품권'].map((opt) => (
                    <Pressable key={opt} style={styles.optionTag}>
                      <Text>{opt}</Text>
                    </Pressable>
                  ))}
                </View>
              </>
            )}

            {/* 카테고리 */}
            <View style={styles.divider} />
            <Text style={styles.label}>
              카테고리({mainType === '지출' ? '지출' : '수입'})
            </Text>
            <View style={styles.optionWrap}>
              {(mainType === '지출'
                ? [
                    '비상금',
                    '주거',
                    '용돈',
                    '보험',
                    '통신비',
                    '식비',
                    '생활용품',
                    '패션',
                    '건강',
                    '자기계발',
                    '자동차',
                    '여행',
                    '문화생활',
                    '경조사',
                    '기타',
                  ]
                : ['월급', '상여', '부수입', '투자소득', '기타']
              ).map((c) => (
                <Pressable key={c} style={styles.optionTag}>
                  <Text>{c}</Text>
                </Pressable>
              ))}
            </View>

            {/* 작성 완료 */}
            <View style={styles.divider} />
            <Pressable
              style={styles.submitButton}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.submitText}>작성 완료</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ===== 하단 탭 ===== */}
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
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  dateText: { textAlign: 'center', marginTop: 8, fontWeight: '600' },
  summaryBox: {
    backgroundColor: '#D9D9D9',
    padding: 20,
    alignItems: 'center',
    marginVertical: 8,
  },
  balanceText: { fontSize: 22, fontWeight: '800' },
  subText: { fontSize: 14 },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  itemTitle: { fontWeight: '600' },
  itemTime: { fontSize: 12, color: '#777' },
  itemAmount: { fontWeight: '700' },

  /** === 모달 === */
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    minHeight: '75%',
  },
  modalTitle: { fontSize: 18, fontWeight: '800', textAlign: 'center' },
  modalDate: { textAlign: 'center', color: '#555', marginBottom: 10 },
  rowGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 4,
  },
  typeButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 8,
    backgroundColor: '#D9D9D9',
    borderRadius: 6,
  },
  typeActive: { backgroundColor: '#000' },
  typeText: { textAlign: 'center', color: '#000', fontWeight: '700' },
  typeTextActive: { color: '#fff' },
  label: { marginTop: 12, fontWeight: '700' },
  input: {
    borderBottomWidth: 1,
    borderColor: '#aaa',
    paddingVertical: 8,
    fontSize: 15,
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginVertical: 10,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  optionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  optionTag: {
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  submitButton: {
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 10,
  },
  submitText: { textAlign: 'center', color: '#fff', fontWeight: '700' },

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
  tabItem: { alignItems: 'center', flex: 1 },
  tabText: { marginTop: 4, fontSize: 13, fontWeight: '700', color: '#000' },
});
