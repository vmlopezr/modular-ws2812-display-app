import React from 'react';
import { View } from 'react-native';
import styles from './DefaultScreen.style';
import { CustomButton } from '../../components/CustomButton';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
  SafeAreaView,
  NavigationEvents
} from 'react-navigation';
import GlobalStyles, { screenWidth } from '../GlobalStyles';
import AppHeader from '../../components/AppHeader';
import LocalStorage from '../../LocalStorage';
import DraggableFlatList from 'react-native-draggable-flatlist';
import FrameItem from './FrameItem';
interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
interface State {
  list: ListItem[];
  selectButton: boolean;
}
interface ListItem {
  key: string;
  label: number;
  backgroundColor;
}

class DefaultScreen extends React.PureComponent<Props, State> {
  storage: LocalStorage;
  count: number;
  _scrollRef: React.RefObject<DraggableFlatList<ListItem>>;
  itemSelected: number;
  array: ListItem[];
  selectedItems: number[];
  constructor(props) {
    super(props);
    this.count = 1;
    this.storage = LocalStorage.getInstance();
    this._scrollRef = React.createRef();
    this.selectedItems = [];
    this.array = [
      {
        key: `item-${0}`, // For example only -- don't use index as your key!
        label: 0,
        backgroundColor: `rgb(${Math.floor(Math.random() * 255)}, ${0 *
          5}, ${132})`
      },
      {
        key: `item-${1}`, // For example only -- don't use index as your key!
        label: 1,
        backgroundColor: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
          Math.random() * 255
        )}, ${132})`
      }
    ];
    this.state = {
      list: this.array,
      selectButton: false
    };
  }

  onEnter = () => {
    this.storage.focusedScreen = 'Preview';
  };
  addItem = () => {
    this._scrollRef.current.flatlistRef.current.getNode().scrollToEnd();
    setTimeout(() => {
      this.count++;
      this.array.push({
        key: `item-${this.count}`,
        label: this.count,
        backgroundColor: `rgb(${Math.floor(Math.random() * 255)}, ${this.count *
          5}, ${132})`
      });
      this.setState({ list: [...this.array] });
      setTimeout(() => {
        this._scrollRef.current.flatlistRef.current.getNode().scrollToEnd();
      }, 200);
    }, 300);
  };
  onSelect = () => {
    this.setState({ selectButton: true });
  };
  itemIsSelected = (index: number) => {
    this.selectedItems.push(index);
  };
  itemDeSelected = (index: number) => {
    const itemindex = this.selectedItems.indexOf(index);
    this.selectedItems.splice(itemindex, 1);
  };
  onCancel = () => {
    this.selectedItems.splice(0, this.selectedItems.length);
    this.setState({ selectButton: false });
  };
  findItemIndex = (list: ListItem[], value: number) => {
    for (let i = 0; i < list.length; i++) {
      if (list[i].label === value) {
        return i;
      }
    }
  };
  onDelete = () => {
    this.selectedItems.map(value => {
      const itemIndex = this.findItemIndex(this.array, value);
      this.array.splice(itemIndex, 1);
    });
    this.setState({ list: [...this.array], selectButton: false });
    this.selectedItems.splice(0, this.selectedItems.length);
  };
  renderItem = ({ item, drag, isActive }) => {
    return (
      <View
        style={{
          backgroundColor: '#ebebeb',
          width: screenWidth,
          height: 150,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <FrameItem
          selectedButton={this.state.selectButton}
          isActive={isActive}
          itemSelected={this.itemIsSelected}
          itemDeSelected={this.itemDeSelected}
          index={item.label}
          drag={drag}
          label={item.label}
          backgroundColor={isActive ? 'gray' : item.backgroundColor}
        />
      </View>
    );
  };
  onDragEnd = ({ data }) => {
    this.array = data;
    this.setState({ list: [...data] });
  };
  renderHeader = () => (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        {this.state.selectButton && (
          <CustomButton
            onPress={this.onCancel}
            label={'Cancel'}
            fontColor="#147EFB"
            backgroundColor="transparent"
          />
        )}
      </View>
      <View style={{ flex: 3 }}></View>
      <View style={{ flex: 1 }}>
        {!this.state.selectButton && (
          <CustomButton
            onPress={this.onSelect}
            label={'Select'}
            fontColor="#147EFB"
            backgroundColor="transparent"
          />
        )}
        {this.state.selectButton && (
          <CustomButton
            onPress={this.onDelete}
            label={'Delete'}
            fontColor="#147EFB"
            backgroundColor="transparent"
          />
        )}
      </View>
    </View>
  );
  render() {
    return (
      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <NavigationEvents onWillFocus={this.onEnter} />
        <AppHeader title="Set Display" navigation={this.props.navigation} />
        {this.renderHeader()}
        <View style={styles.body}>
          <DraggableFlatList
            data={this.state.list}
            renderItem={this.renderItem}
            keyExtractor={item => `draggable-item-${item.key}`}
            onDragEnd={this.onDragEnd}
            extraData={this.state.selectButton}
            ref={this._scrollRef}
          />
        </View>
        <View style={styles.footer}>
          <CustomButton
            onPress={this.addItem}
            label={'Add Frame'}
            fontColor="#147EFB"
            backgroundColor="transparent"
          />
        </View>
      </SafeAreaView>
    );
  }
}
export default DefaultScreen;
