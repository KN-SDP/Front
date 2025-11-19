// FindIdStyles.js (SignUp.js 스타일 통일)
import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  header: {
    width: '100%',
    paddingTop: 40,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backBtn: {
    padding: 6,
    marginRight: 4,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#BFBFBF',
  },

  form: {
    marginTop: 10,
    width: '100%',
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#BFBFBF',
    marginTop: 24,
    marginBottom: 6,
  },

  inputWrap: {
    borderBottomWidth: 1,
    borderColor: '#607072',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: Platform.OS === 'web' ? 4 : 2,
    color: '#BFBFBF',
    outlineStyle: 'none',
    outlineWidth: 0,
    outlineColor: 'transparent',
  },

  submitBtn: {
    marginTop: 450,
    backgroundColor: '#035951',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  submitText: {
    color: '#C8D7D3',
    fontSize: 16,
    fontWeight: '700',
  },

  errorText: {
    color: '#FF6B6B',
    marginBottom: 8,
    fontSize: 13,
  },
});
