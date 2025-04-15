import { Fonts, SH,  SF, Colors } from '../../utils';
import { StyleSheet } from 'react-native';
// export default StyleSheet.create({
  export default TaskAddStyle = (Colors) => StyleSheet.create({
    datePickerWrapper: {
        alignItems: 'center',
        justifyContent: 'center', // Center vertically
        flex: 1, // Take full available space
        marginTop:10
      },
      dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', // ✅ This aligns items vertically in the center
        marginBottom: 10,
      },
      
      cuteButton: {
        backgroundColor: Colors.black, // Soft pink
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,           // Rounded edges
        elevation: 2,              // Android shadow
        shadowColor: '#000',       // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
      },
      cuteButtonText: {
        color: Colors.white_text_color,
        fontSize: 14,
        fontWeight: '600',
      },
      
      header: {
        padding: 0,
        backgroundColor: Colors.white_text_color,
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 0,
      },
});