import { Fonts, SH,  SF, Colors } from '../../utils';
import { StyleSheet } from 'react-native';
// export default StyleSheet.create({
  export default TaskAddStyle = (Colors) => StyleSheet.create({
    datePickerWrapper: {
        alignItems: 'center',
        justifyContent: 'center', // Center vertically
        flex: 1, // Take full available space
      },
      dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
      },
      header: {
        padding: 0,
        backgroundColor: Colors.white_text_color,
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 0,
      },
});