import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Text, Alert, KeyboardAvoidingView, RefreshControl, ScrollView,Platform } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { CountryPicker } from "react-native-country-codes-picker";
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '../components/CustomButton';
import Loader from '../components/Loader';
import * as Device from "expo-device";
import * as Application from "expo-application";
import { scaleHeight, scaleWidth } from "../utils/sizeUtils"
import AsyncStorage from '@react-native-async-storage/async-storage';


// Function to shape Arabic text (connect letters correctly)
const shapeArabicText = (text) => {
    const arabicLetters = {
        "ا": "ا", "ب": "ب", "ت": "ت", "ث": "ث", "ج": "ج", "ح": "ح", "خ": "خ", "د": "د", "ذ": "ذ", "ر": "ر",
        "ز": "ز", "س": "س", "ش": "ش", "ص": "ص", "ض": "ض", "ط": "ط", "ظ": "ظ", "ع": "ع", "غ": "غ", "ف": "ف",
        "ق": "ق", "ك": "ك", "ل": "ل", "م": "م", "ن": "ن", "ه": "ه", "و": "و", "ي": "ي"
    };

    return text.split('').map((char) => arabicLetters[char] || char).join('');
};

const ArabicScreen = ({ navigation }) => {
    const [show, setShow] = useState(false);
    const [countryCode, setCountryCode] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [data, setData] = useState([]);
    const [installedTime, setInstalledTime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCont, setShowCont] = useState(true);
    const widthBar = scaleWidth(1000);
    const heightBar = scaleHeight(800);
    const EnglishApiTopThree = "EN";
    const ArabicApi= "AR";

    // Navigate to the result screen
    function navigateResult() {
        navigation.navigate("resultScreen", {
            ArabicApi: "AR"
        });
    }

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

    // Fetch installation time
    useEffect(() => {
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

    // Handle country selection confirmation
    function checkInput() {
        if (selectedCountry === "" || selectedCountry === null) {
            Alert.alert("تنبيه", "يرجى اختيار دولة.", [
                { text: "حسنًا", style: "cancel" }
            ]);
                    } else {
            Alert.alert("", "هل أنت متأكد أنك تريد التصويت لـ " + selectedCountry.name.ar, [
                {
                    text: "نعم",
                    style: "cancel",
                    onPress: voteApiHandler,
                },
                { text: "لا", style: "cancel" },
            ]);
        }
    }
    
    const votesNewInfo = () => {
        setLoading(true);
        const apiUrl = `https://www.thinksmart.live/Country%20Voting/php/getVotes.php?language=${EnglishApiTopThree}&isTopThree=Y`;
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
                alert("خطأ في الاتصال. يرجى المحاولة مرة أخرى لاحقًا.");
                setLoading(false);
            });
    }


    // Handle the voting API
    const voteApiHandler = () => {
        setLoading(true);
        const apiUrl = `https://www.thinksmart.live/Country%20Voting/php/vote.php?language=AR&countryCode=${selectedCountry.code}&key=${installedTime + Device.osBuildId
            }&dateInstalled=${installedTime}`;
        
        fetch(apiUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then(async (data) => {
                if (data.statusCode == "0") {
                    await AsyncStorage.setItem('hasVoted', 'true');
                    Alert.alert("تم التصويت بنجاح", "لقد قمت بالتصويت لـ " + selectedCountry.name.ar, [
                        {
                            text: "حسنًا",
                            style: "cancel",
                            onPress: votesNewInfo,
                        },
                    ]);
                    setShowCont(false);
                } else {
                    setLoading(false);
                    if (data.statusCode == "-4") {
                        Alert.alert(
                            "غير قادر على التصويت!",
                            "الوقت المتبقي المقدر للتصويت: " + data.remainingTime,
                            [
                                {
                                    text: "حسنًا",
                                    style: "cancel",
                                },
                            ]
                        );
                    } else if (data.statusCode == "-5") {
                        Alert.alert("غير قادر على التصويت!", "لقد قمت بالتصويت بالفعل", [
                            {
                                text: "حسنًا",
                                style: "cancel",
                            },
                        ]);
                    } else {
                        Alert.alert("", "حدث خطأ ما. يرجى المحاولة مرة أخرى لاحقًا.", [
                            {
                                text: "أعد المحاولة",
                                style: "cancel",
                            },
                        ]);
                        console.log(apiUrl);
                    }
                }
            })
            .catch((error) => {
                setLoading(false);
                alert("خطأ في الاتصال. يرجى المحاولة مرة أخرى لاحقًا.");
            });
    };
    

    // Fetch voting data and format it
    useEffect(() => {
        setLoading(true);
        const apiUrl = `https://www.thinksmart.live/Country%20Voting/php/getVotes.php?language=${ArabicApi}&isTopThree=Y`;
        fetch(apiUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("API Response:", data); // Log the raw API response
                if (data?.data?.dataArr) {
                    const formattedData = data.data.dataArr.map((item) => ({
                        country: shapeArabicText(item.country), // Shape Arabic text here
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

    // Chart data setup
    const chartData = {
        labels: data.map((item) => shapeArabicText(item.country)), // Shape Arabic text correctly
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
                        أفضل ثلاث دول
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
                            decimalPlaces: 0,
                            color: (opacity = 4) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: () => `white`,
                            propsForLabels: {
                                fontFamily: 'Tajawal', // Check that this font supports Arabic
                                fontSize: scaleWidth(30),
                                fontWeight: 'normal',
                                textAlign: 'right',  // Align text to the right for RTL
                                writingDirection: 'rtl', // Explicitly set writing direction to RTL
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
                                عرض النتائج
                            </CustomButton>
                        </LinearGradient>
                    </View>
                    <View style={styles.countDownSentence}>
                        <Text style={styles.textSentence}>
                            لتوفير لك المعلومات الأكثر دقة وتحديثًا، نحتاج إلى 48 ساعة لمعالجة والتحقق من جميع التفاصيل.
                            هذا يضمن أن تصويتك يستند إلى أحدث البيانات وأكثرها موثوقية ويساعد في الحفاظ على نزاهة عملية التصويت.
                            شكرًا لتفهمك وصبرك!
                        </Text>
                    </View>
                    {showCont ?
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
                                            {selectedCountry.flag} {selectedCountry.name.ar} 
                                        </>
                                    ) : (
                                        'اختر الدولة'
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
                                            lang="ar" // Set language to Arabic
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
                                    التصويت للدولة
                                </CustomButton>
                            </LinearGradient>
                        </View> : <></>}
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
        fontFamily:"Tajawal"
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

export default ArabicScreen;
