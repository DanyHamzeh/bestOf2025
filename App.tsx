import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import { useEffect, useState } from 'react';
import Splashscreen from './screens/splashScreen';
import LanguageScreen from './screens/languageScreen';
import EnglishScreen from './screens/englishScreen';
import ArabicScreen from './screens/arabicScreen';
import ResultsScreen from './screens/resultsScreen';


import { enableScreens } from 'react-native-screens';






export default function App() {
  const Stack = createStackNavigator();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  

  // SplashScreen.preventAutoHideAsync();
  // setTimeout(SplashScreen.hideAsync, 5000);

  const [loaded] = useFonts({
    "gotham-bold": require("./assets/Fonts/gothambold/gotham-bold-webfont.ttf"),
    'Tajawal':require("./assets/Fonts/Tajawal-ExtraBold.ttf")
  });


  useEffect(() => {
    if (loaded) {
      setFontsLoaded(true);
      // I18nManager.forceRTL(true);
      // I18nManager.allowRTL(true);
    }
  }, [loaded]);

  const [isSplashVisible, setIsSplashVisible] = useState(true);


  const handleAnimationEnd = () => {
    setIsSplashVisible(false);
  };

  if (isSplashVisible) {
    return (
      <>
        <Splashscreen onAnimationEnd={handleAnimationEnd} />
      </>
    )

  }
  enableScreens();


  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="languageScreen"
            component={LanguageScreen}
            options={{
              title: "",
            }}
          />
          <Stack.Screen
            name="englishScreen"
            component={EnglishScreen}
            options={{
              title: "",
            }}
          />
          <Stack.Screen
            name="arabicScreen"
            component={ArabicScreen}
            options={{
              title: "",
            }}
          />
          <Stack.Screen
            name="resultScreen"
            component={ResultsScreen}
            options={{
              title: "",
            }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}


