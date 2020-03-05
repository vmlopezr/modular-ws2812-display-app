import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import CustomIcon from './CustomIcon';
import { CommsContext, CommsCtx } from '../contexts/CommsContext';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const placeIcon = (isConnected: boolean) => {
  const iconColor = isConnected ? 'green' : 'tomato';
  const icon = isConnected ? 'ios-cloud-done' : 'cloud-xmark';

  if (isConnected) {
    return (
      <Ionicons
        style={{ paddingBottom: 0, margin: 0 }}
        name={icon}
        size={20}
        color={iconColor}
      />
    );
  } else {
    return (
      <CustomIcon
        style={{ paddingBottom: 0, margin: 0 }}
        name={icon}
        size={20}
        color={iconColor}
      />
    );
  }
};
const ConnectionBadge = () => {
  const context = useContext(CommsContext);
  const label = context.state.ESPConn ? 'ONLINE' : 'OFFLINE';
  const iconColor = context.state.ESPConn ? 'green' : 'tomato';
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        alignSelf: 'flex-end'
      }}
    >
      {placeIcon(context.state.ESPConn)}
      <Text
        style={{
          fontSize: 15,
          color: iconColor,
          fontWeight: 'bold',
          paddingTop: 0,
          margin: 0
        }}
      >
        {label}
      </Text>
    </View>
  );
};
export default ConnectionBadge;
