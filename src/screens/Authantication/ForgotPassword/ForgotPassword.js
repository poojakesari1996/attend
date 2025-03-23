import React, { useMemo, useState } from 'react';
import { View, ScrollView, Appearance, ImageBackground, Text, Image } from 'react-native';
import { Button, ConfirmationAlert, Input, Spacing } from '../../../components';
import { LoginStyle } from '../../../styles';
import { SH } from '../../../utils';
import { useTranslation } from "react-i18next";
import { darkTheme, lightTheme } from '../../../utils';
import { useNavigation } from '@react-navigation/native';
import { RouteName } from '../../../routes';
import { useSelector } from 'react-redux';
import images from '../../../index';
const ForgotPassword = () => {
  const navigation = useNavigation();
  const isDarkMode = useSelector(state => state.DarkReducer.isDarkMode);
  const Colors = isDarkMode ? darkTheme : lightTheme;
  const LoginStyles = useMemo(() => LoginStyle(Colors), [Colors]);
  // const LoginStyles = LoginStyle;
  const [Email, setEmail] = useState('');
  const { t } = useTranslation();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [okbutton, Setokbutton] = useState('');
  var alertdata = {
      'logout': t("Resand_Otp_Text_Modal"),
      'loginSuccess': t("Forgote_Alert"),
  }
  const onoknutton = () => {
      if (okbutton === false) okbutton;
      if (okbutton === true) navigation.navigate(RouteName.RESETPASSWORD)
  }
  return (
    <View style={LoginStyles.Container}>
      <View >
        <View style={LoginStyles.TopView}>
          <Spacing space={60} />
          <Text style={LoginStyles.Welcome_back_Text}>{t("Forgot")}</Text>
          <Text style={LoginStyles.Password}>{t("Password")}</Text>
        </View>
        <View style={LoginStyles.TopView}>
          <Spacing space={40} />
          <Image source={images.password} resizeMode="center" style={LoginStyles.ForgotImage} />
          <Spacing space={40} />
        </View>
        <Spacing space={20} />
        <View style={LoginStyles.PaddingHorizontal}>
        <Text style={LoginStyles.pin_Text}>{t("Forgot_pera")}</Text>
        </View >
        <Spacing space={20} />
        <View style={LoginStyles.SetPadding}>
          <Input
            title={t("Email")}
            placeholder={t("Enter_your_email")}
            onChangeText={(value) => setEmail(value)}
            value={Email}
            placeholderTextColor={Colors.gray_text_color}
          />
        </View>
        <Spacing space={SH(20)} />
        <View style={LoginStyles.PaddingHorizontal}>
          <Spacing space={SH(20)} />
          <Button onPress={() => {
                                setAlertVisible(true);
                                setAlertMessage(alertdata.loginSuccess);
                                Setokbutton(true);
                            }}
            buttonStyle={LoginStyles.ButtonView} title={t("Submit")}/>
        </View>
      </View>
      <ConfirmationAlert
                message={alertMessage}
                modalVisible={alertVisible}
                setModalVisible={setAlertVisible}
                onPress={() => { setAlertVisible(!alertVisible), onoknutton() }}
                buttonminview={LoginStyles.buttonotp}
                iconVisible={true}
                buttonText={t("Ok")}
            />
    </View>
  );
};
export default ForgotPassword;