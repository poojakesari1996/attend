import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, FlatList, ToastAndroid } from 'react-native'
import { TaskAddStyle } from '../../styles/TaskAddStyle'
import { DatePicker } from '../../components';
import { SH, SF } from '../../utils';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme, lightTheme } from '../../utils';

const TaskAddScreen = () => {
    const isDarkMode = useSelector((state) => state.DarkReducer.isDarkMode);
    const currentColors = isDarkMode ? darkTheme : lightTheme;
    const Colors = isDarkMode ? darkTheme : lightTheme;
    const { t } = useTranslation();
    const TaskAddStyles = useMemo(() => TaskAddStyle(currentColors), [currentColors]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [followupDatewisedata, setFollowupDatewisedata] = useState([]);
    const [fromDate, setFromDate] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null); // ⬅️ add this to store selected date

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
            priority: priority
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
                        handleName={t("From Date")}
                        selectedDate={handleFromDateChange}
                        setDate={setFromDate}
                        style={TaskAddStyles.datePicker}
                    />
                </View>
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
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 3
                    }}>


                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                            <Text style={{ color: 'black' }}>Outlet name: </Text>
                            <Text style={{ color: 'green', fontSize: 12 }}>{item.hospitalname}</Text>
                        </Text>

                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                            <Text style={{ color: 'black' }}>Dept: </Text>
                            <Text style={{ color: 'green', fontSize: 12 }}>{item.user_type}</Text>
                        </Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                            <Text style={{ color: 'black' }}>Customer name: </Text>
                            <Text style={{ color: 'green', fontSize: 12 }}>{item.customername}</Text>
                        </Text>

                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                            <Text style={{ color: 'black' }}>Call type: </Text>
                            <Text style={{ color: 'green', fontSize: 12 }}>{item.call_type}</Text>
                        </Text>

                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                            <Text style={{ color: 'black' }}>Joint name: </Text>
                            <Text style={{ color: 'green', fontSize: 12 }}>{item.joined_name}</Text>
                        </Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                            <Text style={{ color: 'black' }}>Remarks: </Text>
                            <Text style={{ color: 'green', fontSize: 12 }}>{item.remark}</Text>
                        </Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                            <Text style={{ color: 'black' }}>FollowUp Date: </Text>
                            <Text>{new Date(item.follow_up).toLocaleDateString('en-IN')}</Text>
                        </Text>
                        {/* Status Row */}
                        {/* Status Row */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <Text style={{ fontSize: 13, fontWeight: 'bold', color: 'black', marginRight: 6 }}>
                                Status:
                            </Text>
                            <View
                                style={{
                                    flex: 1,
                                    borderWidth: Platform.OS === 'ios' ? 1 : 0,
                                    borderColor: '#ccc',
                                    borderRadius: 4,
                                    justifyContent: 'center',
                                    height: Platform.OS === 'ios' ? 36 : 'auto',
                                }}
                            >
                                <Picker
                                    selectedValue={item.followup_status}
                                    onValueChange={(value) => {
                                        const updated = [...followupDatewisedata];
                                        updated[index].followup_status = value;
                                        setFollowupDatewisedata(updated);

                                        updateTaskToServer(item.task_id, value, item.followup_priority);
                                    }}
                                    style={{
                                        height: Platform.OS === 'android' ? 36 : undefined,
                                        fontSize: 12,
                                        color: 'green',
                                    }}
                                    itemStyle={{ fontSize: 12 }}
                                >
                                    <Picker.Item label="Pending" value="Pending" />
                                    <Picker.Item label="Complete" value="Complete" />
                                    <Picker.Item label="Hold" value="Hold" />
                                    <Picker.Item label="Cancelled" value="Cancelled" />
                                </Picker>
                            </View>
                        </View>


                        {/* Priority Row */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                            <Text style={{ fontSize: 13, fontWeight: 'bold', color: 'black', marginRight: 6 }}>
                                Priority:
                            </Text>
                            <View
                                style={{
                                    flex: 1,
                                    borderWidth: Platform.OS === 'ios' ? 1 : 0,
                                    borderColor: '#ccc',
                                    borderRadius: 4,
                                    justifyContent: 'center',
                                    height: Platform.OS === 'ios' ? 36 : 'auto',
                                }}
                            >
                                <Picker
                                    selectedValue={item.followup_priority}
                                    onValueChange={(value) => {
                                        const updated = [...followupDatewisedata];
                                        updated[index].followup_priority = value;
                                        setFollowupDatewisedata(updated);

                                        updateTaskToServer(item.task_id, item.followup_status, value);
                                    }}
                                    style={{
                                        height: Platform.OS === 'android' ? 36 : undefined,
                                        fontSize: 12,
                                        color: 'green',
                                    }}
                                    itemStyle={{ fontSize: 12 }}
                                >
                                    <Picker.Item label="High" value="High" />
                                    <Picker.Item label="Medium" value="Medium" />
                                    <Picker.Item label="Low" value="Low" />
                                </Picker>
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