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
        <LinearGradient
        colors={["#021F59", "#16CAF2"]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
    >
        <Image
            source={require("../assets/GlobeImage.png")}
            style={[styles.whiteElement]}
        />
        <View style={styles.allBtns}>
            <LinearGradient
                colors={["#16CAF2", "#021F59"]} 
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
                    colors={["#16CAF2", "#021F59"]} 
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
    </LinearGradient>
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