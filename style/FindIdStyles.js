// FindIdStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },

  /* 헤더 */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  /* 폼 */
  form: {
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    marginBottom: 24,
    paddingVertical: 6,
    fontSize: 16,
  },

  /* 버튼 */
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  /* 푸터 */
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 'auto',
    gap: 20,
  },
  footerText: {
    color: '#000',
    fontSize: 13,
  },

  /* 에러 메시지 */
  errorText: {
    color: 'red',
    marginBottom: 16,
    fontSize: 14,
  },
});
