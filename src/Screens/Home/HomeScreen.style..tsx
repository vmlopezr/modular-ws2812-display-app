import { StyleSheet, Dimensions } from 'react-native';
const screenHeight = Math.round(Dimensions.get('window').height);
export default StyleSheet.create({
  body: {
    backgroundColor: '#ebebeb',
    flex: 26
  },
  button: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#1E6738',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 'auto',
    width: '100%',
    backgroundColor: 'transparent'
  },
  spacer: {
    width: '100%',
    height: 20,
    backgroundColor: 'transparent'
  }
});
