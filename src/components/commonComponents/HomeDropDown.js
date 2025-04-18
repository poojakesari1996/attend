// import React, { useMemo, useState } from 'react';
// import { View } from 'react-native';
// import { Dropdown } from 'react-native-element-dropdown';
// import { Colors, darkTheme, lightTheme,} from '../../utils';
// import VectorIcon from './VectoreIcons';
// import { useTranslation } from 'react-i18next';
// import { HomeTabStyle } from '../../styles';
// import { useSelector } from 'react-redux';

// function HomeDropDown(props) {
//   const [value, setValue] = useState('4');
//   const { t } = useTranslation();
//   const isDarkMode = useSelector(state => state.DarkReducer.isDarkMode);
//   const Colors = isDarkMode ? darkTheme : lightTheme;
//   const HomeTabStyles = useMemo(() => HomeTabStyle(Colors), [Colors]);
//   // const HomeTabStyles = HomeTabStyle;
//   const data = [
//     { label: t("Today"), value: '1' },
//     { label: t("Yesterday"), value: '2' },
//     { label: t("This_week"), value: '3' },
//     { label: t("This_month"), value: '4' },
//     { label: t("This_year"), value: '5' },
//   ];

//   return (
//     <View style={HomeTabStyles.Dropdown_container}>
//     <Dropdown
//       style={HomeTabStyles.Dropdown_dropdown}
//       data={data}
//       labelField="label"
//       valueField="value"
//       placeholder="Select item"
//       placeholderStyle={HomeTabStyles.Dropdown_placeholderStyle}
//         selectedTextStyle={HomeTabStyles.Dropdown_selectedTextStyle}
//         value={value}
//         onChange={item => {
//           setValue(item.value);
//           console.log(item);
//         }}
//         renderRightIcon={() => (
//           <VectorIcon icon="MaterialIcons"  color={Colors.white_color} name="arrow-drop-down" size={35} />
//         )}
//     />
//   </View>
//   );
// }
// export default HomeDropDown;














import React, { useMemo } from 'react';
import { View, Dimensions } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Colors, darkTheme, lightTheme } from '../../utils';
import VectorIcon from './VectoreIcons';
import { useTranslation } from 'react-i18next';
import { HomeTabStyle } from '../../styles';
import { useSelector } from 'react-redux';

const { width: screenWidth } = Dimensions.get('window');

function HomeDropDown(props) {
  const {
    value,
    setValue,
    data,
    placeholder,
    style = {}, // Custom container style from parent
  } = props;

  const { t } = useTranslation();
  const isDarkMode = useSelector(state => state.DarkReducer.isDarkMode);
  const themeColors = isDarkMode ? darkTheme : lightTheme;
  const HomeTabStyles = useMemo(() => HomeTabStyle(themeColors), [themeColors]);

  return (
    <View
      style={[
        HomeTabStyles.Dropdown_container,
        {
          borderRadius: 10,
          width: '100%',
          maxWidth: screenWidth * 0.95,
          alignSelf: 'center',
        },
        style,
      ]}
    >
      <Dropdown
        style={{
          width: '100%',
          height: 48,
          borderRadius: 10,
          paddingHorizontal: 12,
          backgroundColor: themeColors.white_text_color,
          borderWidth: 1,
          borderColor: themeColors.green,
          justifyContent: 'center',
        }}
        data={data}
        labelField="label"
        valueField="value"
        placeholder={placeholder || 'Select item'}
        placeholderStyle={{
          color: themeColors.green,
          fontSize: screenWidth < 350 ? 12 : 14,
        }}
        selectedTextStyle={{
          fontSize: screenWidth < 350 ? 12 : 14,
          color: isDarkMode ? '#FFFFFF' : '#000000',
          fontWeight: '600',
        }}
        value={value}
        onChange={item => {
          setValue(item.value);
        }}
        renderRightIcon={() => (
          <VectorIcon
            icon="MaterialIcons"
            name="arrow-drop-down"
            size={26}
            color={themeColors.green}
            style={{ marginRight: 4 }}
          />
        )}
      />
    </View>
  );
}

export default HomeDropDown;


