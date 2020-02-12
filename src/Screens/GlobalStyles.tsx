import { StyleSheet, Platform, Dimensions } from 'react-native';

export const screenWidth = Math.round(Dimensions.get('window').width);
export const screenHeight = Math.round(Dimensions.get('window').height);
export default StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    backgroundColor: '#08386D',
    paddingTop: Platform.OS === 'android' ? 25 : 0
  },
  header: {
    flex: 2,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#08386D',
    width: '100%',
    height: 30
  }
});
