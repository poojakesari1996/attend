import React, { useMemo, useState } from 'react';
import { View, TouchableOpacity, ScrollView, Text, Modal, ActivityIndicator, loading } from "react-native";
import { CreateTaskStyle } from '../../styles';
import { darkTheme, lightTheme } from '../../utils';
import { Button, ConfirmationAlert, Input, Spacing } from "../../components";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { DatePicker } from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateTaskScreen = () => {
    const isDarkMode = useSelector((state) => state.DarkReducer.isDarkMode);
    const currentColors = isDarkMode ? darkTheme : lightTheme;
    const Colors = isDarkMode ? darkTheme : lightTheme;
    const { t } = useTranslation();
    const CreateTaskStyles = useMemo(() => CreateTaskStyle(currentColors), [currentColors]);
    const [modalVisible, setModalVisible] = useState(false);
    const [callType, setCallType] = useState("Call With");
    const [callerName, setCallerName] = useState("");
    const [reportingModalVisible, setReportingModalVisible] = useState(false);
    const [reportingPersons, setReportingPersons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fromDate, setFromDate] = useState(null);
    const [formData, setFormData] = useState({
        taskName: '',
        status: '',
        remarks: '',
        priority: ''
    });

    const handleFromDateChange = (event, selectedDate) => {
        // const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        // const currentDate = selectedDate || date;

        if (currentDate < currentMonthStart) {
            Alert.alert("Invalid Date", "You can't select a date from the previous month.");
            setShowDatePicker(false);
            return;
        }

        // setShowDatePicker(false);
        setFromDate(currentDate);
        // setSelectedDate(currentDate); // save selected date

        followUpDatewiseData(currentDate); // ✅ call with selected date
    };

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSelectReportingPerson = (person) => {
        setCallerName(person);
        setReportingModalVisible(false);
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
                // console.log("Dataa:", result.data);
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
    return (
        <View style={CreateTaskStyles.container1}>
            <ScrollView style={CreateTaskStyles.PaddingHorizontal}>
                <Spacing space={10} />
                <View style={CreateTaskStyles.SetPaddingd}>
                    <Input
                        title={t("Task Name")}
                        value={formData.taskName}
                        onChangeText={(text) => handleChange('taskName', text)}
                        placeholder={t("Enter Here...")}
                        placeholderTextColor={Colors.gray_text_color}
                        titleStyle={CreateTaskStyles.titleStyle}
                        inputStyle={CreateTaskStyles.input_style}
                    />
                    <Spacing space={10} />
                    <Input
                        title={t("Status")}
                        value={formData.status}
                        onChangeText={(text) => handleChange('status', text)}
                        placeholder={t("Enter Here...")}
                        placeholderTextColor={Colors.gray_text_color}
                        titleStyle={CreateTaskStyles.titleStyle}
                        inputStyle={CreateTaskStyles.input_style}
                    />
                    <Spacing space={10} />
                    <Input
                        title={t("Remarks")}
                        value={formData.remarks}
                        onChangeText={(text) => handleChange('remarks', text)}
                        placeholder={t("Enter Here...")}
                        placeholderTextColor={Colors.gray_text_color}
                        titleStyle={CreateTaskStyles.titleStyle}
                        inputStyle={CreateTaskStyles.input_style}
                    />
                    <Spacing space={10} />

                    <Text style={CreateTaskStyles.callLabel}>{t("Select Call Type")}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={CreateTaskStyles.callButton} onPress={() => setModalVisible(true)}>
                            <Text style={CreateTaskStyles.callButtonText}>
                                {callType || t("Call")}
                            </Text>

                        </TouchableOpacity>
                        <Text style={{ color: 'brown', fontSize: 12 }}> {callerName}</Text>
                    </View>
                    <Spacing space={10} />
                    <Input
                        title={t("Priority")}
                        value={formData.priority}
                        onChangeText={(text) => handleChange('priority', text)}
                        placeholder={t("Enter Here...")}
                        placeholderTextColor={Colors.gray_text_color}
                        titleStyle={CreateTaskStyles.titleStyle}
                        inputStyle={CreateTaskStyles.input_style}
                    />
                    <Spacing space={10} />
                    <View style={{ width: '50%' }}>
                        <DatePicker
                            handleName={<Text style={{ fontSize: 16 }}>{t("FollowUp Date")}</Text>}
                            selectedDate={handleFromDateChange}
                            setDate={setFromDate}
                            style={CreateTaskStyles.datePicker}
                        />
                    </View>

                </View>
                <Modal
                    transparent={true}
                    visible={modalVisible}
                    animationType="fade"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={CreateTaskStyles.modalOverlay}>
                        <View style={CreateTaskStyles.dropdownContainer}>

                            {/* Close Button */}
                            <TouchableOpacity
                                style={CreateTaskStyles.closeIcon}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#999' }}>✕</Text>
                            </TouchableOpacity>


                            {/* Options */}
                            <TouchableOpacity
                                style={CreateTaskStyles.option}
                                onPress={() => {
                                    setCallType("Self");
                                    setCallerName("Self");
                                    setModalVisible(false);
                                }}
                            >
                                <Text style={CreateTaskStyles.optionText}>Self</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={CreateTaskStyles.option}
                                onPress={() => {
                                    setCallType("Joined");
                                    setModalVisible(false);
                                    reportingPerson();
                                }}
                            >
                                <Text style={CreateTaskStyles.optionText}>Joint Call</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal
                    transparent={true}
                    visible={reportingModalVisible}
                    animationType="fade"
                    onRequestClose={() => setReportingModalVisible(false)}
                >
                    <View style={CreateTaskStyles.modalOverlay4}>
                        <View style={CreateTaskStyles.dropdownContainer4}>
                            {loading ? (
                                <ActivityIndicator size="medium" color="#0000ff" />
                            ) : (
                                <ScrollView>
                                    {reportingPersons.map((person, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={CreateTaskStyles.option4}
                                            onPress={() => handleSelectReportingPerson(person.reporting_to_name)}
                                        >
                                            <Text style={CreateTaskStyles.optionText4}>{person.reporting_to_name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}
                        </View>
                    </View>
                </Modal>
                <Spacing space={70} />
            </ScrollView>
            <View style={CreateTaskStyles.BotttomAbs}>
                    <Button
                      title={t("Update")}
                    />
                  </View>
        </View>
    );
}

export default CreateTaskScreen