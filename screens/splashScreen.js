import {
    StyleSheet,
    ImageBackground,
} from "react-native";
import React, { useEffect } from "react";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from "react-native-reanimated";
import AnimatedText from "./AnimatedText";
import { scaleHeight, scaleWidth } from "../utils/sizeUtils";


const Splashscreen = ({ onAnimationEnd }) => {


    const whiteElementOpacity = useSharedValue(0);
    const logoOpacity = useSharedValue(0);

    const whiteElementStyle = useAnimatedStyle(() => ({
        opacity: whiteElementOpacity.value,
    }));


    // Trigger animations in sequence
    useEffect(() => {
        setTimeout(() => {
            whiteElementOpacity.value = withTiming(1, {
                duration: 1000,
                easing: Easing.out(Easing.ease),
            });

            setTimeout(() => {
                logoOpacity.value = withTiming(1, {
                    duration: 1000,
                    easing: Easing.ease,
                });
            }, 1000); // Delay for the white element animation to complete
        }, 1500); // Delay for elements slide animation

        // End splash after animation
        const timer = setTimeout(() => {
            onAnimationEnd();
        }, 4000); // Adjust timing to match animation

        return () => clearTimeout(timer);
    }, []);

    return (
        <ImageBackground
            source={require("../assets/GlobeImageBackground.jpg")}
            style={styles.container}
        >
            <Animated.Image
                source={require("../assets/backtest.png")}
                style={[styles.whiteElement, whiteElementStyle]}
            />
            <AnimatedText text="BEST OF 2025" />

        </ImageBackground>
    );
};

export default Splashscreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        width: "100%",
    },
    element: {
        position: "absolute",
    },
    whiteElement: {
        width: "95%",
        height: scaleHeight(1100),
        position: "absolute",
        left: "50%",
        top: "50%",
        marginLeft: "-50%",
        marginTop: "-70%",
    },
    logo: {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
    },
});
