import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, Button, Modal, TouchableOpacity, StyleSheet, Platform, ScrollView, loading } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { darkTheme, Fonts, lightTheme, SF, SH } from "../../utils";
import { OrderHistoryStyle } from '../../styles/OrderHistoryStyle';
import { useSelector } from "react-redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import { format, parseISO } from "date-fns";
import { HomeDropDown } from '../../components';

const OrderHistoryScreen = () => {
  const isDarkMode = useSelector(state => state.DarkReducer.isDarkMode);
  const currentColors = isDarkMode ? darkTheme : lightTheme;
  const Colors = isDarkMode ? darkTheme : lightTheme;
  const OrderHistoryStyles = useMemo(() => OrderHistoryStyle(currentColors), [currentColors]);
  const [isBeatModalVisible, setBeatModalVisible] = useState(false);
  const [isOutletModalVisible, setOutletModalVisible] = useState(false);
  const [selectedBeat, setSelectedBeat] = useState([]);
  let [selectbtname, setSelectbtname] = React.useState('');
  let [selectbtid, setSelectbtid] = React.useState('');
  const [selectedOutlet, setSelectedOutlet] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(" ");
  const [userBeatId, setUserBeatId] = useState(null);
  let [selectedOutletname, setSelectedOutletname] = useState('');
  const [selectot, setSelectot] = useState('');
  const [selectoutlets, setSelectoutlets] = useState([]);
  const [historyOrderData, setHistoryOrderData] = useState([]);
  const [months, setMonths] = useState([]);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [teamLists, setTeamLists] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [showTeamData, setShowTeamData] = useState(false)

  useEffect(() => {
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();

    const currentMonthShort = currentDate.toLocaleString('default', { month: 'short' });
    const currentMonthFull = currentDate.toLocaleString('default', { month: 'long' });

    const prevDate = new Date(currentDate);
    prevDate.setMonth(currentMonthIndex - 1);
    const previousMonthShort = prevDate.toLocaleString('default', { month: 'short' });
    const previousMonthFull = prevDate.toLocaleString('default', { month: 'long' });

    const formattedMonths = [
      { label: previousMonthFull, value: previousMonthShort },
      { label: currentMonthFull, value: currentMonthShort },
    ];

    setMonths(formattedMonths);
    setSelectedMonth(currentMonthShort); // default
    handleMonthSelection(currentMonthShort); // default call
  }, []);

  const openModal = async () => {
    setModalVisible1(true);
    const user = await AsyncStorage.getItem("userInfor");
    const empid = JSON.parse(user);
    await teamList();

  };



  const teamList = async () => {
    const user = await AsyncStorage.getItem("userInfor");
    const empid = JSON.parse(user);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "enterBy": empid[0].emp_id,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("https://devcrm.romsons.com:8080/ManagerTeam", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.error == false) {
          // console.log('listttt', result.data);
          setTeamLists(result.data)

        }
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    console.log("Updated teamLists:", teamLists);
  }, [teamLists]);


  const handleMonthSelection = (month) => {
    setSelectedMonth(month);

    const currentYear = moment().year();
    const monthsAbbrev = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIndex = monthsAbbrev.indexOf(month);

    if (monthIndex === -1) {
      console.warn("Invalid month selected:", month);
      return;
    }

    const fromDate = moment(`${currentYear}-${(monthIndex + 1).toString().padStart(2, '0')}-01`).format("YYYY-MM-DD");
    const toDate = moment(fromDate).endOf("month").format("YYYY-MM-DD");

    console.log("Selected Month:", month);
    console.log("Request Payload:", { fromDate, toDate });

    if (fromDate && toDate) {
      OrderHistory_MIS(fromDate, toDate);
    }
  };

  const selectBeat = async () => {
    try {
      const user = await AsyncStorage.getItem('userInfor');
      const empid = JSON.parse(user);

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({ "empID": empid[0].emp_id });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const response = await fetch("https://devcrm.romsons.com:8080/SelectedBeat", requestOptions);
      const result = await response.json();

      if (result.data.length > 0) {
        setSelectedBeat(result.data.map(beat => ({ beat_id: beat.beat_id, beat_name: beat.beat_name })));
      } else {
        setSelectedBeat([]);
      }

      setBeatModalVisible(true);
    } catch (error) {
      console.error("Error fetching beats:", error);
    }
  };


  const handleBeatSelect = (beat) => {
    setSelectbtname(beat.beat_name);
    setSelectbtid(beat.beat_id);
    console.log("Selected Beat Name:", beat.beat_name);
    console.log("Selected Beat ID:", beat.beat_id);
    setBeatModalVisible(false);
  };


  const selectOutlet = async () => {
    console.log('Selected Beat ID:', selectbtid);

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({ "BeatID": selectbtid });
      console.log('Request Body:', raw);

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      const response = await fetch("https://devcrm.romsons.com:8080/SelectOutlet_OrderHistory", requestOptions);
      const result = await response.json();

      if (result.error === false) {
        setSelectoutlets(result.data);
        setOutletModalVisible(true);
      }
    } catch (error) {
      console.error("Error fetching outlets:", error);
    }
  };



  const handleOutletSelect = (outletId, outletName) => {
    setSelectot(outletId);
    setSelectedOutletname(outletName);
    setOutletModalVisible(false);
  };






  const OrderHistory_MIS = async (fromDate, toDate) => {
    try {
      const user = await AsyncStorage.getItem('userInfor');
      const empid = JSON.parse(user);

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "fromDate": fromDate,
        "toDate": toDate,
        "Outletid": selectot,
        "enterBy": empid[0].emp_id
      });

      console.log('Request payload:', raw);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const response = await fetch("https://devcrm.romsons.com:8080/OrderHistory_MIS", requestOptions);
      const result = await response.json();

      console.log('API Response:', result);

      if (result?.error === false) {
        console.log('Order history data:', result.data);
        setHistoryOrderData(result.data);
      } else {
        console.log('No data found for the selected period');
        setHistoryOrderData([]);
      }
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
  };




  return (
    <View style={OrderHistoryStyles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity style={[OrderHistoryStyles.pendingButton, { marginRight: 10 }]} onPress={openModal}>
          <Text style={OrderHistoryStyles.pendingText}>Team</Text>
        </TouchableOpacity>
        {selectedTeam && (
          <Text style={OrderHistoryStyles.selectedTeamText}>{selectedTeam}</Text>
        )}

        <TouchableOpacity style={[OrderHistoryStyles.pendingButton, { marginRight: 10 }]} onPress={selectBeat}>
          <Text style={OrderHistoryStyles.pendingText}>Beat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={OrderHistoryStyles.pendingButton}
          onPress={() => {
            if (!selectbtid) {
              alert("Firstly Select Beat");
            } else {
              selectOutlet(selectbtid);
            }
          }}
        >
          <Text style={OrderHistoryStyles.pendingText}>Outlet</Text>
        </TouchableOpacity>
      </View>


      {/* Beat Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isBeatModalVisible}
        onRequestClose={() => setBeatModalVisible(false)}
      >
        <View style={OrderHistoryStyles.modalOverlay}>
          <View style={OrderHistoryStyles.modalContainer}>
            <Text style={OrderHistoryStyles.modalTitle}>Select Beat</Text>
            <View style={OrderHistoryStyles.divider} />

            {selectedBeat.length > 0 ? (
              selectedBeat.map((beat, index) => (
                <TouchableOpacity
                  key={index}
                  style={OrderHistoryStyles.dateContainer}
                  onPress={() => handleBeatSelect(beat)}
                >
                  <Text style={OrderHistoryStyles.dateText}>{beat.beat_name}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={OrderHistoryStyles.dateText}>No Beats Available</Text>
            )}

            <TouchableOpacity
              style={OrderHistoryStyles.closeButton}
              onPress={() => setBeatModalVisible(false)}
            >
              <Text style={OrderHistoryStyles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Text>{selectedTeam}</Text>
      <Text style={OrderHistoryStyles.selectedText}>
        Selected Beat :
        <Text style={{ color: 'black', fontSize: 13, fontWeight: 'bold' }}>
          {selectbtname}
        </Text>
      </Text>

      {/* Outlet Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isOutletModalVisible}
        onRequestClose={() => setOutletModalVisible(false)}
      >
        <View style={OrderHistoryStyles.modalOverlay}>
          <View style={OrderHistoryStyles.modalContainer}>
            <Text style={OrderHistoryStyles.modalTitle}>Select Outlet</Text>
            <View style={OrderHistoryStyles.divider} />

            <ScrollView>
              {selectoutlets.length > 0 ? (
                selectoutlets.map((outlet, index) => (
                  <TouchableOpacity
                    key={index}
                    style={OrderHistoryStyles.dateContainer}
                    onPress={() => handleOutletSelect(outlet.outlet_id, outlet.outlet_name)}
                  >
                    <Text style={OrderHistoryStyles.dateText}>{outlet.outlet_name}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={OrderHistoryStyles.dateText}>Firstly Select Beat</Text>
              )}
            </ScrollView>

            <TouchableOpacity
              style={OrderHistoryStyles.closeButton}
              onPress={() => setOutletModalVisible(false)}
            >
              <Text style={OrderHistoryStyles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      <Modal
        transparent={true}
        visible={modalVisible1}
        animationType="fade"
        onRequestClose={() => setModalVisible1(false)}
      >
        <View style={OrderHistoryStyles.modalOverlay4}>
          <View style={OrderHistoryStyles.dropdownContainer4}>
            {loading ? (
              <ActivityIndicator size="medium" color="#0000ff" />
            ) : (
              <ScrollView>
                {teamLists.length > 0 ? (
                  teamLists.map((team, index) => (
                    <TouchableOpacity
                      key={index}
                      style={OrderHistoryStyles.option4}
                      onPress={async () => {
                        // console.log("Selected team:", team.reporting_person_name);
                        setSelectedTeam(team.reporting_person_name);
                        // await teamData(team)
                        setModalVisible1(false);
                      }}
                    >
                      <Text style={OrderHistoryStyles.optionText4}>{team.reporting_person_name}</Text>
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

      <Text style={OrderHistoryStyles.selectedText}>
        Selected Outlet:
        <Text style={{ color: 'black', fontSize: 13, fontWeight: 'bold' }}>
          {selectedOutletname}
        </Text>
      </Text>

      {/* Month Picker */}
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
      <HomeDropDown
        value={selectedMonth}
        setValue={handleMonthSelection}
        data={months}
        placeholder="Choose Month"
      />
    </View>

      {/* Order History Section (Corrected) */}
      <ScrollView contentContainerStyle={{ paddingBottom: 5 }}>
        <View>
          {historyOrderData && Object.keys(historyOrderData).length > 0 ? (
            Object.entries(historyOrderData).map(([date, orders]) => {
              const totalTaxableValue = orders
                .reduce((total, order) => total + parseFloat(order.taxable_value), 0)
                .toFixed(2);

              return (
                <View key={date} style={{ marginTop: 10 }}>
                  <View style={OrderHistoryStyles.infoContainer}>
                    <Text style={OrderHistoryStyles.hospitalText}>{date} ({orders[0].order_id})</Text>
                  </View>


                  <View style={OrderHistoryStyles.skuContainer}>
                    <View style={OrderHistoryStyles.skuHeaderRow}>
                      <Text style={OrderHistoryStyles.skuHeaderText}>SKU Name</Text>
                      <Text style={OrderHistoryStyles.skuHeaderText}>Unit Price</Text>
                      <Text style={OrderHistoryStyles.skuHeaderText}>Unit</Text>
                      <Text style={OrderHistoryStyles.skuHeaderText}>Amount</Text>
                    </View>

                    {orders.map((order, index) => (
                      <View style={OrderHistoryStyles.skuDataRow} key={index}>
                        <Text style={OrderHistoryStyles.skuText}>{order.sku_name}</Text>
                        <Text style={OrderHistoryStyles.skuText}>{order.unit_price}</Text>
                        <Text style={OrderHistoryStyles.skuText}>{order.unit}</Text>
                        <Text style={OrderHistoryStyles.skuText}>{order.taxable_value}</Text>
                      </View>
                    ))}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <Text style={{ marginHorizontal: 10, color: 'black', fontWeight: 'bold' }}>Total</Text>
                      <Text style={{ marginHorizontal: 10, color: 'green', fontWeight: 'bold', fontSize: 13 }}>{totalTaxableValue}</Text>
                    </View>
                  </View>

                </View>
              );
            })
          ) : (
            <Text style={OrderHistoryStyles.skuText}>No Data Available</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};




export default OrderHistoryScreen;