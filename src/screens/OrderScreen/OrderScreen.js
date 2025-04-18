import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, FlatList, Alert } from "react-native";
import { Spacing, Button } from '../../components';
import { ApprovalStyle } from "../../styles";
import { Platform, PermissionsAndroid } from 'react-native';
import { useTranslation } from "react-i18next";
import { OrderStyle } from '../../styles/OrderStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from "react-redux";
import Geolocation from '@react-native-community/geolocation';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { darkTheme, lightTheme, SH } from "../../utils";
import { RouteName } from '../../routes';
import { setOrder, setSaleReturn, setResetOrder, setResetReturn } from "../../redux/action/orderActions";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Picker } from '@react-native-picker/picker'; // For dropdown
import { Divider } from "react-native-elements";

const OrderScreen = ({ route }) => {
  const { outletDetail } = route.params || {};
  const { callerName } = outletDetail;
  const { callType } = outletDetail;
  const { reportingTo } = outletDetail;
  const { dealerName } = outletDetail;
  const { dealerId } = outletDetail;
  const isDarkMode = useSelector((state) => state.DarkReducer.isDarkMode);
  const Colors = isDarkMode ? darkTheme : lightTheme;
  const orderData = useSelector((state) => state.order.orderData || []);
  const saleReturnData = useSelector((state) => state.order.saleReturnData || []);
  const ApprovalStyles = useMemo(() => ApprovalStyle(Colors), [Colors]);
  const OrderStyles = useMemo(() => OrderStyle(Colors), [Colors]);
  const { t } = useTranslation();
  const [disable, setDisable] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Item Order");
  const [selectedService, setSelectedService] = useState({});
  const [unitValue, setUnitValue] = useState({});
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();

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

  const alertdata = {
    'loginSuccess': t("Login_Successfull"),
    'invalid': t("Enter Valid Emp ID & Password")
  };

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

  /////////////////////Item Order//////////////////////////////////////////////

  useEffect(() => {
    console.log(orderData);

  }, [])


  const handleSaveOrder = () => {
    const isEmptyUnit = Object.values(unitInputs).every(unit => unit === "" || unit === 0);

    if (isEmptyUnit) {
      alert('Please enter unit fields');
      return;
    }


    const orderData = skuList
      .map((sku, index) => ({
        skuName: sku.sku_name,
        sku_price: sku.sku_price,
        itemvalue: unitInputs[index] || 0,
        amount: (unitInputs[index] || 0) * sku.sku_price,
        sku_gst: sku.sku_gst,
        sku_id: sku.sku_id
      }))
      .filter(order => order.itemvalue > 0);

    const totalOrderValue = orderData.reduce((total, item) => total + item.amount, 0).toFixed(2);

    console.log('Order Data:', orderData);
    //   console.log('Total Order Value:', totalOrderValue);

    setUnitInputs({}); // Clear inputs after saving
    dispatch(setOrder(orderData)); // Dispatch the order data
    alert('Order saved in draft', 'Order has been saved successfully!');
  };

  const handleUnitChanges = (index, value) => {
    const updatedUnits = { ...unitInputs, [index]: value };

    // Calculate amount for the updated SKU
    const amount = (value || 0) * skuList[index].sku_price;

    // Calculate total order value locally
    const totalOrderValue = Object.entries(updatedUnits).reduce((total, [idx, unit]) => {
      const price = skuList[idx]?.sku_price || 0;
      return total + (unit || 0) * price;
    }, 0).toFixed(2);

    // Update state for units and log results
    setUnitInputs(updatedUnits);
    console.log(`SKU Index: ${index}, Amount: ${amount}`);
    console.log(`Updated Total Order Value: ${totalOrderValue}`);
  };


  //////////////////////////////////Return order////////////////////////////////
  const handleSaveReturn = () => {


    try {
      const isAnyUnitEntered = Object.values(unitValue).some((value) => value > 0);

      if (!isAnyUnitEntered) {
        alert('Please enter units');
        return; // Exit if no unit is entered
      }

      // Filter and map relevant items only
      const filteredData = skuList
        .filter((sku, index) => unitValue[index] > 0 || selectedService[index]) // Filter relevant items
        .map((sku, index) => ({
          skuName: sku.sku_name,
          unit: unitValue[index] || 0,
          ITM: selectedService[index] || '',
          itmgst: sku.sku_gst,
          value: (unitValue[index] || 0) * sku.sku_price,
          price: sku.sku_price,
          itemId: sku.sku_id

        }));



      console.log('Order Dataa:', filteredData);

      // Dispatch to Redux
      dispatch(setSaleReturn(filteredData));

      // Reset inputs
      setUnitValue({});
      setSelectedService({});

      // Alert success message
      alert('Sale return data saved successfully');
    } catch (error) {
      console.error("Error saving sale return data:", error);
      alert('An error occurred while saving the sale return data.');
    }
  };

  const HandleSaveOrderSummury = () => {
    setLoading(true);  // Loader ko show karein
    setDisable(true);
    setDisable(true);
    if (orderData.length > 0) {
      orderSubmit()
    } else {
      returnSubmit()
    }
  }

  

  const orderSubmit = async () => {
    try {
      const user = await AsyncStorage.getItem("userInfor");
      const empid = JSON.parse(user);

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      console.log(outletDetail, "outletDetail");


      const raw = JSON.stringify({
        outletID: outletDetail.outlet_id,
        pnumber: outletDetail.phone_number,
        joinedName: outletDetail.callerName,
        callType: outletDetail.callType,
        employeeID: empid[0].emp_id,
        enterBy: empid[0].emp_id,
        joinedid: outletDetail.reportingTo,
        schemdiscount: "10",
        totalquantity: orderData.reduce((total, item) => Number(total) + Number(item.itemvalue), 0),
        discountamount: orderData.reduce((total, item) => total + item.amount, 0),
        zone: outletDetail.zone_id,
        division: outletDetail.division_id,
        lat: currentLatitude,
        lag: currentLongitude,
        dealer_id: outletDetail.dealerId,
        reporting_to_user_id: empid[0].reporting_to,
        beat_id: outletDetail.beat_id,
        item_discount: "5",
        detail: orderData
      });

      console.log(raw, 'orderrrrrr');
      


      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch("https://devcrm.romsons.com:8080/orderfilleds", requestOptions);
      const result = await response.json();
      console.log("Server Responseffff:", result);
      setLoading(false);
      // Display success alert
      if (saleReturnData.length == 0) {
        setDisable(false);
        Alert.alert("Success", "order submitted successfully!");
        dispatch(setResetOrder(orderData));
        navigation.navigate(RouteName.HOME_SCREEN);
      }



      if (saleReturnData.length > 0) {
        returnSubmit()
      }


    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to submit order. Please try again.");
      setLoading(false);
    }
  };


  const returnSubmit = async () => {
    try {
      const user = await AsyncStorage.getItem("userInfor");
      const empid = JSON.parse(user);

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      console.log(outletDetail, "outletDetail");


      const raw = JSON.stringify({
        outletID: outletDetail.outlet_id,
        pnumber: outletDetail.phone_number,
        joinedName: outletDetail.callerName,
        callType: outletDetail.callType,
        employeeID: empid[0].emp_id,
        enterBy: empid[0].emp_id,
        schemdiscountreturn: "10",
        totalquantityreturn: orderData.reduce((total, item) => Number(total) + Number(item.itemvalue), 0),
        discountamountreturn: orderData.reduce((total, item) => total + item.amount, 0),
        zone: outletDetail.zone_id,
        division: outletDetail.division_id,
        lat: currentLatitude,
        lag: currentLongitude,
        dealer_id: outletDetail.dealer_id,
        reporting_to_user_id: empid[0].reporting_to,
        beat_id: outletDetail.beat_id,
        item_discount: "5",
        detail: saleReturnData
      });


      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch("https://devcrm.romsons.com:8080/orderreturn", requestOptions);
      const result = await response.json();
      setLoading(false);
      // Display success alert
      if (orderData.length == 0) {
        Alert.alert("Success", "return submitted successfully!");
      } else {
        Alert.alert("Success", "order & return submitted successfully!");
      }

      dispatch(setResetReturn(saleReturnData));
      dispatch(setResetOrder(orderData));
      setDisable(false);
      navigation.navigate(RouteName.HOME_SCREEN);


    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to submit order. Please try again.");
      setLoading(false);
    }
  };




  // const handleUnitChanges = (index, value) => {
  //   // Update unit value for the current SKU
  //   const updatedUnits = { ...unitInputs, [index]: value };
  //   setUnitInputs(updatedUnits);
  // };


  const handleUnitChange = (value, index) => {
    setUnitValue((prev) => ({ ...prev, [index]: value }));
  };

  const handlePickerChange = (value, index) => {
    setSelectedService((prev) => ({ ...prev, [index]: value }));
  };
  // Unit input field value

  const [skuList, setSkuList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unitInputs, setUnitInputs] = useState({});
  const allSkuList = async () => {
    setLoading(true); // Start loading
    try {
      const user = await AsyncStorage.getItem("userInfor");
      const empid = JSON.parse(user);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        division: empid[0].division,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch("https://devcrm.romsons.com:8080/skulist", requestOptions);
      const result = await response.json();

      if (result.error === false) {
        setSkuList(result.data);
        // console.log(skuList,"Line 150")
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    allSkuList();
  }, [])

  return (
    <View style={ApprovalStyles.container}>

      {/* Tab Selection */}
      <View style={ApprovalStyles.tabContainer}>
        <TouchableOpacity
          style={[ApprovalStyles.tabButton, selectedTab === "Item Order" && ApprovalStyles.selectedTabButton]}
          onPress={() => setSelectedTab("Item Order")}
        >
          <Text style={[ApprovalStyles.tabText, selectedTab === "Item Order" && ApprovalStyles.selectedTabText]}>
            {t("Item Order")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[ApprovalStyles.tabButton, selectedTab === "Sale Return" && ApprovalStyles.selectedTabButton]}
          onPress={() => setSelectedTab("Sale Return")}
        >
          <Text style={[ApprovalStyles.tabText, selectedTab === "Sale Return" && ApprovalStyles.selectedTabText]}>
            {t("Sale Return")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[ApprovalStyles.tabButton, selectedTab === "Order Summary" && ApprovalStyles.selectedTabButton]}
          onPress={() => setSelectedTab("Order Summary")}
        >
          <Text style={[ApprovalStyles.tabText, selectedTab === "Order Summary" && ApprovalStyles.selectedTabText]}>
            {t("Order Summary")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Item Order UI */}
      {selectedTab === "Item Order" && (
        <>
          {loading ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="xl" color="gray" />
              <Text>Loading...</Text>
            </View>
          ) : (
            <FlatList
              data={skuList}
              keyExtractor={(item, index) => index.toString()} // Use index as the key
              contentContainerStyle={{ paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => {
                const unit = unitInputs[index] || ""; 
                const amount = unit * item.sku_price; 

                return (
                  <TouchableOpacity key={index} style={OrderStyles.PaddingHorizontal}>
                    <View style={OrderStyles.taskContainer}>
                      <View style={OrderStyles.taskDetails}>
                        {/* SKU Name */}
                        <Text style={OrderStyles.taskName}>{item.sku_name}</Text>

                        {/* Price, Segment, and Unit input */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={OrderStyles.taskDate}>Price :</Text>
                            <Text style={OrderStyles.taskDate}>
                              <Text style={{ color: 'brown' }}>{item.sku_price}</Text>
                            </Text>
                            <Text style={OrderStyles.taskTime}>Seg :</Text>
                            <Text style={OrderStyles.taskTime}>
                              <Text style={{ color: 'brown' }}>{item.segment_code}</Text>
                            </Text>
                          </View>

                          <TextInput
                            style={[OrderStyles.inputBox, { marginLeft: 10, width: 100, justifyContent: "center", alignItems: "center" }]}
                            placeholder="Enter unit"
                            keyboardType="numeric"
                            value={unit.toString()} // Show the unit value for this SKU
                            onChangeText={(value) => {
                              // Check if the value is a valid number and does not exceed 5 digits
                              if (value.length <= 5 && /^[0-9]*$/.test(value)) {
                                handleUnitChanges(index, value); // Update the unit for this SKU
                              } else {
                                alert('Please enter up to 5 digits only');
                              }
                            }}// Update the unit for this SKU
                          />
                        </View>

                        {/* Amount */}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={OrderStyles.taskTime1}>Amt : </Text>
                          <Text style={OrderStyles.taskTime1}>
                            <Text style={{ color: 'brown' }}>{amount.toFixed(2)}</Text>
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}

          <View style={OrderStyles.footerContainer}>
            <View style={OrderStyles.footerItemContainer}>
              <Text style={OrderStyles.footerLabel}>Unit</Text>
              <Text style={OrderStyles.footerValue}>
                {Object.values(unitInputs).reduce((total, unit) => total + (parseFloat(unit) || 0), 0)}
              </Text>
            </View>

            <Divider style={OrderStyles.divider} />

            <View style={OrderStyles.footerItemContainer}>
              <Text style={OrderStyles.footerLabel}>Order Value</Text>
              <Text style={OrderStyles.footerValue}>
                {skuList.reduce((total, sku, index) => {
                  const unit = unitInputs[index] || 0;
                  return total + (unit * sku.sku_price);
                }, 0).toFixed(2)}
              </Text>
            </View>

            <Divider style={OrderStyles.divider1} />

            <TouchableOpacity style={OrderStyles.footerButton} onPress={handleSaveOrder}>
              <Text style={OrderStyles.footerButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </>
      )}





      {/* Sale Return UI */}
      {selectedTab === "Sale Return" && (
        <>
          <FlatList
            data={skuList}
            keyExtractor={(item, index) => index.toString()} // or use a unique identifier
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity style={OrderStyles.PaddingHorizontal1} key={index}>
                <View style={OrderStyles.taskContainer1}>
                  <View style={OrderStyles.taskDetails}>
                    {/* Product Name */}
                    <Text style={OrderStyles.taskName1}>{item.sku_name}</Text>

                    {/* Unit Input Field & Dropdown in Single Row */}
                    <View style={OrderStyles.rowContainer}>
                      {/* TextInput */}
                      <TextInput
                        style={OrderStyles.inputBox1}
                        placeholder="Enter unit"
                        value={unitValue[index] || ''}
                        onChangeText={(value) => handleUnitChange(value, index)}
                        keyboardType="numeric"
                      />
                      <Spacing space={20} />
                      <TouchableOpacity style={OrderStyles.dropdownContainer}>
                        <Picker
                          selectedValue={selectedService[index] || ''}
                          onValueChange={(itemValue) => handlePickerChange(itemValue, index)}
                          style={OrderStyles.dropdownPicker}
                        >
                          <Picker.Item label="Choose Service" value="" />
                          <Picker.Item label="Sampling" value="sampling" />
                          <Picker.Item label="Damage" value="damage" />
                          <Picker.Item label="Non Moving" value="non_moving" />
                          <Picker.Item label="Expired" value="expired" />
                          <Picker.Item label="Others" value="others" />
                        </Picker>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
          {/* Footer for Sale Return with Save Button */}
          <View style={OrderStyles.saleReturnFooterContainer}>
            <TouchableOpacity style={OrderStyles.footerButton1} activeOpacity={0.7} // Provides visual feedback when pressed
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={OrderStyles.footerButtonText1} onPress={handleSaveReturn}>Save</Text>
            </TouchableOpacity>
          </View>
        </>
      )}


      {/* Order Summary UI */}
      {selectedTab === "Order Summary" && (
        <ScrollView>
          <View style={OrderStyles.PaddingHorizontal6}>
            {/* <TouchableOpacity style={OrderStyles.footerButton5} onPress={HandleGenrateSummary}>
        <Text style={OrderStyles.footerButtonText5}>Generate Summary</Text>
      </TouchableOpacity> */}

            <View style={OrderStyles.taskContainer2}>

              {/* Outlet Information Section */}
              <View style={OrderStyles.outletInfoContainer}>
                <View style={OrderStyles.outletRow}>
                  <Text style={OrderStyles.outletLabel}>Outlet:</Text>
                  <Text style={OrderStyles.outletValue}>{outletDetail?.outlet_name}</Text>
                </View>
                <View style={OrderStyles.outletRow}>
                  <Text style={OrderStyles.outletLabel}>Joined Name: </Text>
                  <Text style={OrderStyles.outletValue}>{outletDetail?.callerName}</Text>
                </View>
                <View style={OrderStyles.outletRow}>
                  <Text style={OrderStyles.outletLabel}>Mobile No:</Text>
                  <Text style={OrderStyles.outletValue}>{outletDetail?.phone_number}</Text>
                </View>
                <View style={OrderStyles.outletRow}>
                  <Text style={OrderStyles.outletLabel}>Outlet Type:</Text>
                  <Text style={OrderStyles.outletValue}>{outletDetail?.outlet_category_name}</Text>
                </View>

                <View style={OrderStyles.outletRow}>
                  <Text style={OrderStyles.outletLabel}>Dealer Name:</Text>
                  <Text style={OrderStyles.outletValue}>{outletDetail?.dealerName}</Text>
                </View>


                <View style={OrderStyles.totalContainer}>
                  <Text>
                    <Text style={[OrderStyles.totalText, { color: 'black' }]}>Total: </Text>
                    <Text style={[OrderStyles.totalText, { color: 'green' }]}>₹{orderData.reduce((total, item) => total + item.amount, 0)}</Text>
                  </Text>
                </View>

              </View>

              <View style={OrderStyles.divider5} />

              {/* Order Summary */}
              <Text style={OrderStyles.summaryHeading}>Order Summary</Text>
              <View style={OrderStyles.taskContainer9}>

                {/* Table Header */}
                <View style={OrderStyles.summaryTableHeader}>
                  <Text style={OrderStyles.tableHeaderTextLeft}>SKU Name</Text>
                  <Text style={OrderStyles.tableHeaderText}>Price</Text>
                  <Text style={OrderStyles.tableHeaderText}>Unit</Text>
                  <Text style={OrderStyles.tableHeaderText}>Amt</Text>
                  <Text style={OrderStyles.tableHeaderText}>GST%</Text>
                  <Text style={OrderStyles.tableHeaderText}>Net Amt</Text>
                </View>

                {/* Order Item Rows */}
                {orderData?.map((res, ind) => {
                  return (
                    <View style={OrderStyles.tableRow} key={ind}>
                      <View style={OrderStyles.tableCellLeft}>
                        <Text style={OrderStyles.tableDataLeft}>{res?.skuName}</Text>
                      </View>
                      <View style={OrderStyles.tableCell}>
                        <Text style={OrderStyles.tableData}>{res?.sku_price}</Text>
                      </View>
                      <View style={OrderStyles.tableCell}>
                        <Text style={OrderStyles.tableData1}>{res?.itemvalue}</Text>
                      </View>
                      <View style={OrderStyles.tableCell} numberOfLines={1} // Ensure text stays on one line
                        ellipsizeMode="tail" >
                        <Text style={OrderStyles.tableData56}>{res?.amount}</Text>
                      </View>
                      <View style={OrderStyles.tableCell}>
                        <Text style={OrderStyles.tableData1}>{res?.sku_gst}%</Text>
                      </View>
                      <View style={OrderStyles.tableCell}>
                        <Text style={OrderStyles.tableData}>
                          {(res?.sku_price * res?.sku_gst / 100 + res?.amount).toFixed(2)}
                        </Text>
                      </View>
                    </View>

                  )
                })}


                {/* Total Row */}
                <View style={OrderStyles.totalRow}>
                  <Text style={OrderStyles.tableDataLeft6}>Total</Text>
                  <Text style={OrderStyles.tableData}>-</Text>
                  <View style={OrderStyles.tableCellLeft}>
                    <Text style={OrderStyles.tableData91}>{orderData.reduce((total, item) => Number(total) + Number(item.itemvalue), 0)}</Text>
                  </View>
                  <Text style={OrderStyles.tableData8}>{orderData.reduce((total, item) => total + item.amount, 0)}</Text>
                  <Text style={OrderStyles.tableData0}>-</Text>
                  <Text style={{ color: 'black', fontWeight: 'bold' }}> {orderData.reduce(
                    (total, item) => total + item.sku_price * item.sku_gst / 100 + item.amount,
                    0
                  ).toFixed(2)}</Text>
                </View>
              </View>

              {/* Return Section */}
              <Text style={OrderStyles.summaryHeading}>Return</Text>
              <View style={OrderStyles.taskContainer9}>

                {/* Table Header */}
                <View style={OrderStyles.summaryTableHeader}>
                  <Text style={OrderStyles.tableHeaderTextLeft}>SKU Name</Text>
                  <Text style={OrderStyles.tableHeaderText}>Price</Text>
                  <Text style={OrderStyles.tableHeaderText}>Unit</Text>
                  <Text style={OrderStyles.tableHeaderText}>Amt</Text>
                  <Text style={OrderStyles.tableHeaderText}>GST%</Text>
                  <Text style={OrderStyles.tableHeaderText}>Net Amt</Text>
                </View>

                {/* Return Item Rows */}

                {saleReturnData?.map((response, index) => {
                  return (
                    <View style={OrderStyles.tableRow} key={index}>
                      {/* SKU Name and Service */}
                      <View style={OrderStyles.tableCellLeft}>
                        <View style={{ flex: 1, flexDirection: 'column', marginLeft: 0 }}>
                          <Text style={OrderStyles.tableDataLeft}>{response?.skuName}</Text>
                          <Text style={OrderStyles.tableDataLeft}>{response?.ITM}</Text>
                        </View>
                      </View>

                      {/* Price */}
                      <View style={OrderStyles.tableCell}>
                        <Text style={OrderStyles.tableData}>{response?.price}</Text>
                      </View>

                      {/* Unit */}
                      <View style={OrderStyles.tableCell}>
                        <Text style={OrderStyles.tableData}>{response?.unit}</Text>
                      </View>

                      {/* Amount */}
                      <View style={OrderStyles.tableCell}>
                        <Text style={OrderStyles.tableData}>{response?.value}</Text>
                      </View>

                      {/* GST */}
                      <View style={OrderStyles.tableCell}>
                        <Text style={OrderStyles.tableData}>{response?.itmgst}%</Text>
                      </View>

                      {/* Net Amount */}
                      <View style={OrderStyles.tableCell}>
                        <Text style={OrderStyles.tableData}>
                          {(response?.price * response?.itmgst / 100 + response?.value).toFixed(2)}
                        </Text>
                      </View>
                    </View>

                  )
                })}


                <View style={OrderStyles.totalRow}>
                  <Text style={OrderStyles.tableDataLeft6}>Total</Text>
                  <Text style={OrderStyles.tableData}>-</Text>
                  <View style={OrderStyles.tableCellLeft}>
                    <Text style={OrderStyles.tableData9}>{saleReturnData.reduce((total, item) => Number(total) + Number(item.unit), 0)}</Text>
                  </View>
                  <View style={OrderStyles.tableCell}>
                    <Text style={OrderStyles.tableData8}>{saleReturnData.reduce((total, item) => total + item.value, 0)}</Text>
                  </View>
                  <Text style={{ color: 'black', fontWeight: 'bold' }}> {saleReturnData.reduce(
                    (total, item) => total + item.price * item.itmgst / 100 + item.value,
                    0
                  ).toFixed(2)}</Text>
                </View>
              </View>
            </View>
            {saleReturnData.length > 0 || orderData.length > 0 ? (
  <TouchableOpacity style={{ padding: 2, marginVertical: 3 }} activeOpacity={0.9}>
    {loading ? (
      <ActivityIndicator size="large" color="green" />
    ) : (
      <Text style={OrderStyles.footerButtonText8} onPress={HandleSaveOrderSummury} disabled={disable}>
        Final Submit
      </Text>
    )}
  </TouchableOpacity>
) : (
  <TouchableOpacity style={{ padding: 2, marginVertical: 3 }}>
    <Button buttonStyle={OrderStyles.footerButtonText8} title={t("Final Submit")} />
  </TouchableOpacity>
)}



          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default OrderScreen;
