import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { scaleHeight, scaleWidth } from "../utils/sizeUtils";

export default function CustomButton({ children, onPress, disabled, width }) {

    const [btnPressed, setBtnPressed] = useState(false);

    return (
        <View onTouchStart={() => { setBtnPressed(true) }} onTouchEnd={() => { setBtnPressed(false); onPress ? onPress() : null }}
            style={[styles.buttonContainer,
            {
                width: width,
                height: scaleHeight(130),
                borderWidth: 2,
                borderColor: "#F6B164",
                borderRadius: 30,



            },
            btnPressed ?
                [styles.buttonPressed,
                {
                    width: width,
                    height: scaleHeight(130),
                    backgroundColor: "#A9F2E7",
                    borderRadius: 30,
                    borderWidth: 2,
                    borderColor: "black",
                },
                ]
                : ''
            ]}>
            <Pressable disabled={disabled}>
                <Text style={[styles.buttonText,
                {
                    fontSize: scaleWidth(50),
                    color: "#F6B164",
                    fontFamily: "Tajawal",

                },
                btnPressed ? [{ color: "black" }] : ''
                ]}>
                    {children}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: '80%',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',

    },
    actionButton: {
        width: '80%',
        height: scaleHeight(130),
        borderRadius: 30
    },
});