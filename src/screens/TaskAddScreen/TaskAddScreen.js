import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native'
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
        if (!date) return;
    
        const formattedDate = date.toISOString().split("T")[0]; 
    
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        const raw = JSON.stringify({
            "followup_date": formattedDate
        });
    
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
    
        try {
            const response = await fetch("http://localhost:8091/GetFollowUpActivities", requestOptions);
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
                            <Text style={{ color: 'black' }}>Customer Name: </Text>
                            <Text style={{ color: 'green', fontSize: 12 }}>{item.customername}</Text>
                        </Text>

                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                            <Text style={{ color: 'black' }}>Outlet Name: </Text>
                            <Text style={{ color: 'green', fontSize: 12 }}>{item.hospitalname}</Text>
                        </Text>

                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                            <Text style={{ color: 'black' }}>Dept: </Text>
                            <Text style={{ color: 'green', fontSize: 12 }}>{item.user_type}</Text>
                        </Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                            <Text style={{ color: 'black' }}>Call Type: </Text>
                            <Text style={{ color: 'green', fontSize: 12 }}>{item.call_type}</Text>
                        </Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                            <Text style={{ color: 'black' }}>Joined Name: </Text>
                            <Text style={{ color: 'green', fontSize: 12 }}>{item.joined_name}</Text>
                        </Text>                        
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}> 
                            <Text style={{ color: 'black' }}>Remarks: </Text>
                            <Text style={{ color: 'green', fontSize: 12 }}>{item.remark}</Text>
                        </Text>                        
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                            <Text style={{ color: 'black' }}>Status: </Text>
                            <Text style={{ color: 'green', fontSize: 12 }}>{item.followup_status}</Text>
                        </Text>
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                            <Text style={{ color: 'black' }}>Priority: </Text>
                            <Text style={{ color: 'green', fontSize: 12 }}>{item.followup_priority}</Text>
                        </Text>

                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                            <Text style={{ color: 'black' }}>FollowUp Date: </Text>
                            <Text>{new Date(item.follow_up).toLocaleDateString('en-IN')}</Text>
                        </Text>
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