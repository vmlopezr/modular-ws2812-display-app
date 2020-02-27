import { StyleSheet } from 'react-native';
import { screenHeight, screenWidth } from '../GlobalStyles';
export default StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  body: {
    backgroundColor: '#ebebeb',
    flex: 26
  },
  header: {
    height: 45,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    backgroundColor: '#fbfbfb',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  footer: {
    height: 45,
    borderTopWidth: 1,
    borderTopColor: 'gray',
    backgroundColor: '#fbfbfb',
    flexDirection: 'row',
    justifyContent: 'center'
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
  mainContainer: {
    flex: 1
  },
  dropZone: {
    height: 100,
    backgroundColor: '#2c3e50'
  }
});
export const EffectList = ['Fade', 'Horizontal Slide', 'Vertical Slide'];
