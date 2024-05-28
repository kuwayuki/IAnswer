import { NavigationContainer, RouteProp } from "@react-navigation/native";
import { Amplify } from "aws-amplify";
import {
  StackNavigationProp,
  createStackNavigator,
} from "@react-navigation/stack";
import React, { useEffect, useMemo, useState } from "react";
import CameraScreen from "./screens/CameraScreen";
import { authenticate } from "./screens/GuestAuth";
import ResultScreen from "./screens/ResultScreen";
// import { AdMobInterstitial, setTestDeviceIDAsync } from "expo-ads-admob";
import Constants from "expo-constants";
import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
} from "expo-tracking-transparency";
import { Alert } from "react-native";
import configure from "./amplifyconfiguration.json";
import { PROPMT_TEMPLATES } from "./screens/constant";
import { KEY, getLocalStorage, saveLocalStorage } from "./screens/utils";

const Stack = createStackNavigator<RootStackParamList>();
// ナビゲーションのパラメータ型を定義
export type RootStackParamList = {
  Camera: undefined;
  Result: {
    result: any;
    uri: string;
  };
};

export type ResultScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Result"
>;
export type ResultScreenRouteProp = RouteProp<RootStackParamList, "Result">;

// 全ページの共通項目
export type appContextState = {
  aiType: number;
  settingAiType: number;
};
export const AppContextState = React.createContext({} as appContextState);

export type appContextDispatch = {
  setAiType: (aiType: number) => void;
  setSettingAiType: (settingAiType: number) => void;
};
export const AppContextDispatch = React.createContext({} as appContextDispatch);

export type ApiBodyType = {
  key: string;
  promptUser?: string;
  promptSystem?: string;
};

export type ApiResponseType = {
  statusCode: number;
  openAiResult: OpenAiResult[];
};

export type OpenAiResult = {
  No: number;
  title: string;
  body: string;
  answer: string;
  explanation: string;
  result: boolean;
};

Amplify.configure(configure);

const App: React.FC = () => {
  const [aiType, setAiType] = useState(0);
  const [settingAiType, setSettingAiType] = useState(0);

  useEffect(() => {
    (async () => {
      const { granted, canAskAgain } = await getTrackingPermissionsAsync();
      if (!granted && canAskAgain) {
        Alert.alert(
          "許可することで広告が最適化",
          "トラッキングを許可することで、マネーフォロー内の広告が適切に最適化され、関連性の高い広告が表示されます。\n\nまた、アプリ作者に広告収入が発生するので、このアプリの改善に使用します。",
          [
            {
              text: "OK",
              onPress: async () => {
                const { status } = await requestTrackingPermissionsAsync();
                if (status === "granted") {
                  console.log("Yay! I have user permission to track data");
                }
              },
            },
          ]
        );
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const initalRead = await getLocalStorage(KEY.INITIAL_READ);
      if (!initalRead) {
        Alert.alert(
          "注意",
          "こちらはAIを利用していますが、回答はすべてが正しいというわけではありません。\r\nまた、悪用は厳禁でお願いします。",
          [
            {
              text: "OK",
              onPress: () => saveLocalStorage(KEY.INITIAL_READ, "true"),
            },
          ]
        );
      }
    })();
  }, []);

  useEffect(() => {
    const appName = Constants.expoConfig?.name;
    const propmpt = Object.values(PROPMT_TEMPLATES).find(
      (template) => template.AppName === appName
    );
    setSettingAiType(propmpt!.No);
    console.log(propmpt);
  }, []);

  useEffect(() => {
    console.log("APP Start");
    const startSignIn = async () => {
      // const userNameInput = "y.kuwahara5";
      // // const passwordInput = "interCOM12";
      // const passwordInput = "kuwa1003";
      // const confirmationCodeInput = "537200";
      // try {
      //   const signUpInfo = await signUp({
      //     username: userNameInput,
      //     password: passwordInput,
      //     options: {
      //       userAttributes: {
      //         email: "ee68028@gmail.com",
      //       },
      //       // optional
      //       // autoSignIn: true, // or SignInOptions e.g { authFlowType: "USER_SRP_AUTH" }
      //     },
      //   });
      //   console.log(signUpInfo);
      // } catch (error) {
      //   console.log(error);
      // }
      // try {
      //   const signUpInfo = await confirmSignUp({
      //     username: userNameInput,
      //     confirmationCode: confirmationCodeInput,
      //   });
      //   console.log(signUpInfo);
      // } catch (error) {
      //   console.log(error);
      // }

      // let loginInfo;
      // try {
      //   console.log("getCurrentUser");
      //   loginInfo = await getCurrentUser();
      //   console.log(loginInfo);
      // } catch (error) {
      //   console.log(JSON.stringify(error, null, 2));
      // }

      // if (!loginInfo) {
      //   // try {
      //   //   console.log("Sign Out");
      //   //   const signInfo = await signOut();
      //   //   console.log(signInfo);
      //   // } catch (error) {
      //   //   console.error(JSON.stringify(error, null, 2));
      //   // }
      //   try {
      //     console.log("Sign In");
      //     const signInfo = await signIn({
      //       username: userNameInput,
      //       password: passwordInput,
      //       options: {
      //         authFlowType: "USER_PASSWORD_AUTH",
      //       },
      //     });
      //     console.log(signInfo);
      //   } catch (error) {
      //     console.error(JSON.stringify(error, null, 2));
      //   }
      // }
      await authenticate();
    };
    startSignIn();

    // initializeInterstitialAd();
  }, []);

  const appContextStateValue = useMemo(
    () => ({ aiType, settingAiType }),
    [aiType, settingAiType]
  );

  return (
    <AppContextState.Provider value={appContextStateValue}>
      <AppContextDispatch.Provider value={{ setAiType, setSettingAiType }}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Camera">
            <Stack.Screen
              name="Camera"
              component={CameraScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Result" component={ResultScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppContextDispatch.Provider>
    </AppContextState.Provider>
  );
};

export default App;
