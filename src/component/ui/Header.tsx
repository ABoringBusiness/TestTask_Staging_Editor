import React from 'react';
import {View, Image, Text, Platform} from 'react-native';

const Header = () => {
  return (
    <View
      style={{
        height: 60,
        marginTop: Platform.OS === 'ios' ? 60 : 0,
        backgroundColor: '#fff',
        borderBottomColor: 'lightgray',
        borderBottomWidth: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
      }}>
      <Image
        source={require('../../../assets/images/Back.png')}
        style={{width: 40, height: 40}}
      />
      <Image
        source={require('../../../assets/images/solar_history-outline.png')}
        style={{width: 30, height: 30}}
      />
      <Text style={{color: 'black', fontWeight: '900'}}>Virtual Staging</Text>
      <View
        style={{
          height: 40,
          width: 80,
          backgroundColor: 'black',
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
        }}>
        <Image
          source={require('../../../assets/images/Icon.png')}
          style={{width: 20, height: 20}}
        />
        <Text style={{color: 'white', marginHorizontal: 10}}>290</Text>
      </View>
    </View>
  );
};

export default Header;
