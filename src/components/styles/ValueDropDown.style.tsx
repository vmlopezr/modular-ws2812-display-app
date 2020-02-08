import { StyleSheet, Dimensions } from 'react-native';

const pickerItemHeight = 40;
const screenWidth = Math.round(Dimensions.get('window').width);
export default StyleSheet.create({
  text: {
    flex: 3,
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black'
  },
  parentContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#d3d3d3'
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#e5ebee',
    width: '100%'
  },
  valueSelector: {
    position: 'absolute',
    top: 115,
    height: pickerItemHeight,
    borderColor: '#dedede',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    width: '100%',
    backgroundColor: 'white',
    zIndex: 0
  },
  pickerScrollArea: {
    flex: 1,
    height: 200,
    backgroundColor: 'transparent',
    width: '100%'
  },
  scrollTopFiller: { height: 65, width: '100%' },
  scrollBottomFiller: { height: 150, width: '100%' },
  modalBackground: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000080'
  },
  modal: {
    position: 'absolute',
    top: '60%',
    left: 0,
    zIndex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    height: 300,
    width: screenWidth,
    backgroundColor: '#ececf1'
  },
  button: {
    width: screenWidth
  },
  modalHeader: {
    height: 50,
    width: '100%',
    borderColor: '#525252',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  pickerItem: {
    height: pickerItemHeight,
    margin: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
    justifyContent: 'center'
  },

  pickerText: {
    fontSize: 25,
    color: 'black'
  }
});
