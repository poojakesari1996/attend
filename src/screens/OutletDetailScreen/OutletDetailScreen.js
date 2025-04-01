import React, { useEffect, useMemo, useState } from "react";
import { Text, View, TouchableOpacity, Modal, ScrollView, ActivityIndicator, Linking, Alert } from "react-native";
import { OutletDetailStyle } from "../../styles/OutletDetailStyle";
import { useSelector } from "react-redux";
import axios from "axios";
import Geolocation from '@react-native-community/geolocation';
import { Platform, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Spacing, VectorIcon } from '../../components';
import { useNavigation } from '@react-navigation/native';
import { Spacing, VectorIcon } from '../../components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RouteName } from '../../routes';
import { darkTheme, lightTheme, SF } from "../../utils";
import { Button } from "react-native-elements";
// import { color } from "@rneui/base";

const OutletDetailScreen = ({ route }) => {
  const [selectedoutletsdeatil, setSelectedoutletsdeatial] = useState({});
  // const isDarkMode = useSelector(state => state.DarkReducer.isDarkMode);
  const Colors = isDarkMode ? darkTheme : lightTheme;
  const [modalVisible, setModalVisible] = useState(false); // State for Modal visibility
  const [modalVisible1, setModalVisible1] = useState(false); // State for Modal visibility
  const [callType, setCallType] = useState("Call With"); // Default button text
  const [callerName, setCallerName] = useState(""); // Default Caller Name
  const [reportingPersons, setReportingPersons] = useState([]); // Store the reporting persons
  const [dealerName, setDealerName] = useState([]);
  const [savedLatitude, setSavedLatitude] = useState(null);
const [savedLongitude, setSavedLongitude] = useState(null);
  const [selectedDealerName, setSelectedDealerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [hide, setHide] = useState(false);
  let [long, setLong] = useState(null);
  const [outletPinCode, setOutletPinCode] = useState(""); // Store outlet pin code dynamically
  const [savedPinCode, setSavedPinCode] = useState(null);
  let [lat, setLat] = useState(null);
  const [orderData, setOrderData] = useState([]);
  const [isUpdated, setIsUpdated] = React.useState(false); // New state variable
  const [outletDetail, setOutletDetail] = useState(null);
  let [address, setAddress] = React.useState(null);
  const [reportingModalVisible, setReportingModalVisible] = useState(false); // State for Reporting Modal visibility
  const { itemId } = route.params;
  const { icon_color, locationPinColor } = route.params;  // Retrieve the passed parameters

  // You can now use 'locationPinColor' to dynamically set button colors or other UI elements


  const handleOrderButtonClick = async () => {
    if (locationPinColor === "red") {  // ✅ Location validation only when icon is red
      Alert.alert(
        "Please Fetch Location",
        "You must fetch and save the location before proceeding.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
      return;
    }
    if (!callerName) {
      Alert.alert(
        "Please Select Call Type",
        "Self or Joined.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    } else if (!selectedDealerName) {  
      Alert.alert(
        "Please Select Dealer Name",
        "Please select a dealer name before proceeding.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    } else {
      // Get User Data
      const user = await AsyncStorage.getItem("userInfor");
      const loginData = JSON.parse(user);
  
      // Find the selected reporting person's details
      const selectedReportingPerson = reportingPersons.find(
        (person) => person.reporting_to_name === callerName
      );
  
      // Extract reporting_to
      const reportingTo = selectedReportingPerson ? selectedReportingPerson.reporting_to : null;
      console.log("Selected Reporting To:", reportingTo);

      // ✅ Find the selected dealer_id from selectedDealerName
      const selectedDealer = dealerName.find(
        (dealer) => dealer.dealer_name === selectedDealerName
      );
      
      // Extract dealer_id
      const dealerId = selectedDealer ? selectedDealer.dealer_id : null;
      console.log("Final Selected Dealer ID:", dealerId);

      // Prepare outletData with dealer_id added
      const outletData = { 
        ...selectedoutletsdeatil, 
        callerName: callerName, 
        callType: callType,
        reportingTo: reportingTo, 
        dealerName: selectedDealerName,
        dealerId: dealerId  // ✅ Added dealer_id
      };
      console.log('poojaaa', outletData);
      
  
      navigation.navigate("OrderScreen", { outletDetail: outletData });
    }
};

  const handleActivityButtonClick = async () => {
    if (locationPinColor === "red") {  // ✅ Location validation only when icon is red
      Alert.alert(
        "Please Fetch Location",
        "You must fetch and save the location before proceeding.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
      return;
    }
    if (!callerName) {
        Alert.alert(
            "Please Select Call Type",
            "Please select a call type (Self or Joined).",
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: false }
        );
        return;
    }

    const user = await AsyncStorage.getItem("userInfor");
    const loginData = JSON.parse(user);

    // Find the selected reporting person's details based on callerName
    const selectedReportingPerson = reportingPersons.find(
        (person) => person.reporting_to_name === callerName
    );

    // ✅ Agar "Self" select kare toh reportingTo ko null rakho
    const reportingTo = selectedReportingPerson ? selectedReportingPerson.reporting_to : null;
    
    console.log("Selected Reporting To:", reportingTo);

    // Prepare outletData with callerName, callType, and reporting_to
    const outletData = {
        ...selectedoutletsdeatil,
        callerName,
        callType,
        reportingTo // ✅ "Self" ke case mein null hoga
    };

    console.log("Outlet Data:", outletData);

    // ✅ Navigation hamesha hona chahiye, chahe "Self" ho ya "Joined"
    if (loginData[0].division === 2) {
        navigation.navigate("ContactListScreen", { outletDetail: outletData });
    } else {
        navigation.navigate("RetailActivityScreen", { outletDetail: outletData });
    }
};




  // Fetch Outlet Details
  const selectOutletDetail = () => {
    const requestData = {
      outletID: itemId.outlet_id, // Pass the outlet ID
    };

    axios
      .post("https://devcrm.romsons.com:8080/SelectedOutlet", requestData, {
        headers: {
          "Content-Type": "application/json", // Set headers for the request
        },
      })
      .then((response) => {
        const outletDetail = response.data.data[0];
        console.log(outletDetail, 'commeeeeeeee');
        setOutletPinCode(outletDetail.pin);

    // Set the outlet details to the state
    setSelectedoutletsdeatial(outletDetail);
        
        // Extract the outlet details
        setSelectedoutletsdeatial(outletDetail);

        // Update state
      })

      .catch((error) => {
        console.error("Error fetching outlet details:", error);
      });
  };


  const reportingPerson = async () => {
    const user = await AsyncStorage.getItem("userInfor");
    const empid = JSON.parse(user);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      empid: empid[0].emp_id, // Extract the first element's emp_id
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      // Open modal and show loader immediately
      setReportingModalVisible(true);
      setLoading(true);

      const response = await fetch("https://devcrm.romsons.com:8080/Reporting_hierarchy", requestOptions);
      const result = await response.json(); // Parse the response as JSON

      if (result.error === false) {
        console.log("Dataa:", result.data);
        setReportingPersons(result.data || []); // Store reporting persons in state
      } else {
        setReportingPersons([]); // Handle error response
      }
    } catch (error) {
      console.error("Request failed:", error);
      setReportingPersons([]); // Handle network errors
    } finally {
      setLoading(false); // Hide loader
    }
  };


  const dealerNameList = async () => {
    const user = await AsyncStorage.getItem("userInfor");
    const empid = JSON.parse(user);
    const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "empidd": empid[0].emp_id,
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://devcrm.romsons.com:8080/Dealernamelist", requestOptions)
  .then((response) => response.json())
  .then((result) => {
    if(result.error == false) {
      console.log('comeee', result.data);
      setDealerName(result.data)
      
    }

  })
  .catch((error) => console.error(error));
  }




  const lastTwoVisitOrder = async () => {
    try {
      const user = await AsyncStorage.getItem("userInfor");
      const empid = JSON.parse(user);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
  
      const raw = JSON.stringify({
        "Outletid": itemId.outlet_id,
        "enterBy": empid[0].emp_id
      });
  
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };
  
      const response = await fetch("https://devcrm.romsons.com:8080/LastTwovisit_OrderHistory", requestOptions);
      const result = await response.json();
  
      if (result.error === false) {
        console.log("Response Data:", result.data);
  
        
        const orderData = result.data.filter(item => item.source === 'order');
        const activityData = result.data.filter(item => item.source === 'activity');
  
        console.log("Filtered Order Data:", orderData); 
        console.log("Filtered Activity Data:", activityData); 
  
        
        const filteredData = [
          ...orderData.map(order => ({ ...order, type: 'order' })), 
          ...activityData.map(activity => ({ ...activity, type: 'activity' }))
        ];
  
        console.log("Combined Data:", filteredData); 
  
        
        setOrderData(filteredData);
      } else {
        console.log("Error in response:", result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  






  const handleSelectReportingPerson = (person) => {
    setCallerName(person); // Set the selected reporting person's name as caller name
    setReportingModalVisible(false); // Close the reporting person modal
  };




  const [
    currentLongitude,
    setCurrentLongitude
  ] = useState('...');
  const [
    currentLatitude,
    setCurrentLatitude
  ] = useState('...');
  const [
    locationStatus,
    setLocationStatus
  ] = useState('');



  useEffect(() => {
    requestPermissions();
  }, []);


  Geolocation.getCurrentPosition(
    (position) => {
      const currentLongitude = JSON.stringify(position.coords.longitude);
      const currentLatitude = JSON.stringify(position.coords.latitude);

      // Do something with the latitude and longitude
      console.log("Longitude: ", currentLongitude, "Latitude: ", currentLatitude);
    },
    (error) => {
      if (error.code === 3) { // Code 3 is for timeout
        console.log("Location request timed out, handling silently.");
        // You could set a default location or retry logic here if needed
      } else {
        console.log("An error occurred: ", error.message);
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 60000,
      maximumAge: 1000
    }
  );


  const hasLocationPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.LOCATION,
      {
        title: 'Cool Weather App',
        message: 'Cool Weather App needs access to use your location',
        buttonNegative: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the app');
    } else {
      console.log('Location Permission Denied');
    } (error) => {
      console.warn(error);
    }
  }

  useEffect(() => {


    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        (position) => {
          // console.log("latitude",position.coords.latitude);
          lat = position.coords.latitude
          setLat(lat)
          console.log(lat);

          // console.log("longitude",position.coords.longitude);
          long = position.coords.longitude
          setLong(long)
          console.log(long);
        },
        (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }

  }, [])





  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
        subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            getOneTimeLocation();
            subscribeLocationLocation();
          } else {
            setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        setLocationStatus('You are Here');

        //getting the Longitude from the location json
        const currentLongitude =
          JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude =
          JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Longitude state
        setCurrentLatitude(currentLatitude);
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000
      },
    );
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      (position) => {
        //Will give you the location on location change

        setLocationStatus('You are Here');
        console.log(position);

        //getting the Longitude from the location json        
        const currentLongitude =
          JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude =
          JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);
        getAddress(currentLatitude, currentLongitude)
        console.log(currentLongitude, currentLatitude, "<<<<<<<<<<<<<<<");

      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000
      },
    );
  };


  const getAddress = async (lat, long) => {
    console.log('Fetching address for coordinates:', lat, long);
    setLoading(true); // Start loading

    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyC4cMHPr8PdH18gyzIJ6YMlTJSHEDGwvNM`;
      const response = await fetch(url);
      const data = await response.json();
      console.log('API response:', data);

      if (data.results && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        setAddress(address);
      } else {
        console.warn('No address found for the given coordinates.');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // End loading
    }
  }

  async function requestPermissions() {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'whenInUse',
      });
    }

    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
  }

  const HandleFetchAddress = () => {
    setHide(true);
    // Assuming you have current latitude and longitude values
    const lat = currentLatitude;
    const long = currentLongitude;
    getAddress(lat, long); // Call the function to fetch address
  }


  const jioAddress = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      outlet_id: itemId.outlet_id, // Ensure `itemId` is properly defined
      jio_address: address, // Ensure `address` is set dynamically
      outlet_lat: currentLatitude,
      outlet_long: currentLongitude
    });

    console.log("Request Payload:", raw);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch("https://devcrm.romsons.com:8080/jioAddress", requestOptions);
      const result = await response.json();

      if (result.error === false) {
        console.log("Success Response:", result);
        // setAddress(result.data);
        Alert.alert("Success", "Address updated successfully!");
        navigation.navigate(RouteName.HOME_SCREEN)
        setIsUpdated(true);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };


  
  

  useEffect(() => {
    setHide(false)
    selectOutletDetail();
    // reportingPerson();
    lastTwoVisitOrder();
  }, []);

  const openModal = () => {
    setModalVisible1(true);
    dealerNameList(); // Fetch dealer names
  };

  const isDarkMode = useSelector((state) => state.DarkReducer.isDarkMode);
  const currentColors = isDarkMode ? darkTheme : lightTheme;
  const OutletDetailStyles = useMemo(
    () => OutletDetailStyle(currentColors),
    [currentColors]
  );
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={OutletDetailStyles.scrollContainer}>
      <View style={OutletDetailStyles.mainContainer}>
        
        
<View style={OutletDetailStyles.buttonsRow}>
  {/* <TouchableOpacity
            style={[OutletDetailStyles.button, { backgroundColor: locationPinColor }]}
            onPress={HandleFetchAddress}
            disabled={locationPinColor === 'green'}
          >
            <Text style={OutletDetailStyles.buttonText}>Location Icon</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
  style={{
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
  }}
  onPress={HandleFetchAddress}
  disabled={locationPinColor === 'green'}
>
  {/* Background Circle */}
  <View
    style={{
      backgroundColor: locationPinColor,
      padding: 10,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Icon
      name="location-on"
      size={35}
      color={locationPinColor === 'green' ? 'black' : 'gray'}
    />
  </View>
  
  {/* Name Below Icon */}
  <Text style={{ fontSize: 12, color: '#128C7E', marginTop: 3 }}>Location</Text>
</TouchableOpacity>






<TouchableOpacity
    onPress={handleOrderButtonClick}
    style={{
      padding: 5,
      marginHorizontal: 14,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <VectorIcon icon="FontAwesome" size={35} color="#128C7E" name="shopping-cart" />
    <Text style={{ fontSize: 12, color: '#128C7E' }}>Order</Text>
  </TouchableOpacity>


    {/* <TouchableOpacity style={[OutletDetailStyles.button, { backgroundColor:'#128C7E' }]} onPress={handleActivityButtonClick}>
      <Text style={OutletDetailStyles.buttonText}>Activity</Text>
    </TouchableOpacity> */}

<TouchableOpacity
    style={{
      padding: 7,
      marginHorizontal: 8,
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={handleActivityButtonClick}
  >
    <VectorIcon icon="FontAwesome5" size={30} name="tasks" color="#128C7E" />
    <Text style={{ fontSize: 12, color: '#128C7E' }}>Activity</Text>
  </TouchableOpacity>

    {/* <TouchableOpacity style={[OutletDetailStyles.button, { backgroundColor:'#128C7E' }]} onPress={() => setModalVisible(true)}>
      <Text style={OutletDetailStyles.buttonText}>{callType}</Text>
    </TouchableOpacity> */}

<TouchableOpacity
    style={{
      padding: 7,
      marginHorizontal: 8,
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={() => setModalVisible(true)}
  >
    <Icon name="add-call" size={25} color="#128C7E" />
    {callType && (
      <Text style={{ color: '#128C7E', marginTop: 5, fontSize: 12 }}>
        {callType}
      </Text>
    )}
  </TouchableOpacity>



    {/* <TouchableOpacity style={[OutletDetailStyles.button, { backgroundColor:'#128C7E' }]} onPress={openModal}>
        <Text style={OutletDetailStyles.buttonText}>Dealer</Text>
      </TouchableOpacity> */}

      <TouchableOpacity style={{
      padding: 7,
      marginHorizontal: 8,
      justifyContent: 'center',
      alignItems: 'center',
    }} onPress={openModal}>
      <Icon name="person-add" size={30} color="#128C7E" />
      <Text style={{ fontSize: 12, color: '#128C7E' }}>Dealer</Text>
      </TouchableOpacity>
  </View>
  



        {/* Caller Name Container */}
        <View style={OutletDetailStyles.callerNameContainer}>
          <Text style={OutletDetailStyles.callerNameText}>
            Caller Name :
            <Text style={{ color: 'brown', fontSize: 12 }}> {callerName}</Text>
          </Text>
        </View>

        {/* <View style={OutletDetailStyles.callerNameContainer}>
          <Text style={OutletDetailStyles.callerNameText}>
            Caller Name :
            <Text style={{ color: 'brown', fontSize: 12 }}> {callerName}</Text>
          </Text>
        </View> */}

        <View style={OutletDetailStyles.callerNameContainer}>
          <Text style={OutletDetailStyles.callerNameText}>
            Delaer Name :
            <Text style={{ color: 'brown', fontSize: 12 }}> {selectedDealerName}</Text>
          </Text>
        </View>

        <View style={OutletDetailStyles.callerNameContainer}>
  {hide ? (
    <View style={OutletDetailStyles.addressContainer}>
      <Text style={OutletDetailStyles.callerNameText3}>
        {address} {/* Display the fetched address */}
      </Text>
      <TouchableOpacity
        style={OutletDetailStyles.saveButton}
        onPress={() => {
          // Extract pin code from the address dynamically (assuming pin code is embedded)
          const jioAddressPinCode = address.match(/\d+/) ? address.match(/\d+/)[0] : ''; // Ensure correct pin code format
          console.log("Extracted Pin Code from Address:", jioAddressPinCode);
          console.log("Outlet Pin Code from DB:", selectedoutletsdeatil.pin);

          // Check if the extracted pin code matches the one stored in the database (selectedoutletsdeatil.pin)
          if (jioAddressPinCode === selectedoutletsdeatil.pin) {
            console.log("Pin codes match! Proceeding to save the address.");
            // Pin codes match, so save the address
            jioAddress(); // Proceed with saving the address
          } else {
            console.log("Pin codes mismatch! Showing alert.");
            // Pin codes mismatch, show alert
            Alert.alert(
              "Location Mismatch",
              "Your current location does not match the outlet's stored location. You cannot proceed with saving the address.",
              [
                {
                  text: "OK",
                  onPress: () => {
                    // Navigate to Home screen after alert is dismissed
                    navigation.navigate(RouteName.HOME_SCREEN);
                  },
                },
              ]
            );
          }
        }}
      >
        <Text style={OutletDetailStyles.saveButtonText}>
          {isUpdated ? "Address Saved" : "Save"}
        </Text>
      </TouchableOpacity>
    </View>
  ) : null}
</View>

        <Modal
        transparent={true}
        visible={modalVisible1}
        animationType="fade"
        onRequestClose={() => setModalVisible1(false)}
      >
        <View style={OutletDetailStyles.modalOverlay4}>
          <View style={OutletDetailStyles.dropdownContainer4}>
            {loading ? (
              <ActivityIndicator size="medium" color="#0000ff" /> // Loader while fetching
            ) : (
              <ScrollView>
                {dealerName.length > 0 ? (
                  dealerName.map((dealer, index) => (
                    <TouchableOpacity
                      key={index}
                      style={OutletDetailStyles.option4}
                      onPress={() => {
                        console.log("Selected Dealer:", dealer.dealer_name);
                        setSelectedDealerName(dealer.dealer_name);
                        setModalVisible1(false); // Close modal on selection
                      }}
                    >
                      <Text style={OutletDetailStyles.optionText4}>{dealer.dealer_name}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={{ textAlign: "center", padding: 10 }}>
                    No Dealers Available
                  </Text>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
        {/* Modal for Call Type Selection */}
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)} // Close modal on back press
        >
          <View style={OutletDetailStyles.modalOverlay}>
            <View style={OutletDetailStyles.dropdownContainer}>
              <TouchableOpacity
                style={OutletDetailStyles.option}
                onPress={() => {
                  setCallType("Self"); // Set selected call type
                  setCallerName("Self"); // Update Caller Name
                  setModalVisible(false); // Close modal
                }}
              >
                <Text style={OutletDetailStyles.optionText}>Self</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={OutletDetailStyles.option}
                onPress={() => {
                  setCallType("Joined"); // Set selected call type
                  setModalVisible(false); // Close modal
                  reportingPerson(); // Fetch reporting persons and show the next modal
                }}
              >
                <Text style={OutletDetailStyles.optionText}>Joint Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          transparent={true}
          visible={reportingModalVisible}
          animationType="fade"
          onRequestClose={() => setReportingModalVisible(false)} // Close modal on back press
        >
          <View style={OutletDetailStyles.modalOverlay4}>
            <View style={OutletDetailStyles.dropdownContainer4}>
              {loading ? (
                <ActivityIndicator size="medium" color="#0000ff" /> // Show loader while fetching
              ) : (
                <ScrollView>
                  {reportingPersons.map((person, index) => (
                    <TouchableOpacity
                      key={index}
                      style={OutletDetailStyles.option4}
                      onPress={() => handleSelectReportingPerson(person.reporting_to_name)}
                    >
                      <Text style={OutletDetailStyles.optionText4}>{person.reporting_to_name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
        
        <View style={OutletDetailStyles.infoContainer}>
          <Text style={OutletDetailStyles.outletLabel}>Geo Address:</Text>
          <Text style={OutletDetailStyles.outletValue}>
            {selectedoutletsdeatil.jio_address}
          </Text>
        </View>

        <View style={OutletDetailStyles.infoContainer}>
          <View style={OutletDetailStyles.labelContainer}>
            <Text style={OutletDetailStyles.outletLabel}>Outlet_Id & Name:</Text>
          </View>

          <View style={OutletDetailStyles.labelContainer}>
            <Text style={OutletDetailStyles.outletValue}>{selectedoutletsdeatil.outlet_id} -  {selectedoutletsdeatil.outlet_name}</Text>
          </View>
        </View>


        <View style={OutletDetailStyles.infoContainer}>
          <Text style={OutletDetailStyles.outletLabel}>Address:</Text>
          <Text style={OutletDetailStyles.outletValue}>
            {selectedoutletsdeatil.address}  {selectedoutletsdeatil.pin}
          </Text>
        </View>

        <View style={OutletDetailStyles.infoContainer}>
          <View style={OutletDetailStyles.labelContainer1}>
            <Text style={OutletDetailStyles.outletLabel1}>Mobile:</Text>
            <Text style={OutletDetailStyles.outletLabel1}>Email:</Text>
          </View>
          <View style={OutletDetailStyles.valueContainer}>
            <Text
              style={[OutletDetailStyles.outletValue, { color: 'orange', fontWeight: 'bold' }]}
              onPress={() => {
                Linking.openURL(`tel:${selectedoutletsdeatil.phone_number}`);
              }}>
              {selectedoutletsdeatil.phone_number}
            </Text>


            <Text
              style={[OutletDetailStyles.outletValue, { color: 'orange', fontWeight: 'bold' }]}
              onPress={() => {
                Linking.openURL(`mailto:${selectedoutletsdeatil.email}`);
              }}>
              {selectedoutletsdeatil.email}
            </Text>

          </View>
        </View>

        <Spacing space={10} />



        {orderData.map((item, index) => {
  return (
    <View key={index} style={OutletDetailStyles.container3}>
      {/* Order Section */}
      {item.type === 'order' && (
        <>
          <Text style={OutletDetailStyles.headerText3}>Order ({item.m_orderID})</Text>

          <View style={OutletDetailStyles.row3}>
            <Text style={OutletDetailStyles.rowLabel3}>Outlet Id</Text>
            <Text style={OutletDetailStyles.rowValue3}>{item.outlet_id}</Text>
          </View>

          <View style={OutletDetailStyles.details3}>
            <View style={OutletDetailStyles.row3}>
              <Text style={OutletDetailStyles.rowLabel3}>SKU Name</Text>
              <Text style={OutletDetailStyles.rowValue3}>{item.sku_name}</Text>
            </View>

            <View style={OutletDetailStyles.row3}>
              <Text style={OutletDetailStyles.rowLabel3}>Order Date</Text>
              <Text style={OutletDetailStyles.rowValue3}>{new Date(item.date).toISOString().split('T')[0]}</Text>
            </View>

            <View style={OutletDetailStyles.row3}>
              <Text style={OutletDetailStyles.rowLabel3}>Qty</Text>
              <Text style={OutletDetailStyles.rowValue3}>{item.item_qty}</Text>
            </View>

            <View style={OutletDetailStyles.row3}>
              <Text style={OutletDetailStyles.rowLabel3}>Value</Text>
              <Text style={OutletDetailStyles.rowValue3}>{item.item_value}</Text>
            </View>

            <View style={OutletDetailStyles.row3}>
              <Text style={OutletDetailStyles.rowLabel3}>Scheme Discount</Text>
              <Text style={OutletDetailStyles.rowValue3}>{item.scheme_discount}</Text>
            </View>

            <View style={OutletDetailStyles.row3}>
              <Text style={OutletDetailStyles.rowLabel3}>Total</Text>
              <Text style={OutletDetailStyles.rowValue3}>{item.total}</Text>
            </View>
          </View>
        </>
      )}

      {/* Activity Section */}
      {item.type === 'activity' && (
        <>
          <Text style={OutletDetailStyles.headerText3}>{item.source}</Text>

          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'black', marginLeft: 10 }}>OrderID: </Text>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: 'brown' }}>{item.m_orderID}</Text>
          </View>

          <View style={OutletDetailStyles.row3}>
            <Text style={OutletDetailStyles.rowLabel3}>Outlet Id</Text>
            <Text style={OutletDetailStyles.rowValue3}>{item.outlet_id}</Text>
          </View>

          <View style={OutletDetailStyles.row3}>
            <Text style={OutletDetailStyles.rowLabel3}>Contact Person</Text>
            <Text style={OutletDetailStyles.rowValue3}>{item.contactPerson}</Text>
          </View>

          <View style={OutletDetailStyles.row3}>
            <Text style={OutletDetailStyles.rowLabel3}>Date</Text>
            <Text style={OutletDetailStyles.rowValue3}>{new Date(item.date).toISOString().split('T')[0]}</Text>
          </View>

          <View style={OutletDetailStyles.row3}>
            <Text style={OutletDetailStyles.rowLabel3}>Department</Text>
            <Text style={OutletDetailStyles.rowValue3}>{item.department}</Text>
          </View>

          <View style={OutletDetailStyles.row3}>
            <Text style={[OutletDetailStyles.rowLabel3, { marginRight: 10 }]}>SKU Name</Text>
            <Text style={[OutletDetailStyles.rowValue3, { flex: 1 }]}>{item.sku_name}</Text>
          </View>

          <View style={OutletDetailStyles.row3}>
            <Text style={OutletDetailStyles.rowLabel3}>Remarks</Text>
            <Text style={OutletDetailStyles.rowValue3}>{item.remark}</Text>
          </View>

          <View style={OutletDetailStyles.row3}>
            <Text style={OutletDetailStyles.rowLabel3}>Follow-up</Text>
            <Text style={OutletDetailStyles.rowValue3}>{item.followUp}</Text>
          </View>
        </>
      )}
    </View>
  );
})}





      </View>
    </ScrollView>
  );
};

export default OutletDetailScreen;
