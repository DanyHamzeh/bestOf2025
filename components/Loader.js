import { View, ActivityIndicator, StyleSheet, Text } from "react-native";

export default function Loader() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#F6B164" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },

});
