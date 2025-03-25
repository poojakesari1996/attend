import { StyleSheet } from 'react-native';
import { Fonts, SH, SF, Colors } from '../../utils';

export default OutletDetailStyle = () => StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.white_color, // light background color for the whole screen
        padding: 10,
      },
      container: {
        backgroundColor: Colors.white_color, // white background for the details container
        padding: 15,
        borderRadius: 10,
        shadowColor: Colors.gray_text_color, // shadow for better depth
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3, // Android shadow
      },
      // infoContainer: {
      //   flexDirection: 'row',
      //   justifyContent: 'space-between',
      //   marginVertical: 10, // space between each row
      // },

      infoContainer: {
        marginVertical: 2,
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },

      labelContainer: {
        flexDirection: 'row',
        marginBottom: 5, // Adds space below the container if needed
      },
      
      outletLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
      },
      

      valueContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Aligns values below their respective labels
      },



      labelContainer1: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Spreads labels across the row
        marginBottom: 5, // Adds space between label and value
      },

outletLabel1: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
        flex: 1, // Distributes space evenly for labels
      },


      // outletLabel: {
      //   fontSize: 14,
      //   fontWeight: 'bold',
      //   color: '#555',
      //   flex: 1, // Distributes space evenly for labels
      // },
      // outletValue: {
      //   fontSize: 13,
      // color: Colors.black_color,
      // flex: 2,
      // flexWrap: 'wrap',
      // overflow: 'hidden', // Prevents text spill
      // maxWidth: '70%', // Limits the width of the value
      // flexShrink: 1, // Shrinks if necessary // grey color for values
      // },

      outletValue: {
        fontSize: 12,
        fontWeight: 'normal',
        color: '#000',
        flex: 1, // Matches space with labels for alignment
      },

      // buttonsRow: {
      //   flexDirection: 'row', // Arrange buttons horizontally
      //   justifyContent: 'space-evenly', // Distribute buttons evenly with space between
      //   marginBottom: 20, // Space between buttons and main content
      //   marginTop: 10, // Space at the top of the buttons
      //   paddingHorizontal: 10, // Padding for container to avoid touching the edges
      // },
      // button: {
      //   backgroundColor: Colors.peach_orange, // Button color
      //   paddingVertical: 8,  // Reduced vertical padding for smaller button size
      //   paddingHorizontal: 20, // Normal horizontal padding
      //   borderRadius: 20, // Rounded corners for a smoother look
      //   alignItems: 'center',
      //   justifyContent: 'center',
      //   shadowColor: '#000', // Adding shadow for a subtle 3D effect
      //   shadowOffset: { width: 0, height: 4 }, 
      //   shadowOpacity: 0.1,
      //   shadowRadius: 5,
      //   elevation: 5, // For Android shadow
      //   marginHorizontal: 8, // Adds space between buttons
      // },
      buttonText: {
        color: 'white', // Make the text white for contrast
        fontSize: 12,    // Slightly smaller text for better button fit
        fontWeight: 'bold',
        textAlign: 'center',
      },

      buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Ensures even spacing between buttons
        alignItems: 'center',
        flexWrap: 'nowrap', // Prevent wrapping
        marginBottom: 15,
        marginTop: 10,
        paddingHorizontal: 10, // Provides spacing on both sides
      },
      
      button: {
        backgroundColor: Colors.peach_orange,
        paddingVertical: 8, // Balanced height
        paddingHorizontal: 12, // Enough padding for text
        borderRadius: 12, // Smooth rounded corners
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1, // Allows buttons to adjust and distribute evenly
        marginHorizontal: 5, // Adds space between buttons
        minWidth: 80, // Ensures all buttons have a minimum width
      },
      
      
      
      


      modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
      },
      dropdownContainer: {
        backgroundColor: Colors.black_color,
        padding: 20,
        borderRadius: 10,
        width: 200,
        elevation: 5, // For shadow on Android
      },
      option: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.peach_orange,
      },
      optionText: {
        fontSize: 16,
        color: 'white'
      },
      selectedText: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: 'bold',
      },


      pickerContainer: {
        marginTop: 20,
        marginHorizontal: 20,
      },
      pickerLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.peach_orange,
        marginBottom: 10,
      },
      pickerWrapper: {
        borderWidth: 1,
        borderColor: Colors.peach_orange,
        borderRadius: 5,
        overflow: "hidden",
      },

      addressContainer: {
        flexDirection: 'column', // Stack address and button vertically
        alignItems: 'flex-start', // Align items to the start (left)
        width: '100%', // Full width for the container
        paddingVertical: 10, // Optional: Adjust padding around the container
        position: 'relative', // Make sure the button is positioned relative to this container
      },

      callerNameContainer: {
        backgroundColor: Colors.white_text_color, // Light background
        padding: 10,
        marginVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
        width: '100%',
        alignItems: "center",
        shadowColor: Colors.gray_text_color,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
      },
      
      callerNameText: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors.black_text_color, // Dark text color
      },

      callerNameText3: {
        fontSize: 12,
        marginBottom: 10,
        fontWeight: "bold",
        color: Colors.black_text_color, // Dark text color
      },

      saveButton: {
        backgroundColor: '#007BFF', // Button color
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 10, // Adds space between the address text and button
        alignSelf: 'flex-end', // Positions button at the right end of the container
      },
      saveButtonText: {
        color: 'white', // Text color for the button
        fontSize: 14, // Adjust the size of the text
      },




      

















    //   container2: {
    //     padding: 16,
    //     backgroundColor: Colors.white_text_color,
    //     borderRadius: 8,
    //     marginBottom: 16,
    //   },
    //   headerContainer2: {
    //     backgroundColor: Colors.wageningen_green, // Yellow color for header
    //     padding: 8,
    //     borderRadius: 4,
    //     marginBottom: 8,
    //   },
    //   headerText2: {
    //     fontSize: 18,
    //     fontWeight: 'bold',
    //     color: Colors.white_text_color,
    //     alignItems: 'center'
    //   },
    //   detailContainer2: {
    //     padding: 8,
    //     borderWidth: 1,
    //     borderColor: Colors.green_color,
    //     borderRadius: 8,
    //   },
    //   row2: {
    //     flexDirection: 'row',
    //     marginBottom: 8,
    //     justifyContent: 'space-between',
    //   },
    //   label2: {
    //     fontWeight: 'bold',
    //     color: Colors.blue_jeans_color,
    //   },
    //   value2: {
    //     color: Colors.green_color,
    //   },






    container3: {
        // margin: 10,
        // borderRadius: 8,
        // backgroundColor: Colors.white_text_color,
        // padding: 15,
        // borderWidth: 1,
        // borderColor: Colors.gray_text_color,  // Border for the whole container

        backgroundColor: Colors.white_color, // white background for the details container
        padding: 5,
        borderRadius: 10,
        shadowColor: Colors.gray_text_color, // shadow for better depth
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3, // Android shadow
      },
      headerText3: {
        fontSize: 13,
        fontWeight: 'bold',
        color: Colors.white_text_color,
        backgroundColor: Colors.peach_orange,  // Yellow background for header
        padding: 10,
        borderRadius: 6,
        textAlign: 'center',
        justifyContent: 'center',  // Vertically centers the content if needed
  alignItems: 'center',  // Aligns the text in the center horizontally and vertically if needed
      },
      orderInfo3: {
        fontSize: 12,
        color: Colors.black_text_color,
        marginBottom: 7,
        marginLeft: 15
      },
      orderInfo4: {
        fontSize: 12,
        color: Colors.black_text_color,
        marginLeft: 15
       
      },
      details3: {
        marginTop: 10,
      },
      row3: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
      },
      rowLabel3: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 2,
        color: Colors.black_text_color,
        marginLeft:15
      },
      rowValue3: {
        fontSize: 11,
        marginTop: 2,
        color: Colors.black_text_color,
        // marginRight: 15,
        marginLeft: 25
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
      
      
});
