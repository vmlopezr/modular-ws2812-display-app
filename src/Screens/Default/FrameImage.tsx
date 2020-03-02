import React from 'react';
import { View } from 'react-native';
interface Props {
  width: number;
  height: number;
  data: string;
}
class FrameImage extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  convertValue(value: string): string {
    const number = parseInt(value, 16);

    if (!number) {
      return '00';
    } else {
      return ('0' + Math.round((55 * number) / 254 + 200).toString(16)).slice(
        -2
      );
    }
  }
  renderImage(nodewidth: number) {
    const { height, width, data } = this.props;
    const subheight = height / 8;
    const subwidth = width / 8;
    const image = [];
    if (height > 8) {
      let count = 0;
      let color = '';
      for (let i = 0; i < subheight; i++) {
        for (let j = 0; j < subwidth; j++) {
          for (let z = 0; z < 8; z++) {
            for (let c = 0; c < 8; c++) {
              const index = height * z + c + width * j * 8 + 8 * i;
              color = '#' + data.slice(count * 6, (count + 1) * 6);
              const newcolor =
                '#' +
                this.convertValue(color.slice(1, 3)) +
                this.convertValue(color.slice(3, 5)) +
                this.convertValue(color.slice(5, 7));
              image[index] = (
                <View
                  key={index.toString() + 'c'}
                  style={{
                    width: nodewidth,
                    height: nodewidth,
                    backgroundColor: newcolor
                  }}
                ></View>
              );
              count++;
            }
          }
        }
      }
    } else {
      let color = '';
      for (let i = 0; i < height * width; i++) {
        color = '#' + data.slice(i * 6, (i + 1) * 6);
        const newcolor =
          '#' +
          this.convertValue(color.slice(1, 3)) +
          this.convertValue(color.slice(3, 5)) +
          this.convertValue(color.slice(5, 7));
        image[i] = (
          <View
            key={i.toString() + 'c'}
            style={{
              width: nodewidth,
              height: nodewidth,
              backgroundColor: newcolor
            }}
          ></View>
        );
      }
    }
    return image;
  }
  render() {
    const { height, width } = this.props;
    const nodewidth = Math.floor(140 / Math.max(width, height));
    return (
      <View
        style={{
          width: 140,
          height: 140,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#efefef',
          borderWidth: 1,
          borderColor: '#d1d1d1'
        }}
      >
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column-reverse',
            width: width * nodewidth,
            height: height * nodewidth,
            flexWrap: 'wrap'
          }}
        >
          {this.renderImage(nodewidth)}
        </View>
      </View>
    );
  }
}
export default FrameImage;
