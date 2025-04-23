import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ToastAndroid, Button, TouchableOpacity, TextInput } from 'react-native'
import { TaskAddStyle } from '../../styles/TaskAddStyle'
import { DatePicker } from '../../components';
import { RouteName } from '../../routes';
import { useTranslation } from 'react-i18next';
import { HomeDropDown } from '../../components';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme, lightTheme } from '../../utils';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const TaskAddScreen = () => {
    const isDarkMode = useSelector((state) => state.DarkReducer.isDarkMode);
    const currentColors = isDarkMode ? darkTheme : lightTheme;
    const Colors = isDarkMode ? darkTheme : lightTheme;
    const { t } = useTranslation();
    const navigation = useNavigation();
    const TaskAddStyles = useMemo(() => TaskAddStyle(currentColors), [currentColors]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [followupDatewisedata, setFollowupDatewisedata] = useState([]);
    const [fromDate, setFromDate] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null); // ⬅️ add this to store selected date

    const [updatedRemarks, setUpdatedRemarks] = useState({});


    const handleRemarkChange = (taskId, newRemark) => {
        setUpdatedRemarks((prev) => ({
            ...prev,
            [taskId]: newRemark
        }));

    };

    useFocusEffect(
        useCallback(() => {
            if (selectedDate) {
                followUpDatewiseData(selectedDate);
            }
        }, [selectedDate])
    );


    const showToast = (message) => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
            Alert.alert('', message);
        }
    };
    const handleFromDateChange = (event, selectedDate) => {
        const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const currentDate = selectedDate || date;

        if (currentDate < currentMonthStart) {
            Alert.alert("Invalid Date", "You can't select a date from the previous month.");
            setShowDatePicker(false);
            return;
        }

        setShowDatePicker(false);
        setFromDate(currentDate);
        setSelectedDate(currentDate); // save selected date

        followUpDatewiseData(currentDate); // ✅ call with selected date
    };

    const followUpDatewiseData = async (date) => {
        const user = await AsyncStorage.getItem("userInfor");
        const empid = JSON.parse(user);
        if (!date) return;

        const formattedDate = date.toISOString().split("T")[0];

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "followup_date": formattedDate,
            "enter_by": empid[0]?.emp_id
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch("https://devcrm.romsons.com:8080/GetFollowUpActivities", requestOptions);
            const result = await response.json();
            console.log('nhjughhh', result);

            if (result.error === false) {
                setFollowupDatewisedata(result.data);
            } else {
                Alert.alert("No Data", "No follow-up found for selected date.");

            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const updateTaskToServer = async (taskId, status, priority) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            taskIds: [taskId],
            status: status,
            priority: priority,
            remarks: updatedRemarks[taskId] || ''
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch("https://devcrm.romsons.com:8080/UpdateMultipleFollowUpTasks", requestOptions);
            const result = await response.json();
            console.log("Updated:", result);
            if (result.error === false) {
                showToast("Task updated successfully!");
            } else {
                showToast(result.message || "Failed to update task.");
            }
        } catch (error) {
            console.error("Error updating task:", error);
            showToast("Something went wrong!");
        }
    };


    useEffect(() => {
        const today = new Date();
        setFromDate(today);
        setSelectedDate(today);
        followUpDatewiseData(today);
    }, []);


    return (
        <View style={{ flex: 1, backgroundColor: '#f9f9f9' }}>

            <View style={TaskAddStyles.dateRow}>
                <View style={TaskAddStyles.datePickerWrapper}>
                    <DatePicker
                        handleName={<Text style={TaskAddStyles.dateLabel}>{t("Choose Date")}</Text>}
                        selectedDate={handleFromDateChange}
                        setDate={setFromDate}
                        style={TaskAddStyles.datePicker}
                    />
                </View>

                <TouchableOpacity
                    style={TaskAddStyles.addTaskButton}
                    onPress={() => navigation.navigate(RouteName.CREATETASK, {
                        followupDate: selectedDate?.toISOString()
                    })}

                    activeOpacity={0.8}
                >
                    <Icon name="add" size={24} color={Colors.theme_background} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={followupDatewisedata}
                renderItem={({ item, index }) => (
                    <View key={index} style={{
                        marginBottom: 16,
                        padding: 20,
                        marginHorizontal: 20,
                        backgroundColor: '#ffffff',
                        borderRadius: 8,
                        borderLeftWidth: 5,
                        borderLeftColor: item.source === 'manual' ? '#f39c12' : '#2ecc71',
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 3
                    }}>

                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                            <Text style={{ color: 'black' }}>Task name: </Text>
                            <Text style={{ color: 'green', fontSize: 12 }}>{item.task_name}</Text>
                        </Text>

                        {item.source !== 'manual' && (
                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                                <Text style={{ color: 'black' }}>Outlet Category Name: </Text>
                                <Text style={{ color: 'green', fontSize: 12 }}>{item.outlet_category_name}</Text>
                            </Text>
                        )}

                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                            <Text style={{ color: 'black' }}>Call Type: </Text>
                            <Text style={{ color: 'green', fontSize: 12 }}>{item.call_type}</Text>
                        </Text>

                        {item.source === 'manual' && (
                            <View style={{ marginVertical: 5 }}>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black' }}>Remarks:</Text>
                                <TextInput
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#000000',
                                        padding: 5,
                                        borderRadius: 5,
                                        fontSize: 12,
                                        color: 'green',
                                        fontWeight: 'bold',
                                        marginTop: 5,
                                    }}
                                    value={
                                        updatedRemarks[item.task_id] !== undefined
                                            ? updatedRemarks[item.task_id]
                                            : item.remarks || ''
                                    } // fallback to item.remarks
                                    placeholder="Enter remarks"
                                    onChangeText={(text) => handleRemarkChange(item.task_id, text)}
                                />
                            </View>
                        )}

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginVertical: 8,
                            }}
                        >
                            {/* Status Dropdown */}
                            <View style={{ flex: 1, marginRight: 6 }}>
                                <Text style={{ fontSize: 13, fontWeight: 'bold', color: 'black', marginBottom: 4 }}>
                                    Status
                                </Text>
                                <HomeDropDown
                                    value={item.followup_status}
                                    setValue={(value) => {
                                        const updated = [...followupDatewisedata];
                                        updated[index].followup_status = value;
                                        setFollowupDatewisedata(updated);
                                        updateTaskToServer(item.task_id, value, item.followup_priority);
                                    }}
                                    data={[
                                        { label: 'Pending', value: 'Pending' },
                                        { label: 'Complete', value: 'Complete' },
                                        { label: 'Hold', value: 'Hold' },
                                        { label: 'Cancelled', value: 'Cancelled' },
                                    ]}
                                    placeholder="Select Status"
                                    style={{ width: '100%' }}
                                />
                            </View>

                            {/* Priority Dropdown */}
                            <View style={{ flex: 1, marginLeft: 6 }}>
                                <Text style={{ fontSize: 13, fontWeight: 'bold', color: 'black', marginBottom: 4 }}>
                                    Priority
                                </Text>
                                <HomeDropDown
                                    value={item.followup_priority}
                                    setValue={(value) => {
                                        const updated = [...followupDatewisedata];
                                        updated[index].followup_priority = value;
                                        setFollowupDatewisedata(updated);
                                        updateTaskToServer(item.task_id, item.followup_status, value);
                                    }}
                                    data={[
                                        { label: 'High', value: 'High' },
                                        { label: 'Medium', value: 'Medium' },
                                        { label: 'Low', value: 'Low' },
                                    ]}
                                    placeholder="Select Priority"
                                    style={{ width: '100%' }}
                                />
                            </View>
                        </View>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={true}
            />

        </View>
    );

}

export default TaskAddScreen