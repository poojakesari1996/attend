import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, ActivityIndicator, Button } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AttendancePunchStyle } from '../../styles'; // Corrected import
import { useSelector } from 'react-redux';
import { Colors, darkTheme, lightTheme } from '../../utils'; // Adjust as necessary
import { Spacing, ConfirmationAlert } from '../../components';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { Platform, PermissionsAndroid } from 'react-native';
import { Divider } from 'react-native-elements';
const AttendancePunchInOut = () => {
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [showCheckInPopup, setShowCheckInPopup] = useState(false); // State for CheckIn popup visibility
    const [showCheckOutPopup, setShowCheckOutPopup] = useState(false); // State for CheckOut popup visibility
    // const [selectedOption, setSelectedOption] = useState(null); // State for selected option (Office or Field)
    const [remarks, setRemarks] = useState('');
    const [attendanceData, setAttendanceData] = useState(null);
    const [remarks1, setRemarks1] = useState(''); // State for remarks input
    let [address, setAddress] = React.useState(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    let [long, setLong] = useState(null);
    const [shiftTiming, setShiftTiming] = useState([]);
    const [currentTime, setCurrentTime] = useState(""); // State to store current time
    let [lat, setLat] = useState(null);
    const [punchinoutTime, setPunchinoutTime] = useState([]);
    const [checkInTime, setCheckInTime] = useState(null);
    const [checkOutTime, setCheckOutTime] = useState(null);
    const [totalHours,setTotalHours] = useState(null)
    const isDarkMode = useSelector(state => state.DarkReducer.isDarkMode);
    const currentColors = isDarkMode ? darkTheme : lightTheme;
    const AttendancePunchStyles = useMemo(() => AttendancePunchStyle(currentColors), [currentColors]);

    const navigation = useNavigation();
    const { t } = useTranslation();



    let [userdetail, setUserdetail] = React.useState([])
    ///
    const getdata = async () => {
        let user = await AsyncStorage.getItem('userInfor');

        userdetail = JSON.parse(user);
        setUserdetail(userdetail[0])
        console.log(userdetail.division);
    }

    // const attendance = async () => {
    //     try {
    //         const user = await AsyncStorage.getItem('userInfor');
    //         const empid = JSON.parse(user);
    //         const requestOptions = {
    //             method: "GET",
    //             redirect: "follow",
    //         };

    //         const response = await fetch(`https://devcrm.romsons.com:8080/attendance_summary?emp_id=${empid[0].emp_id}`, requestOptions);
    //         const result = await response.json(); // Parse response as JSON

    //         if (result.error === false) {
    //             console.log("Logged in User Data: ", result.data);
    //             setAttendanceData(result.data); // Update state with fetched data
    //         } else {
    //             console.error("Error from server: ", result.message || "Unknown error");
    //         }
    //     } catch (error) {
    //         console.error("Fetch Error: ", error);
    //     }
    // };





    const alertdata = {
        'checkinSuccess': t("Punch_In_Successfull"),
        // 'invalid': t("Enter Valid Emp ID & Password")
    };

    const handleAlertOk = () => {
        setAlertVisible(false); // Hide the alert

    };







    const openPunchInModal = () => {
        setModalVisible(true);
    };

    // Handle the "OK" button click in the modal
    const handleModalOk = async () => {
        setModalVisible(false);
        await handleSave(); // Call punch-in API
    };

    const handleSave = async () => {
        if (!currentLatitude || !currentLongitude || currentLatitude === '...' || currentLongitude === '...') {
            alert("Fetching location, please wait...");
            return;
        }
    
        if (!address || address.trim() === "") {
            alert("Fetching address, please wait...");
            return;
        }
    
        let user = await AsyncStorage.getItem("userInfor");
        let empid = JSON.parse(user);
    
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        const raw = JSON.stringify({
            empid: empid[0].emp_id,
            in_lat: currentLatitude,
            in_lng: currentLongitude,
            enterBy: empid[0].emp_id,
            emp_in_address: address,  // Ensure address is fetched
            app_version: ""
        });
    
        console.log(raw, "Request Payload");
    
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
    
        fetch("https://devcrm.romsons.com:8080/attendance_punch_in", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log(result, "API Response");
    
                if (result.success === false) {
                    alert("Successfully punched in");
                    PunchInOuttime();
                } else if (result.msg === true) {
                    alert("Attendance already exists for today.");
                } else {
                    alert("Something went wrong, please try again.");
                }
            })
            .catch((error) => {
                console.error("Error during Punch-In:", error);
                alert("Failed to punch in, please check your network connection.");
            });
    };
    




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

    const [loading, setLoading] = useState(false);
    

    const getAddress = async (lat, long) => {
        setLoading(true); // Start loading

        try {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyC4cMHPr8PdH18gyzIJ6YMlTJSHEDGwvNM`;
            const response = await fetch(url);
            const data = await response.json();

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

    useEffect(() => {
        PunchInOuttime(); // Call the API when the component mounts
    }, []);

    const PunchInOuttime = async () => {
        const user = await AsyncStorage.getItem('userInfor');
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

        fetch("https://devcrm.romsons.com:8080/punchInOutTime", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.error == false) {
                    console.log('timeeee', result.data);
                    setPunchinoutTime(result.data)
                    if (result.data.length > 0) {
                        setCheckInTime(result.data[0].punch_in); 
                        setCheckOutTime(result.data[0].punch_out);  
                        setTotalHours(result.data[0].total_hours); // Assuming total_hours is returned from API



                    }
                }
            })
            .catch((error) => console.error(error));
    }




    const handleOut = async () => {
        if (!currentLatitude || !currentLongitude || currentLatitude === '...' || currentLongitude === '...') {
            alert("Fetching location, please wait...");
            return;
        }
    
        if (!address || address.trim() === "") {
            alert("Fetching address, please wait...");
            return;
        }
    
        let user = await AsyncStorage.getItem('userInfor');
        let empid = JSON.parse(user);
    
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        const raw = JSON.stringify({
            "out_lat": currentLatitude,
            "out_long": currentLongitude,
            "add_res": address,  // Ensure address is available
            "empid": empid[0].emp_id
        });
    
        console.log(raw, "Punch-Out Request Payload");
    
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
    
        fetch("https://devcrm.romsons.com:8080/attendance_punchout", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log(result, "API Response");
    
                if (result.error) {
                    alert(result.message);
                } else if (result.success) {
                    alert(result.message);
                    PunchInOuttime();
                } else {
                    alert("Something went wrong, please try again.");
                }
            })
            .catch((error) => {
                console.error("Error during Punch-Out:", error);
                alert("An error occurred, please try again.");
            });
    };
    









    const shiftDetails = async () => {
        const requestOptions = {
            method: "POST",
            redirect: "follow"
        };

        fetch("https://devcrm.romsons.com:8080/shiftDetails", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.error == false) {
                    console.log('timingggg', result.data);
                    setShiftTiming(result.data[0])

                }
            })
            .catch((error) => console.error(error));
    }

    useEffect(() => {
        shiftDetails();
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setCurrentTime(formattedTime);
        }, 100);

        return () => clearInterval(timer);
    }, []);

    // const handleOut = async () => {
    //     // Check if remarks are empty
    //     if (remarks1 == '') {
    //         alert('Please enter remarks');
    //         return;
    //     }

    //     // Get the current time in the user's local time zone
    //     const currentTime = new Date();
    //     const currentHour = currentTime.getHours();  // Get the current hour (24-hour format)

    //     // Validate if the current time is after 9 PM (21:00)
    //     if (currentHour >= 21) {
    //         alert('Punch-out is not allowed after 9 PM');
    //         setShowCheckOutPopup(false);
    //         setRemarks1('');


    //         return;
    //     }

    //     // Proceed with the punch-out if validation passes
    //     let user = await AsyncStorage.getItem('userInfor');
    //     let empid = JSON.parse(user);

    //     const myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");

    //     const raw = JSON.stringify({
    //         "out_lat": currentLatitude,
    //         "out_long": currentLongitude,
    //         "out_remark": remarks1,
    //         "add_res": address,
    //         "empid": empid[0].emp_id
    //     });

    //     const requestOptions = {
    //         method: "POST",
    //         headers: myHeaders,
    //         body: raw,
    //         redirect: "follow"
    //     };

    //     fetch("https://devcrm.romsons.com:8080/attendance_punchout", requestOptions)
    //         .then((response) => response.json())
    //         .then((result) => {
    //             console.log(result, "test");
    //             if (result.success === false) {
    //                 alert(result.data);  // Show the error message returned from the backend
    //                 setShowCheckOutPopup(false);
    //                 setRemarks1('');
    //             } else {
    //                 alert('Successfully punched out');
    //                 setShowCheckOutPopup(false);
    //                 setRemarks1('');
    //             }
    //         })
    //         .catch((error) => console.error(error));
    // };


    // const handleOptionSelect = (option) => {
    //     setSelectedOption(option);
    //     if (option === 'field') {
    //         setRemarks(''); // Clear remarks if 'field' is selected
    //     }
    // };



    const buttons = [
        {
            id: 1,
            label: t("CheckIn"),
            onPress: openPunchInModal,
            buttonStyle: AttendancePunchStyles.checkInButton,
            time: punchinoutTime.length > 0 ? punchinoutTime[0]?.punch_in : null, // In Time
        },
        {
            id: 2,
            label: t("CheckOut"),
            // date: checkOutDate,
            // time: punch_out_time,
            onPress: handleOut,
            buttonStyle: AttendancePunchStyles.checkOutButton,
            time: punchinoutTime.length > 0 ? punchinoutTime[0]?.punch_out : null, // Out Time
        }
    ];

    const ButtonComponent = ({ item }) => (
        <View style={AttendancePunchStyles.checkInOutContainer}>
            <TouchableOpacity
                style={[AttendancePunchStyles.checkButton, item.buttonStyle]}
                onPress={item.onPress}>
                <Text style={AttendancePunchStyles.checkButtonText}>{item.label}</Text>
            </TouchableOpacity>
            {item.date && <Text style={AttendancePunchStyles.dateText}>{item.date}</Text>}
            <Text style={AttendancePunchStyles.timeText}>{item.time}</Text>
            {item.id === 2 && totalHours && (
                    <View>
                        <Text>Total Hours: <Text style={{ color: 'black', fontWeight: 'bold' }}>{totalHours}</Text> hrs</Text>
                    </View>
                )}
        </View>
    );

    const ListHeaderComponent = () => (
        <View>
            <Spacing space={20} />
            <Spacing space={20} />
        </View>
    );

    return (


        <View style={AttendancePunchStyles.container}>
            <View>
                <Text style={{ color: "black", fontWeight: "bold" }}>Location: </Text>
                {loading ?
                    <ActivityIndicator size="large" color="brown" />
                    :
                    <Text style={{ color: "brown", fontWeight: "bold", fontSize: 13 }}>{address}</Text>
                }
            </View>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={AttendancePunchStyles.modalContainer}>
                    <View style={AttendancePunchStyles.modalContent}>
                        <Text style={AttendancePunchStyles.modalHeader1}>{currentTime}</Text>
                        {/* Display the current time (if needed) */}
                        <Text style={AttendancePunchStyles.modalHeader}>Office Timing</Text>
                        <Divider style={AttendancePunchStyles.divider1} />

                        {/* Display shift times */}
                        <Text style={AttendancePunchStyles.modalText}>
                            <Text style={{ color: 'gray' }}>Office Timing:</Text>
                            <Text style={{ color: 'black', fontSize: 13 }}> {shiftTiming.start_time} to {shiftTiming.end_time}</Text>
                        </Text>

                        {/* <Text style={AttendancePunchStyles.modalText}>
                Grace Time: {shiftTiming.grace_start_time} to {shiftTiming.grace_end_time}
            </Text> */}

                        <Text style={AttendancePunchStyles.modalText}>
                            <Text style={{ color: 'gray' }}>Grace Time:</Text>
                            <Text style={{ color: 'black', fontSize: 13 }}> {shiftTiming.grace_start_time} to {shiftTiming.grace_end_time}</Text>
                        </Text>

                        {/* <Text style={AttendancePunchStyles.modalText}>
                Late Time: {shiftTiming.late_start_coming} to {shiftTiming.late_end_coming}
            </Text> */}
                        <Text style={AttendancePunchStyles.modalText}>
                            <Text style={{ color: 'gray' }}>Late Time: </Text>
                            <Text style={{ color: 'black', fontSize: 13 }}> {shiftTiming.late_start_coming} to {shiftTiming.late_end_coming}</Text>
                        </Text>

                        <Text style={AttendancePunchStyles.modalText}>
                            <Text style={{ color: 'gray' }}>Half Day: </Text>
                            <Text style={{ color: 'black', fontSize: 13 }}>After 10 AM </Text>
                        </Text>

                        {/* Button to confirm and punch-in */}
                        <TouchableOpacity onPress={handleModalOk} style={AttendancePunchStyles.modalButton}>
                            <Text style={AttendancePunchStyles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


            <FlatList
                data={buttons}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item, index }) => (
                    <View>
                        <ButtonComponent item={item} />
                        {index === 0 && (
                            <View style={AttendancePunchStyles.divider} />
                        )}
                    </View>
                )}
                ListHeaderComponent={ListHeaderComponent}
                contentContainerStyle={{ flexGrow: 1 }}
                ListFooterComponent={
                    <View style={AttendancePunchStyles.totalHoursContainer}>


                    </View>
                }
            />

            <ConfirmationAlert
                visible={alertVisible}
                message={alertMessage}
                onConfirm={handleAlertOk}
            />

{/* <View style={{ marginBottom: 30 }}>
            
            {punchinoutTime.length > 0 && punchinoutTime[0]?.punch_in && (
                <Text style={AttendancePunchStyles.timeText}>In Time: {punchinoutTime[0].punch_in}</Text>
            )}

            
            
            {punchinoutTime.length > 0 && punchinoutTime[0]?.punch_out && (
                <Text style={AttendancePunchStyles.timeText}>Out Time: {punchinoutTime[0].punch_out}</Text>
            )}
        </View> */}
        </View>


    );

};

export default AttendancePunchInOut;
