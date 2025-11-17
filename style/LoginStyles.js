// style/LoginStyles.js
import { StyleSheet } from 'react-native';

export const GRADIENT_COLORS = [
  '#022326', // top
  '#034040',
  '#035951',
  '#02735E', // bottom
];

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  /** 중앙 컨텐츠 */
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },

  /** SMART LEDGER 제목 */
  logoTop: {
    fontSize: 70,
    fontWeight: '800',
    textAlign: 'center',
    color: '#02735E',
    paddingTop: 100,
  },
  logoBottom: {
    fontSize: 70,
    fontWeight: '800',
    textAlign: 'center',
    color: '#02735E',
    marginBottom: 40,
  },

  /** INPUT LABEL */
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
    color: '#BFBFBF',
    alignSelf: 'flex-start',
  },

  /** INPUT BOX */
  inputWrap: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#BFBFBF',
    marginBottom: 20,
  },
  inputRow: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#BFBFBF',
    marginBottom: 20,
  },

  input: {
    fontSize: 16,
    paddingVertical: 10,
    color: '#BFBFBF',
    outlineStyle: 'none',
    outlineWidth: 0,
    outlineColor: 'transparent',
  },

  /** 에러 메시지 */
  errorText: {
    color: '#FF6B6B',
    marginTop: 6,
    fontSize: 13,
  },

  /** 로그인 버튼 */
  submitBtn: {
    marginTop: 20,
    backgroundColor: '#02735E',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  submitText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },

  /** 회원가입 | ID 찾기 | PW 찾기 */
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 100,
  },
  linkText: {
    fontSize: 14,
    color: '#BFBFBF',
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: '#BFBFBF',
    marginHorizontal: 12,
  },

  /** SNS */
  snsBtn: {
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  snsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
