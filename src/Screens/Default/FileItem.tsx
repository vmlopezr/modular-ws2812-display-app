import React from 'react';
import { screenWidth } from '../GlobalStyles';
import { View, Text, StyleSheet } from 'react-native';
import { ESPFiles } from './DefaultFileModal';
interface Props {
  data: ESPFiles;
  fileSelected(filename: string): void;
  fileDeSelected(filename: string): void;
  fileModal: boolean;
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
    const { data } = this.props;
    return (
      <View
        style={[
          styles.label,
          {
            width: screenWidth,
            backgroundColor: this.state.Selected ? '#d3d3d3' : '#fff'
          }
        ]}
        onTouchEnd={this.selectFile}
      >
        <View
          collapsable={false}
          style={{
            flex: 2,
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingLeft: 8
          }}
        >
          <Text style={{ fontWeight: 'bold' }}>{data.file}</Text>
        </View>
        <View
          collapsable={false}
          style={{
            flex: 1,
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingRight: 8
          }}
        >
          <Text style={{ fontWeight: 'bold' }}>
            {' width: ' + data.width + ' height: ' + data.height}
          </Text>
        </View>
      </View>
    );
  }
}
export default FileItem;
