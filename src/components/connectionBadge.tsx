import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CommsContext } from '../contexts/CommsContext';

const ConnectionBadge = () => {
  const context = useContext(CommsContext);
  const iconColor = context.state.ESPConn ? 'green' : 'tomato';
  const icon = context.state.ESPConn ? 'ios-cloud-done' : 'ios-close-circle';
  const label = context.state.ESPConn ? 'ONLINE' : 'OFFLINE';
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        alignSelf: 'flex-end'
      }}
    >
      <Ionicons
        style={{ paddingBottom: 0, margin: 0 }}
        name={icon}
        size={20}
        color={iconColor}
      />
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
