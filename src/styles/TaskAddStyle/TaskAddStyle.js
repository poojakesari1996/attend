import { Fonts, SH,  SF, Colors } from '../../utils';
import { StyleSheet,Dimensions  } from 'react-native';
const { width } = Dimensions.get('window');
// export default StyleSheet.create({
  export default TaskAddStyle = (Colors) => StyleSheet.create({
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
        paddingHorizontal: 16,
      },
      
      datePickerWrapper: {
        width: '50%',
        marginRight: 10,
        marginHorizontal:50
      },
      
      addTaskButton: {
        backgroundColor: Colors.black,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        marginHorizontal:50,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        elevation: 2,
      },
      
      
      header: {
        padding: 0,
        backgroundColor: Colors.white_text_color,
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 0,
      },
});