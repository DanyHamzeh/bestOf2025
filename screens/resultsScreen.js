import React, { useState, useEffect } from 'react';
import { StyleSheet, ImageBackground, Text, View, ScrollView, RefreshControl } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Loader from '../components/Loader';
import { scaleHeight, scaleWidth } from "../utils/sizeUtils";

function ResultsScreen({ route }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const EnglishApi = route.params?.EnglishApi;
  const ArabicApi = route.params?.ArabicApi;
  const [data, setData] = useState([]);

  const apiUrl = `https://www.thinksmart.live/Country%20Voting/php/getVotes.php?language=${EnglishApi || ArabicApi}&isTopThree=N`;

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result?.data?.dataArr) {
        const formattedData = result.data.dataArr.map((item) => ({
          country: item.country,
          votingNumber: parseInt(item.votes),
        }));
        setData(formattedData);
      } else {
        alert("Unexpected data format received from the API.");
      }
    } catch (error) {
      console.error("Error occurred during fetch:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!EnglishApi && !ArabicApi) {
      alert("Both language parameters are missing!");
      setLoading(false);
      return;
    }
    fetchData();
  }, [EnglishApi, ArabicApi]);

  // Handle pull-to-refresh action
  const onRefresh = () => {
    setRefreshing(true);
    fetchData(); // Fetch data again when the user pulls to refresh
  };

  return (
    <LinearGradient
      colors={["#021F59", "#16CAF2"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          <View style={styles.titleCont}>
            <Text style={styles.countryResultStyle}>
              {EnglishApi ? "Country Results" : "نتائج الدول"}
            </Text>
          </View>
          <ScrollView
            style={styles.scrollViewContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View style={styles.allCont}>
              {data.map((item, index) => (
                <LinearGradient
                  key={index}
                  colors={["#16CAF2", "#021F59"]}
                  style={[styles.innerCircle, styles.gradientButton]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.votingStyle}>
                    <Text style={styles.textInside}>{item.country}</Text>
                    <View style={styles.votesNumberStyle}>
                      {ArabicApi ?
                        <Text style={styles.textInside}>عدد الأصوات</Text> : <Text style={styles.textInside}>Number of Votes</Text>
                      }
                      <Text style={styles.textInside}>{item.votingNumber}</Text>
                    </View>
                  </View>
                </LinearGradient>
              ))}
            </View>
          </ScrollView>
        </>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: 'center',
  },
  scrollViewContainer: {
    flex: 1,
    width: "95%",
    margin: "auto",
    marginBottom: scaleHeight(50),
    marginTop: scaleHeight(-100)
  },
  allCont: {
    width: "100%",
  },
  votingStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "95%",
  },
  innerCircle: {
    width: "95%",
    height: scaleHeight(150),
    borderRadius: 15,
    borderWidth: 0,
    borderColor: "#F6B164",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginTop: scaleHeight(50),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  dataItem: {
    marginVertical: scaleHeight(10),
    padding: scaleHeight(10),
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  countryText: {
    fontSize: scaleWidth(50),
    color: "#F6B164",
    fontWeight: "bold",
    fontFamily: 'Tajawal',

  },
  textInside: {
    fontSize: scaleWidth(40),
    color: "#F6B164",
    textAlign: "center",
    fontFamily: 'Tajawal',

  },
  countryResultStyle: {
    fontSize: scaleWidth(50),
    color: "#F6B164",
    fontWeight: "bold",
    fontFamily: 'Tajawal',

  },
  titleCont: {
    paddingVertical: scaleHeight(100)
  }
});

export default ResultsScreen;