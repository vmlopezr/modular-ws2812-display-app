import React from 'react';
import { screenWidth } from '../Screens/GlobalStyles';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ESPFiles } from '../Screens/Default/DefaultFileModal';
interface Props {
  data: ESPFiles;
  fileSelected(filename: string): void;
  fileDeSelected(filename: string): void;
  fileModal?: boolean;
  disabled?: boolean;
}
interface State {
  Selected: boolean;
}
const styles = StyleSheet.create({
  label: {
    minHeight: 50,
    borderColor: '#c0c0c0',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  spacer: {
    width: '100%',
    height: 8,
    backgroundColor: '#ebebeb'
  },
  fileLabelContainer: {
    flex: 3,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 8
  },
  fileSizeContainer: {
    flex: 2,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 8
  }
});
class FileItem extends React.PureComponent<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (!nextProps.fileModal && prevState.Selected) {
      return { Selected: false };
    } else return null;
  }
  constructor(props) {
    super(props);
    this.state = {
      Selected: false
    };
  }
  selectFile = () => {
    const { data } = this.props;
    if (!this.state.Selected) {
      this.props.fileSelected(data.file);
      this.setState({ Selected: true });
    } else {
      this.props.fileDeSelected(data.file);
      this.setState({ Selected: false });
    }
  };
  render() {
    const { data, disabled } = this.props;
    const isDisabled = disabled ? disabled : false;
    const backgroundColor = this.state.Selected ? '#d3d3d3' : '#fff';
    const color = isDisabled ? '#cc8a8a' : backgroundColor;
    const defaultText = isDisabled ? ': Default list' : '';
    return (
      <TouchableOpacity onPress={this.selectFile} disabled={isDisabled}>
        <View style={styles.spacer}></View>
        <View
          style={[styles.label, { width: screenWidth, backgroundColor: color }]}
        >
          <View collapsable={false} style={styles.fileLabelContainer}>
            <Text style={{ fontWeight: 'bold' }}>
              {data.file + defaultText}
            </Text>
          </View>
          <View collapsable={false} style={styles.fileSizeContainer}>
            <Text style={{ fontWeight: 'bold' }}>
              {' width: ' + data.width + ' height: ' + data.height}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
export default FileItem;
