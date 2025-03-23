import React, { useEffect, useMemo, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { ApprovalStyle } from '../../styles';
import { useTranslation } from "react-i18next";
import CheckBox from '@react-native-community/checkbox';
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../../utils";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Spacing } from "../../components";

const ApprovalScreen = () => {
  const { t } = useTranslation();
  const isDarkMode = useSelector(state => state.DarkReducer.isDarkMode);
  const Colors = isDarkMode ? darkTheme : lightTheme;
  const ApprovalStyles = useMemo(() => ApprovalStyle(Colors), [Colors]);
  const [selectedTab, setSelectedTab] = useState("Pending");
  const [checkedStates, setCheckedStates] = useState([]);
  const [teamLeave, setTeamLeave] = useState([]);
  const [approvedLeaves, setApprovedLeaves] = useState([]); // Approved Leaves
  const [rejectedLeaves, setRejectedLeaves] = useState([]);

  // ✅ API Call to Fetch Leave List
  const LeaveList = useCallback(async () => {
    try {
      const user = await AsyncStorage.getItem("userInfor");
      const empid = JSON.parse(user);

      const response = await fetch("https://devcrm.romsons.com:8080/Leaveapproval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "empidd": empid[0].emp_id

        }),
      });

      const result = await response.json();
      console.log("Leave API Response:", result);

      if (!result.error) {
        setTeamLeave(result.data);
      }
    } catch (error) {
      console.error("Leave API Error:", error);
    }
  }, []);

  // ✅ Approve Selected Leaves
  const Leaveapproval = async () => {
    try {
      const user = await AsyncStorage.getItem("userInfor");
      const empid = JSON.parse(user);

      // ✅ Filter only selected leave IDs
      const selectedLeaveIds = teamLeave
        .filter((_, index) => checkedStates[index])
        .map(item => item.id);

      if (selectedLeaveIds.length === 0) {
        Alert.alert("Error", "Please select at least one leave to approve.");
        return;
      }

      const response = await fetch("https://devcrm.romsons.com:8080/Leaveidapproval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "empidd": empid[0].emp_id,
          "leaveIds": selectedLeaveIds,
        }),
      });

      const result = await response.json();
      console.log("Approval Response:", result);

      if (!result.error) {
        Alert.alert("Success", "Leave approved successfully!");
        LeaveList(); // ✅ Refresh Leave List
        setCheckedStates(new Array(teamLeave.length).fill(false));
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Leave Approval Error:", error);
      Alert.alert("Error", "Error approving leaves.");
    }
  };


  const Leaverejected = async () => {
    try {
      const user = await AsyncStorage.getItem("userInfor");
      const empid = JSON.parse(user);

      // ✅ Filter only selected leave IDs for rejection
      const selectedLeaveIds = teamLeave
        .filter((_, index) => checkedStates[index])
        .map(item => item.id);

      if (selectedLeaveIds.length === 0) {
        Alert.alert("Error", "Please select at least one leave to reject.");
        return;
      }

      const response = await fetch("https://devcrm.romsons.com:8080/LeaveidRejection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "empidd": empid[0].emp_id,
          "leaveIds": selectedLeaveIds,
        }),
      });

      const result = await response.json();
      console.log("Rejection Response:", result);

      if (!result.error) {
        Alert.alert("Success", "Leave rejected successfully!");
        LeaveList(); // ✅ Refresh Leave List
        setCheckedStates(new Array(teamLeave.length).fill(false)); // Reset checkboxes
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Leave Rejection Error:", error);
      Alert.alert("Error", "Error rejecting leaves.");
    }
  };


  const LeaveapprovalList = async () => {
    try {
      const user = await AsyncStorage.getItem("userInfor");
      const empid = JSON.parse(user);

      const response = await fetch("https://devcrm.romsons.com:8080/Leaveapprovallist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "empidd": empid[0].emp_id }),
      });

      const result = await response.json();
      if (!result.error) {
        setApprovedLeaves(result.data);
      }
    } catch (error) {
      console.error("Approved Leave API Error:", error);
    }
  };


  const Leaverejectedlist = async () => {
    const user = await AsyncStorage.getItem("userInfor");
    const empid = JSON.parse(user);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "empidd": empid[0].emp_id
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("https://devcrm.romsons.com:8080/Leaverejectedlist", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.error == false) {
          console.log('rejected', result.data);
          setRejectedLeaves(result.data)

        }
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    if (selectedTab === "Pending") {
      LeaveList();
    }
  }, [selectedTab]);

  useEffect(() => {
    if (selectedTab === "Accepted") {
      LeaveapprovalList(); // Fetch approved leaves when clicking Accepted Tab
    }
  }, [selectedTab]);

  useEffect(() => {
    if (selectedTab === "Rejected") {
      Leaverejectedlist();
    }
  }, [selectedTab]);

  // ✅ Handle Checkbox State
  const handleCheckBoxChange = (index) => {
    const updatedCheckedStates = [...checkedStates];
    updatedCheckedStates[index] = !updatedCheckedStates[index];
    setCheckedStates(updatedCheckedStates);
  };

  // ✅ Date Formatter
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).replace(/ /g, "-");
  };

  // ✅ Filter Leave List based on Selected Tab
  const filteredLeaveList = useMemo(() => {
    if (selectedTab === "Pending") return teamLeave;
    if (selectedTab === "Accepted") return approvedLeaves;
    if (selectedTab === "Rejected") return rejectedLeaves;
    return [];
  }, [selectedTab, teamLeave, approvedLeaves, rejectedLeaves]);

  // ✅ Render Each Leave Item
  const renderApprovalItem = ({ item, index }) => (
    <View style={ApprovalStyles.PaddingHorizontal}>
      <View style={ApprovalStyles.approvalCard}>
        <View style={ApprovalStyles.approvalHeader}>
          <Text style={ApprovalStyles.employeeId}>
            {item.emp_id} | {item.user_name}
          </Text>
          {selectedTab === "Pending" && (
            <View style={ApprovalStyles.cell}>
              <CheckBox
                value={checkedStates[index]}
                onValueChange={() => handleCheckBoxChange(index)}
              />
            </View>
          )}
        </View>

        <Spacing space={0} />
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <Text style={ApprovalStyles.moduleName}>{formatDate(item.start_date)}</Text>
          <Text style={ApprovalStyles.moduleName}>{formatDate(item.end_date)}</Text>
        </View>
        <Text style={ApprovalStyles.moduleName}>{item.leave_days} -- {item.leave_type} / Applied: {formatDate(item.enter_date)}</Text>
        
        <Text style={ApprovalStyles.moduleName}>{item.leave_reason} / Approved Date: {formatDate(item.approved_date)}</Text>
        {selectedTab === "Accepted" && (
          <View style={ApprovalStyles.approvedContainer}>
            <Text style={ApprovalStyles.approvedText}>Approved</Text>
          </View>
        )}

        {selectedTab === "Rejected" && (
          <View style={ApprovalStyles.rejectedContainer}>
            <Text style={ApprovalStyles.rejectedText}>Rejected</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={ApprovalStyles.container}>
      <View style={ApprovalStyles.PaddingHorizontal}>
        <Spacing space={20} />

        {/* ✅ Approve & Reject Buttons */}
        {selectedTab === "Pending" && checkedStates.some((checked) => checked) && (
          <View style={ApprovalStyles.buttonContainer}>
            <TouchableOpacity
              style={[ApprovalStyles.actionButton, ApprovalStyles.rejectButton]}
              onPress={Leaverejected}
            >
              <Text style={ApprovalStyles.buttonText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[ApprovalStyles.actionButton, ApprovalStyles.approveButton]}
              onPress={Leaveapproval}
            >
              <Text style={ApprovalStyles.buttonText}>Approve</Text>
            </TouchableOpacity>
          </View>
        )}

        <Spacing space={15} />

        {/* ✅ Tabs */}
        <View style={ApprovalStyles.tabContainer}>
          {["Pending", "Accepted", "Rejected"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                ApprovalStyles.tabButton,
                selectedTab === tab && ApprovalStyles.selectedTabButton,
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[
                ApprovalStyles.tabText,
                selectedTab === tab && ApprovalStyles.selectedTabText,
              ]}>
                {t(tab)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Spacing space={10} />

      {/* ✅ Display Only Pending Data */}
      <FlatList
        data={filteredLeaveList}
        renderItem={renderApprovalItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        style={ApprovalStyles.approvalsList}
      />
    </View>
  );
};

export default ApprovalScreen;
