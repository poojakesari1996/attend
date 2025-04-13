import { Fonts, SH,  SF, Colors } from '../../utils';
import { StyleSheet } from 'react-native';
// export default StyleSheet.create({
  export default OrderHistoryStyle = (Colors) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
        width: '48%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
      },

      modalTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
        textAlign: 'center',
      },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    
    closeButton: {
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 5,
    },
    

    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
    modalOption: {
        fontSize: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 10,
      },
    cancelButtonContainer: {
        alignItems: 'flex-end',  // This moves the "Cancel" button to the right side
        marginTop: 10,
    },
    cancelButton: {
        fontSize: 16,
        color: 'red',
        fontWeight: 'bold',
    },

    dateContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginBottom: 20,
      },

      dateText: {
        fontSize: 16,
        color: 'black',
      },

      closeButton: {
        backgroundColor: Colors.theme_background,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
      },
    picker: {
        height: SH(50),
        width: '100%',
        marginTop: SH(-10),
        color: Colors.black_color,
    },
    pickerBorder: {
        borderWidth: SH(1),
        borderColor: 'gray',
        borderRadius: SH(10),
        alignItems: 'center',
    },
    selectedText: {
        fontSize: 13,
        marginBottom: 5,
        fontWeight: 'bold',
        color: Colors.gray
    },

    Dropdown_placeholderStyle: {
      fontSize: SF(14),
      fontFamily: Fonts.Poppins_Medium,
      color: Colors.white_color,
    },
    Dropdown_selectedTextStyle: {
      fontSize: SF(14),
      fontFamily: Fonts.Poppins_Medium,
      color: Colors.white_color,
    },

    infoContainer: {
        backgroundColor: Colors.theme_background,
        padding: 7,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.gray_text_color,
        alignItems: 'center',
      },

      skuContainer: {
        backgroundColor: Colors.white_text_color,
        padding: 5, // Reduced padding from 10 to 5
        borderRadius: 8,
        marginBottom: 8, // Reduced marginBottom from 16 to 8
        borderWidth: 1,
        borderColor: Colors.white_text_color,
      },
      totalContainer: {
        backgroundColor: Colors.white_text_color,
        padding: 7,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.gray_text_color,
        marginBottom: 10,
      },
      totalText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.black_text_color,
      },

      skuHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray_text_color,
        paddingBottom: 5,
        marginBottom: 8,
      },

      skuHeaderText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: Colors.black_text_color,
        flex: 1,
        textAlign: 'center',
      },
      skuDataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 7,
      },

      skuText: {
        fontSize: 12,
        color: Colors.black_text_color,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
      },

      skuText1: {
        fontSize: 12,
        color: Colors.black_text_color,
        fontWeight: 'bold',
        textAlign: 'left',
        marginHorizontal: 20,
        marginBottom:50
    },
    skuText2: {
        fontSize: 12,
        color: Colors.black_text_color,
        fontWeight: 'bold',
        textAlign: 'right', 
        marginHorizontal: 20,
        marginBottom:50
    },
    
    selectedTeamText: {
      textAlign: 'center',
      fontSize: 14,
      color: 'gray',  // You can adjust the color as per your design
      marginTop: 5,  // Adds some space below the "Team" button
    },
    
      hospitalText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.white_text_color,
      },
      modalOverlay4: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        justifyContent: 'center',
        alignItems: 'center',
      },
      dropdownContainer4: {
        width: '90%',
        maxHeight: '70%', // Limits the height to make room for scrolling
        backgroundColor: Colors.black_color,
        borderRadius: 10,
        padding: 10,
        elevation: 5,
      },
      option4: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.peach_orange,
      },
      optionText4: {
        fontSize: 16,
        color: Colors.white_text_color,
      },


      pendingButton: {
        backgroundColor: Colors.theme_background,
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 6,
        marginBottom: 16,
        alignSelf: 'center',
        marginRight: 10,  // Adjusted spacing between buttons
    },
    

    pendingText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
});