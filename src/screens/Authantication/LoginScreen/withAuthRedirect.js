// withAuthRedirect.js
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { RouteName } from '../../../routes';

const withAuthRedirect = (WrappedComponent) => {
  return (props) => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkLoginStatus = async () => {
        const user = await AsyncStorage.getItem("userInfor");
        if (user) {
            navigation.replace(RouteName.HOME_SCREEN); 
        } else {
          setLoading(false);
        }
      };
      checkLoginStatus();
    }, []);

    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuthRedirect;
