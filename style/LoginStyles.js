// style/LoginStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  logoTop: {
    fontSize: 40,
    fontWeight: '800',
    textAlign: 'center',
    color: '#000',
  },
  logoBottom: {
    fontSize: 40,
    fontWeight: '800',
    textAlign: 'center',
    color: '#000',
    marginBottom: 30,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    color: '#000',
  },
  inputWrap: {
    borderBottomWidth: 1,
    borderColor: '#aaa',
    marginBottom: 16,
  },
  inputRow: {
    borderBottomWidth: 1,
    borderColor: '#aaa',
    marginBottom: 16,
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    fontSize: 15,
    paddingVertical: 8,
    color: '#000',
  },
  eyeBtn: {
    position: 'absolute',
    right: 0,
    bottom: 4,
    padding: 8,
  },
  eyeIcon: { fontSize: 18, color: '#000' },
  errorText: { color: '#d00', marginTop: 10 },
  submitBtn: {
    marginTop: 10,
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  linkText: { fontSize: 13, color: '#000' },
  divider: {
    width: 1,
    height: 14,
    backgroundColor: '#ccc',
    marginHorizontal: 12,
  },
  orText: { textAlign: 'center', marginVertical: 16, color: '#000' },
  snsBtn: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  snsText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { fontSize: 12, color: '#000' },
  footerDivider: { width: 12 },
});
