import { StyleSheet } from 'react-native';
import { screenWidth, screenHeight } from '../GlobalStyles';
export default StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  body: {
    backgroundColor: '#f6f6f6',
    flex: 26
  },
  header: {
    height: 45,
    borderBottomWidth: 0.5,
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
    justifyContent: 'center',
    alignItems: 'center'
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
  },
  loading: {
    position: 'absolute',
    left: (screenWidth - 100) / 2,
    top: (screenHeight - 100) / 2,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(150,150,150,0.5)',
    zIndex: 2
  }
});
export const EffectList = [
  'None',
  'Blink',
  'Horizontal Slide',
  'Vertical Slide'
];
export const DirectionHorizontal = ['Right', 'Left'];
export const DirectionVertical = ['Up', 'Down'];
