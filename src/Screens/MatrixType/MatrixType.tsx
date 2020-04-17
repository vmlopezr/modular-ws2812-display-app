/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
import React from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  Platform,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlobalStyles from '../GlobalStyles';
import AppHeader from '../../components/AppHeader';
import { WebView } from 'react-native-webview';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams
} from 'react-navigation';
interface Props {
  isFocused: boolean;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}
const styles = StyleSheet.create({
  body: {
    backgroundColor: '#f1f1f1',
    flex: 26
  },
  titleContainer: {
    height: 40,
    width: '100%',
    alignItems: 'center',
    paddingLeft: 8,
    // backgroundColor: '#fff',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ababab'
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 360,
    width: '100%',
    backgroundColor: '#ffffff'
  },
  subHeaderText: {
    fontSize: 18,
    textAlign: 'left'
  },
  subHeaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 'auto',
    width: '98%',
    backgroundColor: '#fff'
  },
  bodyText: {
    fontSize: 16,
    textAlign: 'left',
    paddingLeft: 10
  },
  bodyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 'auto',
    width: '98%',
    lineHeight: 20,
    backgroundColor: '#fff'
  },
  imageCaption: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    paddingLeft: 10
  }
});
interface ImageData {
  header: string;
  image: any;
  width: number;
  height: number;
  toggle(): void;
  hideInfo: boolean;
  subHeader: string;
  imageCaption: string;
  bodyHeight: number;
  subHeaderHeight: number;
  body: string;
  backgroundColor: string;
}
interface State {
  CJMCU: boolean;
  WS2812: boolean;
  CustomCJMCU: boolean;
  CustomWS2812: boolean;
  CJMCUColor: string;
  WS2812Color: string;
  CustomCJMCUColor: string;
  CustomWS2812Color: string;
}
const CJMCUSubHeader =
  'The CJMCU 8x8 LED PCB matrices have the following data signal trace as shown below.';
const CJMCUBody =
  'When using the PCB matrices it is important to select the correct Matrix Type in the Settings Page. ' +
  'Using the incorrect Matrix Type will result in faulty images.';
const CJMCUImageCaption =
  'The signal connection starts at the bottom left corner, and proceeds up each column.\n';

const WS2812SubHeader =
  'The WS2812 8x8 LED PCB matrices have the following data signal trace as shown below.';
const WS2812ImageCaption =
  'The signal connection starts at the bottom left corner on odd columns, and proceeds down on even columns.\n';
const WS2812Body =
  'When using the PCB matrices it is important to select the correct Matrix Type in the Settings Page. ' +
  'Using the incorrect Matrix Type will result in faulty images.';

const CustomCJMCUSubHeader =
  'Custom Matrices may be used with the Application. The image below shows the one of the supported data signal traces.';
const CustomCJMCUBody =
  'The Custom Matrices supported, use the same data signal path as the CJMCU-8x8 matrix above. However, there is no need for making multiple smaller matrices.' +
  " <br/><br/>The phone application supports a single <i>'<b>h</b> by <b>w</b>'</i> matrix as long as the total amount of LEDs is less than 1024. " +
  'These Matrices may be built using bulk strips of WS2812 LEDs.';
const CustomCJMCUImageCaption =
  'The signal connection starts at the bottom left corner, and proceeds upwards on each column to the right.\n';

const CustomWS2812SubHeader =
  'Custom Matrices may be used with the Application. The image below shows the one of the supported data signal traces.';
const CustomWS2812Body =
  'The Custom Matrices supported, use the same data signal path as the WS2812-8x8 matrix above. However, there is no need for making multiple smaller matrices.' +
  " <br/><br/>The phone application supports a single <i>'<b>h</b> by <b>w</b>'</i> matrix as long as the total amount of LEDs is less than 1024. " +
  'These Matrices may be built using bulk strips of WS2812 LEDs.';
const CustomWS2812ImageCaption =
  'The signal connection starts at the bottom left corner upwards on odd columns, and proceeds down on even columns.\n';

class MatrixTypeScreen extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      CJMCU: false,
      CustomCJMCU: false,
      WS2812: false,
      CustomWS2812: false,
      CJMCUColor: '#fff',
      WS2812Color: '#fff',
      CustomCJMCUColor: '#fff',
      CustomWS2812Color: '#fff'
    };
  }
  toggleCJMCU = () => {
    const isDisplayed = !this.state.CJMCU;
    const color = !isDisplayed ? '#fff' : '#d5d5d5';
    this.setState({ CJMCU: isDisplayed, CJMCUColor: color });
  };
  toggleWS2812 = () => {
    const isDisplayed = !this.state.WS2812;
    const color = !isDisplayed ? '#fff' : '#d5d5d5';
    this.setState({ WS2812: isDisplayed, WS2812Color: color });
  };
  toggleCustomCJMCU = () => {
    const isDisplayed = !this.state.CustomCJMCU;
    const color = !isDisplayed ? '#fff' : '#d5d5d5';
    this.setState({ CustomCJMCU: isDisplayed, CustomCJMCUColor: color });
  };
  toggleCustomWS2812 = () => {
    const isDisplayed = !this.state.CustomWS2812;
    const color = !isDisplayed ? '#fff' : '#d5d5d5';
    this.setState({ CustomWS2812: isDisplayed, CustomWS2812Color: color });
  };
  renderMatrixType = (data: ImageData): JSX.Element => {
    const titleSize = Platform.OS === 'ios' ? 18 : 20;
    const htmlHeader = `<div style="overflow:hidden;height:100%; display: flex;align-items:center;"><p style="text-align:justify;font: 50px Arial, sans-serif;">${data.subHeader}</p> </div>`;
    const htmlBody =
      `<div style="overflow:hidden;height:100%;align-items:flex-start;">` +
      `<p style="text-align:justify;font: bold 48px Arial, sans-serif; margin-top:0px;padding-top:0px">${data.imageCaption}</p>` +
      `<p style="text-align:justify;font: 48px Arial, sans-serif;">${data.body}</p>` +
      `</div>`;
    const icon = data.hideInfo ? 'ios-arrow-up' : 'ios-arrow-down';
    return (
      <View>
        <View style={{ height: 20, backgroundColor: '#f1f1f1' }}></View>
        <TouchableOpacity onPress={data.toggle}>
          <View
            style={[
              styles.titleContainer,
              { backgroundColor: data.backgroundColor }
            ]}
          >
            <View style={{ flex: 9 }}>
              <Text style={{ fontSize: titleSize, fontWeight: 'bold' }}>
                {data.header}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Ionicons
                size={30}
                name={icon}
                color={'black'}
                style={{ paddingTop: 5, paddingRight: 20 }}
              />
            </View>
          </View>
        </TouchableOpacity>
        {data.hideInfo && (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.subHeaderContainer}>
              {/* <Text style={styles.subHeaderText}> {data.subHeader}</Text> */}
              <WebView
                style={{
                  width: 350,
                  height: data.subHeaderHeight,
                  backgroundColor: 'transparent'
                }}
                source={{ html: htmlHeader }}
              />
            </View>
            <View style={styles.imageContainer}>
              <Image
                style={{ height: data.height, width: data.width }}
                source={data.image}
              />
            </View>
            <View style={styles.bodyContainer}>
              <WebView
                style={{
                  width: 350,
                  height: data.bodyHeight,
                  backgroundColor: 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                source={{
                  html: htmlBody
                }}
              />
            </View>
          </View>
        )}
      </View>
    );
  };
  render() {
    return (
      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <AppHeader
          title="Matrix Types"
          navigation={this.props.navigation}
          backButton={true}
          backRoute={'Settings'}
        />
        <View style={styles.body}>
          <ScrollView>
            <View style={{ width: '100%' }}>
              {this.renderMatrixType({
                header: 'CJMCU 8x8 PCB Matrix',
                image: require('../../../assets/CJMCU.png'),
                width: 350,
                height: 337,
                toggle: this.toggleCJMCU,
                hideInfo: this.state.CJMCU,
                subHeader: CJMCUSubHeader,
                body: CJMCUBody,
                imageCaption: CJMCUImageCaption,
                bodyHeight: 180,
                subHeaderHeight: 110,
                backgroundColor: this.state.CJMCUColor
              })}
              {this.renderMatrixType({
                header: 'WS2812 8x8 PCB Matrix ',
                image: require('../../../assets/WS2812-Matrix.png'),
                width: 350,
                height: 337,
                toggle: this.toggleWS2812,
                hideInfo: this.state.WS2812,
                subHeader: WS2812SubHeader,
                body: WS2812Body,
                imageCaption: WS2812ImageCaption,
                bodyHeight: 200,
                subHeaderHeight: 90,
                backgroundColor: this.state.WS2812Color
              })}
              {this.renderMatrixType({
                header: 'Custom: CJMCU Data Routing',
                image: require('../../../assets/Custom-CJMCU-9x9.png'),
                width: 350,
                height: 344,
                toggle: this.toggleCustomCJMCU,
                hideInfo: this.state.CustomCJMCU,
                subHeader: CustomCJMCUSubHeader,
                body: CustomCJMCUBody,
                imageCaption: CustomCJMCUImageCaption,
                bodyHeight: 270,
                subHeaderHeight: 95,
                backgroundColor: this.state.CustomCJMCUColor
              })}
              {this.renderMatrixType({
                header: 'Custom: WS2812-8x8 Data Routing',
                image: require('../../../assets/Custom-WS2812-Matrix-9x9.png'),
                width: 350,
                height: 344,
                toggle: this.toggleCustomWS2812,
                hideInfo: this.state.CustomWS2812,
                subHeader: CustomWS2812SubHeader,
                body: CustomWS2812Body,
                imageCaption: CustomWS2812ImageCaption,
                bodyHeight: 290,
                subHeaderHeight: 95,
                backgroundColor: this.state.CustomWS2812Color
              })}
            </View>
            <View style={{ height: 30, backgroundColor: 'transparent' }}></View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
export default MatrixTypeScreen;
