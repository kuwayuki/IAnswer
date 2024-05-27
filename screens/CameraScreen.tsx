import { post } from "@aws-amplify/api";
import { uploadData } from "@aws-amplify/storage";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ApiBodyType, AppContextState, RootStackParamList } from "../App";
import RNPickerSelect from "react-native-picker-select";
import { BANNER_UNIT_ID, PROPMT_TEMPLATE, PROPMT_TEMPLATES } from "./constant";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { KEY, getLocalStorage, saveLocalStorage } from "./utils";
import { Icon } from "react-native-elements";
import IconAtom from "./IconAtom";
import Constants from "expo-constants";
// import { AdMobInterstitial } from "expo-ads-admob";

const CameraScreen: React.FC = () => {
  const appContextState = useContext(AppContextState);
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [status, requestStatusPermission] =
    ImagePicker.useMediaLibraryPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDisplayExplane, setDisplayExplane] = useState(false);
  const [prompt, setProompt] = useState<PROPMT_TEMPLATE>();
  const [mode, setMode] = useState<number>(0);

  const navigation =
    useNavigation<NavigationProp<RootStackParamList, "Camera">>();

  useEffect(() => {
    (async () => {
      const appName = Constants.expoConfig?.name;
      const propmpt = Object.values(PROPMT_TEMPLATES).find(
        (template) => template.AppName === appName
      );
      const settingAiType = propmpt!.No;
      if (settingAiType === PROPMT_TEMPLATES.ALL.No) {
        const aiType = await getLocalStorage(KEY.AI_TYPE);
        setMode(
          aiType !== undefined ? Number(aiType) : PROPMT_TEMPLATES.TEST.No
        );
      } else {
        setMode(settingAiType);
      }
    })();
  }, []);

  useEffect(() => {
    const propmpt = Object.values(PROPMT_TEMPLATES).find(
      (template) => template.No === mode
    );
    setProompt(propmpt);
  }, [mode]);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }
  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      setPhotoUri(photo!.uri);
      Alert.alert("写真を送信", "この写真を送信しますか？", [
        {
          text: "キャンセル",
          style: "cancel",
          onPress: () => {
            setPhotoUri(null);
          },
        },
        { text: "送信", onPress: () => uploadPhoto(photo!.uri) },
      ]);
    }
  };

  const openImagePickerAsync = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      requestStatusPermission;
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      selectionLimit: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.1,
    });
    console.log(pickerResult);
    if (!pickerResult.canceled) {
      setPhotoUri(pickerResult.assets[0].uri);
      Alert.alert("写真を送信", "この写真を送信しますか？", [
        {
          text: "キャンセル",
          style: "cancel",
          onPress: () => {
            setPhotoUri(null);
          },
        },
        {
          text: "送信",
          onPress: () => uploadPhoto(pickerResult.assets[0].uri),
        },
      ]);
    }
  };

  const uploadPhoto = async (_photoUri?: string) => {
    try {
      let tmpPhotoUri = _photoUri ?? photoUri;
      if (!tmpPhotoUri) return;
      setLoading(true);
      const response = await fetch(tmpPhotoUri);
      // console.log(response);
      const blob = await response.blob();
      const fileName = tmpPhotoUri.split("/").pop() || "image.jpg";
      // const resultDownload = await getProperties({
      //   path: "public/test.jpg",
      // });
      // console.log(resultDownload);
      // 認証を確認・取得
      // try {
      //   // const result = await getProperties({
      //   //   // `identityId` will provide the ID of the currently authenticated user
      //   //   path: ({ identityId }) => `private/${identityId}/album/2024/1.jpg`,
      //   // });

      //   const result = await list({ path: "public/" });
      //   console.log(result);
      // } catch (error) {
      //   console.log("errorA");
      //   console.error(error);
      // }
      const filePath = `public/${fileName}`;
      try {
        const result = await uploadData({
          data: blob,
          path: filePath,
          options: {
            onProgress: ({ transferredBytes, totalBytes }) => {
              if (totalBytes) {
                console.log(
                  `Upload progress ${Math.round(
                    (transferredBytes / totalBytes) * 100
                  )} %`
                );
              }
            },
          },
        }).result;
      } catch (error) {
        console.log(JSON.stringify(error, null, 2));
        alert("読み込みに失敗しました。");
        return;
      }

      const apiResponse = await post({
        apiName: "IAnswer",
        path: "/image/upload",
        options: {
          body: {
            key: filePath,
            promptUser: prompt!.PropmtUser,
            promptSystem: prompt!.PropmtSystem,
          } as ApiBodyType,
        },
      }).response;
      if (apiResponse.statusCode !== 200) {
        alert("読み込みに失敗しました。");
        return;
      }

      const bodyJson = await apiResponse.body.json();
      console.log(bodyJson);
      console.log(typeof bodyJson);
      let body =
        typeof bodyJson === "string"
          ? JSON.parse(bodyJson)
          : (bodyJson as any).body;
      console.log(body);
      // const bodyJson = await apiResponse.;
      // console.log(bodyJson as ApiResponseType);

      if (typeof body === "string") {
        const formattedResult = body.replace(/'/g, '"'); // シングルクォートをダブルクォートに変換
        try {
          body = JSON.parse(formattedResult);
        } catch (error) {
          console.error(error);
        }
      }
      navigation.navigate("Result", {
        result: body,
        uri: _photoUri!,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setPhotoUri(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
        <Text>解析中...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {photoUri ? (
        <>
          <Image source={{ uri: photoUri }} style={styles.preview} />
        </>
      ) : (
        <CameraView
          style={styles.camera}
          facing={facing}
          mute={true}
          pictureSize="1280x720"
          ref={(ref) => setCameraRef(ref)}
        >
          {mode === PROPMT_TEMPLATES.FASSION.No && (
            <TouchableOpacity
              style={styles.toogle}
              onPress={toggleCameraFacing}
            >
              <IconAtom
                name="camera-reverse"
                type="ionicon"
                onPress={toggleCameraFacing}
                size={20}
              />
            </TouchableOpacity>
          )}
          {isDisplayExplane && prompt?.Explane && (
            <View style={styles.explaneContainer}>
              <Text style={styles.explaneTitle}>{"説明"}</Text>
              <Text style={styles.explaneText}>{prompt?.Explane}</Text>
            </View>
          )}
          <View style={styles.shutterButtonContainer}>
            <TouchableOpacity
              style={styles.shutterButton}
              onPress={takePicture}
            ></TouchableOpacity>
          </View>
          <View style={styles.galleryButtonContainer}>
            <TouchableOpacity
              style={styles.galleryButton}
              onPress={openImagePickerAsync}
            >
              <Text style={styles.galleryButtonText}>🖼</Text>
            </TouchableOpacity>
          </View>
          {appContextState.settingAiType === PROPMT_TEMPLATES.ALL.No && (
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                value={mode}
                onDonePress={() => setDisplayExplane(false)}
                onClose={() => setDisplayExplane(false)}
                onValueChange={(value: number) => {
                  setMode(value > 0 ? value : 1);
                  setFacing("back");
                  setDisplayExplane(true);
                  saveLocalStorage(KEY.AI_TYPE, value);
                }}
                items={[
                  { label: "🖋テスト回答モード", value: 1 },
                  { label: "👗ファッションチェックモード", value: 2 },
                  { label: "🍳レシピモード", value: 3 },
                  { label: "㎈カロリーモード", value: 4 },
                  { label: "🚮ゴミ分別モード", value: 5 },
                ]}
                style={{
                  inputIOS: styles.pickerText,
                  inputAndroid: styles.pickerText,
                }} // 追加
              />
            </View>
          )}
        </CameraView>
      )}
      {/* <BannerAd
        unitId={BANNER_UNIT_ID.BANNER}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ keywords: ["Dental Equipment"] }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // maxHeight: "80%",
  },
  camera: {
    flex: 1,
  },
  preview: {
    flex: 1,
    width: "100%",
  },
  toogle: {
    top: 40,
    right: 10,
    position: "absolute",
    alignSelf: "flex-end",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  buttonContainer: {
    flex: 0.1,
    justifyContent: "flex-end",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  shutterButtonContainer: {
    position: "absolute",
    bottom: 80,
    left: "50%",
    transform: [{ translateX: -35 }],
    alignItems: "center",
    justifyContent: "center",
  },
  shutterButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(200, 200, 200, 0.3)", // 完全に透明に設定
    borderWidth: 5, // 枠線を追加
    borderColor: "gray", // 枠線の色を白に設定
  },
  explaneContainer: {
    top: "30%",
    left: "10%",
    backgroundColor: "rgba(255, 255, 255, 0.7)", // 透明度を下げる
    maxWidth: "80%",
  },
  explaneTitle: {
    fontSize: 20,
    padding: 8,
  },
  explaneText: {
    left: 20,
    maxWidth: "90%",
    height: 250,
    fontSize: 16,
  },
  galleryButtonContainer: {
    position: "absolute",
    bottom: 85,
    left: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    // backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  galleryButtonText: {
    fontSize: 36,
  },
  pickerContainer: {
    position: "absolute",
    bottom: 20,
    left: 50,
    right: 50,
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0)", // 透明度を下げる
    borderRadius: 10,
    padding: 10,
  },
  pickerText: {
    color: "rgba(255, 255, 255, 0.3)", // 透明度を下げる
    textAlign: "center",
    fontSize: 18,
  },
});

export default CameraScreen;
