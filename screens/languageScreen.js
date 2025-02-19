import React from "react";
import { View, Text, StyleSheet, ImageBackground, Image, Pressable } from "react-native";
import { scaleHeight, scaleWidth } from "../utils/sizeUtils";
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from "../components/CustomButton";

function LanguageScreen({ navigation }) {

    function navigateEnglish() {
        navigation.navigate("englishScreen");
    }

    function navigateArabic() {
        navigation.navigate("arabicScreen")
    }

    return (
        <ImageBackground
            source={require("../assets/testtt.jpg")}
            style={styles.container}
        >
            <Image
                source={require("../assets/GlobeImage.png")}
                style={[styles.whiteElement]}
            />
            <View style={styles.allBtns}>
                <LinearGradient
                    colors={['#80B3B7', '#316362']}
                    style={[styles.innerCircle, styles.gradientButton]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <CustomButton onPress={navigateEnglish} width={scaleWidth(1000)}>
                        English
                    </CustomButton>
                </LinearGradient>

                <Pressable onPress={navigateArabic}>
                    <LinearGradient
                        colors={['#80B3B7', '#316362']}
                        style={[styles.innerCircle, styles.gradientButton]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <CustomButton onPress={navigateArabic} width={scaleWidth(1000)} >
                            عربي
                        </CustomButton>

                    </LinearGradient>
                </Pressable>
            </View>
        </ImageBackground>
    )
};

export default LanguageScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    whiteElement: {
        width: "100%",
        height: scaleHeight(1100),
        position: "absolute",
        left: "50%",
        top: "50%",
        marginLeft: "-50%",
        marginTop: "-70%",
    },
    allBtns: {
        marginTop: scaleHeight(1100)
    },
    innerCircle: {
        marginTop: scaleHeight(150),
        borderRadius: 30
    },

});