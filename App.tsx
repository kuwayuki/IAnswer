import { NavigationContainer, RouteProp } from "@react-navigation/native";
import {
  StackNavigationProp,
  createStackNavigator,
} from "@react-navigation/stack";
import { Amplify } from "aws-amplify";
import React, { useEffect, useMemo, useState } from "react";
import CameraScreen from "./screens/CameraScreen";
import { authenticate } from "./screens/GuestAuth";
import ResultScreen from "./screens/ResultScreen";
import Constants from "expo-constants";
import {
  CameraPermissionResponse,
  MediaLibraryPermissionResponse,
  PermissionStatus,
  getCameraPermissionsAsync,
  getMediaLibraryPermissionsAsync,
  requestCameraPermissionsAsync,
} from "expo-image-picker";
import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
} from "expo-tracking-transparency";
import { Alert, AppState, AppStateStatus, Linking } from "react-native";
import { PROMPT_TEMPLATES } from "./screens/constant";
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
  isAppOpenRead: boolean;
  isInitialRead: boolean;
  isPremium: boolean;
  permission: CameraPermissionResponse | null;
  imagePermission: MediaLibraryPermissionResponse | null;
};
export const AppContextState = React.createContext({} as appContextState);

export type appContextDispatch = {
  setAiType: (aiType: number) => void;
  setSettingAiType: (settingAiType: number) => void;
  setAppOpenRead: (isAppOpenRead: boolean) => void;
  setInitialRead: (isInitialRead: boolean) => void;
  setPremium: (isPremium: boolean) => void;
  setPermission: (permission: CameraPermissionResponse) => void;
  setImagePermission: (imagePermission: MediaLibraryPermissionResponse) => void;
  requestPermission: () => Promise<void>;
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

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "ap-northeast-1_ko24HbtRe",
      userPoolClientId: "7g9p34va70an8glcrcd9tc2fn",
      identityPoolId: "ap-northeast-1:8aef5d24-b742-4b96-8734-1129d8e2179c",
    },
  },
  API: {
    REST: {
      IAnswer: {
        service: "IAnswer",
        endpoint:
          "https://3b1n19hsu4.execute-api.ap-northeast-1.amazonaws.com/Init",
        region: "ap-northeast-1",
      },
    },
  },
  Storage: {
    S3: {
      bucket: "ianswer1c0febcad18d444ca1fb391b19a950abb6a53-dev",
      region: "ap-northeast-1",
    },
  },
});

const App: React.FC = () => {
  const [aiType, setAiType] = useState(0);
  // 起動時読込フラグ
  const [isAppOpenRead, setAppOpenRead] = useState(false);
  const [isInitialRead, setInitialRead] = useState(false);
  const [isPremium, setPremium] = useState(false);
  const [settingAiType, setSettingAiType] = useState(0);
  const [permission, setPermission] = useState<CameraPermissionResponse | null>(
    null
  );
  const [imagePermission, setImagePermission] =
    useState<MediaLibraryPermissionResponse | null>(null);

  useEffect(() => {
    (async () => {
      const initialRead = await getLocalStorage(KEY.INITIAL_READ);
      if (!initialRead) {
        saveLocalStorage(KEY.INITIAL_READ, "true");
        Alert.alert(
          "利用方法",
          "写真を撮影すると、AIが回答してくれます。\r\nテストの回答、外国語の翻訳、ファッションチェック、食材からレシピの考案、料理のカロリー計算、ゴミの分別、植物のケア方法など使用したいライフスタイルに応じてご利用ください。\r\n\r\n注意：AIの回答はすべてが正しいというわけではありません。\r\nまた、悪用は厳禁でお願いします。",
          [
            {
              text: "OK",
              onPress: () => {
                setInitialRead(true);
              },
            },
          ]
        );
      } else {
        setAppOpenRead(true);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!isInitialRead) return;

      const { granted, canAskAgain } = await getTrackingPermissionsAsync();
      if (!granted && canAskAgain) {
        Alert.alert(
          "許可することで広告が最適化",
          "トラッキングを許可することで、マネーフォロー内の広告が適切に最適化され、関連性の高い広告が表示されます。\n\nまた、アプリ作者に広告収入が発生するので、このアプリの改善に使用します。",
          [
            {
              text: "OK",
              onPress: async () => {
                await requestTrackingPermissionsAsync();
                setAppOpenRead(true);
              },
            },
          ]
        );
      } else {
        setAppOpenRead(true);
      }
    })();
  }, [isInitialRead]);

  useEffect(() => {
    const appName = Constants.expoConfig?.name;
    const prompt = Object.values(PROMPT_TEMPLATES).find(
      (template) => template.AppName === appName
    );
    setSettingAiType(prompt!.No);
  }, []);

  useEffect(() => {
    const startSignIn = async () => {
      await authenticate();
    };
    // startSignIn();
  }, []);

  useEffect(() => {
    if (!isAppOpenRead) return;

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === "active" && !permission?.granted) {
        await requestPermission();
      }
      if (nextAppState === "active" && !imagePermission?.granted) {
        setImagePermission(await getMediaLibraryPermissionsAsync());
      }
    };
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [isAppOpenRead]);

  useEffect(() => {
    (async () => {
      if (!isAppOpenRead) return;
      await requestPermission();
      setImagePermission(await getMediaLibraryPermissionsAsync());
    })();
  }, [isAppOpenRead]);

  const requestPermission = async () => {
    const cameraPermission = await getCameraPermissionsAsync();
    setPermission(cameraPermission);
    if (!cameraPermission.granted) {
      if (cameraPermission.status === PermissionStatus.UNDETERMINED) {
        const tmpPermission = await requestCameraPermissionsAsync();
        setPermission(tmpPermission);
      } else {
        Alert.alert(
          "カメラの許可が必要です",
          "このアプリでカメラを使用するには、カメラの許可が必要です。設定画面で許可を変更してください。",
          [
            { text: "キャンセル", style: "cancel" },
            {
              text: "設定画面へ",
              onPress: () => Linking.openURL("app-settings:"),
            },
          ]
        );
      }
    }
  };

  const appContextStateValue = useMemo(
    () => ({
      aiType,
      settingAiType,
      isAppOpenRead,
      isInitialRead,
      isPremium,
      permission,
      imagePermission,
    }),
    [
      aiType,
      settingAiType,
      isAppOpenRead,
      isInitialRead,
      permission,
      imagePermission,
      isPremium,
    ]
  );

  return (
    <AppContextState.Provider value={appContextStateValue}>
      <AppContextDispatch.Provider
        value={{
          setAiType,
          setSettingAiType,
          setAppOpenRead,
          setInitialRead,
          setPremium,
          setPermission,
          setImagePermission,
          requestPermission,
        }}
      >
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Camera">
            <Stack.Screen
              name="Camera"
              component={CameraScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Result"
              component={ResultScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppContextDispatch.Provider>
    </AppContextState.Provider>
  );
};

export default App;
