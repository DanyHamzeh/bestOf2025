import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Text, Alert, KeyboardAvoidingView, ScrollView, Platform, RefreshControl } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { CountryPicker } from "react-native-country-codes-picker";  // Using this library
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '../components/CustomButton';
import Loader from '../components/Loader';
import * as Device from "expo-device";
import * as Application from "expo-application";
import { scaleHeight, scaleWidth } from "../utils/sizeUtils";
import AsyncStorage from '@react-native-async-storage/async-storage';

function EnglishScreen({ navigation }) {
    const [show, setShow] = useState(false);
    const [countryCode, setCountryCode] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(null); // To store the selected country
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [installedTime, setInstalledTime] = useState(null);
    const [showCont, setShowCont] = useState(true); // To hide the vote buttons
    const widthBar = scaleWidth(1000);
    const heightBar = scaleHeight(800);
    const EnglishApi = "EN";

    useEffect(() => {
        const checkIfVoted = async () => {
            try {
                const voted = await AsyncStorage.getItem('hasVoted');
                if (voted === 'true') {
                    setShowCont(false); // Hide the buttons if user has voted
                }
            } catch (error) {
                console.error("Error checking vote status:", error);
            }
        };

        checkIfVoted();

        const getInstallationTime = async () => {
            try {
                const installationTime = await Application.getInstallationTimeAsync();
                setInstalledTime(installationTime);
            } catch (error) {
                console.error("Error getting installation time:", error);
            }
        };

        getInstallationTime();
    }, []);

    const navigateResult = () => {
        navigation.navigate("resultScreen", {
            EnglishApi: EnglishApi
        });
    };

    function checkInput() {
        if (selectedCountry === "" || selectedCountry === null) {
            alert("Select a country please.");
        } else {
            Alert.alert("", "Are you sure you want to vote for " + selectedCountry.name.en, [
                {
                    text: "Yes",
                    style: "cancel",
                    onPress: voteApiHandler,
                },
                { text: "No", style: "cancel" },
            ]);
        }
    }

    const votesNewInfo = () => {
        setLoading(true);
        const apiUrl = `https://www.thinksmart.live/Country%20Voting/php/getVotes.php?language=${EnglishApi}&isTopThree=Y`;
        fetch(apiUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data?.data?.dataArr) {
                    const formattedData = data.data.dataArr.map((item) => ({
                        country: item.country,
                        votingNumber: parseInt(item.votes),
                    }));
                    setData(formattedData);
                } else {
                    alert("Unexpected data format received from the API.");
                }
                setLoading(false);
            })
            .catch(() => {
                alert("Connection error. Please try again later.");
                setLoading(false);
            });
    }

    const voteApiHandler = () => {
        setLoading(true);

        const apiUrl = `https://www.thinksmart.live/Country%20Voting/php/vote.php?language=${EnglishApi}&countryCode=${selectedCountry.code}&key=${installedTime + Device.osBuildId}&dateInstalled=${installedTime}`;

        fetch(apiUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then(async (data) => {
                console.log("API Response Data:", data);

                if (data.statusCode == "0") {
                    await AsyncStorage.setItem('hasVoted', 'true');
                    Alert.alert("Vote Successfully", "You voted for " + selectedCountry.name.en, [
                        {
                            text: "ok",
                            style: "cancel",
                            onPress: votesNewInfo,
                        },
                    ]);
                    setShowCont(false); 
                } else {
                    setLoading(false);
                    if (data.statusCode == "-4") {
                        Alert.alert("Unable To Vote!!", "Estimated remaining time to vote: " + data.remainingTime, [
                            { text: "Ok", style: "cancel" },
                        ]);
                    } else if (data.statusCode == "-5") {
                        Alert.alert("Unable To Vote!!", "You already voted", [
                            { text: "Ok", style: "cancel" },
                        ]);
                    } else {
                        Alert.alert("", "Something went wrong. Please try again later.", [
                            { text: "Try Again", style: "cancel" },
                        ]);
                    }
                }
            })
            .catch((error) => {
                setLoading(false);
                console.error("Fetch Error:", error);
                alert("Connection error. Please try again later.");
            });
    };

    useEffect(() => {
        setLoading(true);
        const apiUrl = `https://www.thinksmart.live/Country%20Voting/php/getVotes.php?language=${EnglishApi}&isTopThree=Y`;
        fetch(apiUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data?.data?.dataArr) {
                    const formattedData = data.data.dataArr.map((item) => ({
                        country: item.country,
                        votingNumber: parseInt(item.votes),
                    }));
                    setData(formattedData);
                } else {
                    alert("Unexpected data format received from the API.");
                }
                setLoading(false);
            })
            .catch(() => {
                alert("Connection error. Please try again later.");
                setLoading(false);
            });
    }, []);

    const chartData = {
        labels: data.map((item) => item.country),
        datasets: [
            {
                data: data.map((item) => item.votingNumber),
            },
        ],
    };

    return (
        <ImageBackground
            source={require("../assets/testtt.jpg")}
            style={styles.container}
        >
            {loading ? (
                <View style={styles.loader}>
                    <Loader />
                </View>
            ) : (
                <ScrollView
                    style={styles.containerFirst}
                    contentContainerStyle={{
                        justifyContent: "flex-start",
                        alignItems: 'center',
                    }}
                    refreshControl={
                        <RefreshControl refreshing={false} onRefresh={votesNewInfo} />
                    }
                >
                    <Text style={styles.titleStyle}>
                        Top Three Countries
                    </Text>
                    <View style={styles.underLineStyle} />
                    <BarChart
                        data={chartData}
                        width={widthBar}
                        height={heightBar}
                        yAxisLabel=""
                        yAxisSuffix=""
                        yAxisInterval={1}
                        fromZero={true}
                        showBarTops={true}
                        chartConfig={{
                            backgroundColor: "transparent",
                            backgroundGradientFrom: "#80B3B7",
                            backgroundGradientTo: "#316362",
                            decimalPlaces: "",
                            color: (opacity = 4) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: () => `white`,
                            propsForLabels: {
                                fontFamily: 'Tajawal', 
                                fontSize: scaleWidth(30),
                                fontWeight: 'normal',                            
                            },
                        }}
                        style={{
                            marginVertical: 8,
                            borderRadius: 30,
                            borderColor: '#C2E0D4',
                            borderWidth: 2,
                        }}
                    />
                    <View style={styles.firstBtn}>
                        <LinearGradient
                            colors={['#80B3B7', '#316362']}
                            style={[styles.innerCircle, styles.gradientButton]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <CustomButton onPress={navigateResult} width={scaleWidth(1000)}>
                                Show Result
                            </CustomButton>
                        </LinearGradient>
                    </View>
                    <View style={styles.countDownSentence}>
                        <Text style={styles.textSentence}>
                            To provide you with the most accurate and up-to-date
                            information, we need 48 hours to process and verify all
                            details. This ensures that your vote is based on the latest,
                            most reliable data and helps maintain the integrity of the
                            voting process. Thank you for your understanding and
                            patience!
                        </Text>
                    </View>
                    {showCont && (
                        <View style={styles.allBtns}>
                            <LinearGradient
                                colors={['#80B3B7', '#316362']}
                                style={[styles.innerCircle, styles.gradientButton]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <CustomButton onPress={() => setShow(true)} width={scaleWidth(500)}>
                                    {selectedCountry ? (
                                        <>
                                            {selectedCountry.flag} {selectedCountry.name.en}
                                        </>
                                    ) : (
                                        'Select Country'
                                    )}
                                </CustomButton>
                            </LinearGradient>

                            {show && (
                                <KeyboardAvoidingView
                                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                                >
                                    <ScrollView
                                        contentContainerStyle={{ flexGrow: 1 }}
                                        keyboardShouldPersistTaps="handled"
                                    >
                                        <CountryPicker
                                            show={show}
                                            pickerButtonOnPress={(item) => {
                                                setSelectedCountry(item);
                                                setCountryCode(item.dial_code);
                                                setShow(false);
                                            }}
                                            style={{
                                                modal: {
                                                    height: scaleHeight(1400), 
                                                },
                                                line: {
                                                    backgroundColor: "black",
                                                },
                                                dialCode: {
                                                    display: "none",
                                                },
                                                searchBar: {
                                                    marginBottom: 10, 
                                                }
                                            }}
                                        />
                                    </ScrollView>
                                </KeyboardAvoidingView>
                            )}

                            <LinearGradient
                                colors={['#80B3B7', '#316362']}
                                style={[styles.innerCircle, styles.gradientButton]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <CustomButton onPress={checkInput} width={scaleWidth(500)}>
                                    Country Voting
                                </CustomButton>
                            </LinearGradient>
                        </View>
                    )}
                </ScrollView>
            )}
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: 'center',
    },
    titleStyle: {
        color: "white",
        textAlign: "center",
        fontSize: scaleWidth(50),
        marginTop: scaleHeight(200),
        fontFamily: 'Tajawal',

    },
    underLineStyle: {
        width: scaleWidth(500),
        borderWidth: 1,
        borderColor: "white",
        margin: "auto"
    },
    allBtns: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: scaleWidth(20),
        marginTop: scaleHeight(-110),
    },
    innerCircle: {
        marginTop: scaleHeight(150),
        borderRadius: 30
    },
    countDownSentence: {
        width: "80%",
        margin: "auto"
    },
    textSentence: {
        fontSize: scaleWidth(24),
        textAlign: 'center',
        fontFamily: 'Tajawal',
        color: 'white'
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradientButton: {
        marginVertical: scaleHeight(10),
    },
    firstBtn: {
        marginTop: scaleHeight(-150),
        marginBottom: scaleHeight(280)
    }
});

export default EnglishScreen;
