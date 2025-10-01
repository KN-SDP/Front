// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// const PH = '#999';
// const CONTENT_MAX_WIDTH = 360;

// export default function FindId() {
//   const navigation = useNavigation();

//   const [name, setName] = useState('');
//   const [tel, setTel] = useState('');
//   const [birth, setBirth] = useState('');

//   const canSubmit = name.trim() && tel.trim() && birth.trim();

//   const onSubmit = () => {
//     if (!canSubmit) {
//       Alert.alert('알림', '모든 정보를 입력해주세요.');
//       return;
//     }
//     // ✅ 추후 API 연동
//     Alert.alert('ID 찾기', '입력한 정보로 ID를 찾습니다.');
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.select({ ios: 'padding', android: undefined })}
//       style={{ flex: 1, backgroundColor: '#fff' }}
//     >
//       <View
//         style={{
//           flex: 1,
//           alignItems: 'center',
//           paddingHorizontal: 16,
//           paddingTop: 60,
//         }}
//       >
//         <View style={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH }}>
//           {/* 🔙 상단 제목 */}
//           <View style={styles.headerRow}>
//             <Pressable onPress={() => navigation.goBack()}>
//               <Text style={styles.backArrow}>‹</Text>
//             </Pressable>
//             <Text style={styles.headerTitle}>ID 찾기</Text>
//           </View>

//           {/* ✅ 이름 */}
//           <Text style={styles.label}>이름</Text>
//           <View style={styles.inputWrap}>
//             <TextInput
//               value={name}
//               onChangeText={setName}
//               style={styles.input}
//               placeholder=""
//               placeholderTextColor={PH}
//             />
//           </View>

//           {/* ✅ 전화번호 */}
//           <Text style={styles.label}>Tel</Text>
//           <View style={styles.inputWrap}>
//             <TextInput
//               value={tel}
//               onChangeText={setTel}
//               style={styles.input}
//               placeholder="전화번호를 입력하세요."
//               placeholderTextColor={PH}
//               keyboardType="phone-pad"
//             />
//           </View>

//           {/* ✅ 생년월일 */}
//           <Text style={styles.label}>생년월일</Text>
//           <View style={styles.inputWrap}>
//             <TextInput
//               value={birth}
//               onChangeText={setBirth}
//               style={styles.input}
//               placeholder="yyyy/mm/dd"
//               placeholderTextColor={PH}
//             />
//           </View>

//           {/* ✅ 버튼 */}
//           <Pressable
//             style={[styles.submitBtn, { opacity: canSubmit ? 1 : 0.5 }]}
//             disabled={!canSubmit}
//             onPress={onSubmit}
//           >
//             <Text style={styles.submitText}>ID 찾기</Text>
//           </Pressable>

//           {/* ✅ 하단 */}
//           <View style={styles.footerRow}>
//             <Text style={styles.footerText}>이용약관</Text>
//             <View style={styles.footerDivider} />
//             <Text style={styles.footerText}>개인정보처리방침</Text>
//           </View>
//         </View>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = {
//   headerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 60,
//   },
//   backArrow: {
//     fontSize: 26,
//     color: '#000',
//     marginRight: 6,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#000',
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#000',
//     marginBottom: 6,
//   },
//   inputWrap: {
//     borderBottomWidth: 1,
//     borderColor: '#aaa',
//     marginBottom: 20,
//   },
//   input: {
//     fontSize: 15,
//     paddingVertical: 8,
//     color: '#000',
//   },
//   submitBtn: {
//     backgroundColor: '#000',
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   submitText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   footerRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 40,
//   },
//   footerText: {
//     fontSize: 12,
//     color: '#000',
//   },
//   footerDivider: {
//     width: 12,
//   },
// };
