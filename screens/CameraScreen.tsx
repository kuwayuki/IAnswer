import { post } from "@aws-amplify/api";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
  CameraType,
  CameraView,
  PermissionStatus,
  useCameraPermissions,
} from "expo-camera";
import React, {
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ApiBodyType,
  AppContextDispatch,
  AppContextState,
  RootStackParamList,
} from "../App";
import { BANNER_UNIT_ID, PROMPT_TEMPLATE, PROMPT_TEMPLATES } from "./constant";
import Constants from "expo-constants";
import {
  GestureEvent,
  GestureHandlerRootView,
  PinchGestureHandler,
  State,
} from "react-native-gesture-handler";
import DropDownPickerAtom from "./DropDownPickerAtom";
import IconAtom from "./IconAtom";
import { uploadFile } from "./s3";
import { KEY, getLocalStorage, saveLocalStorage } from "./utils";
import * as ImageManipulator from "expo-image-manipulator";
import {
  MediaTypeOptions,
  launchImageLibraryAsync,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
// TODO: Google Admob
// import { initializeInterstitialAd, showInterstitialAd } from "./AdmobInter";
// import {
//   BannerAd,
//   BannerAdSize,
//   TestIds,
// } from "react-native-google-mobile-ads";

const { width: screenWidth } = Dimensions.get("window");
const CameraScreen: React.FC = () => {
  const appContextState = useContext(AppContextState);
  const appContextDispatch = useContext(AppContextDispatch);
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [resizedPhotoUri, setResizedPhotoUri] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDisplayExplane, setDisplayExplane] = useState(false);
  const [isOpenDropbox, setOpenDropbox] = useState(false);
  const [prompt, setProompt] = useState<PROMPT_TEMPLATE>();
  const [mode, setMode] = useState<number>(1);
  const [zoom, setZoom] = useState(0);
  const pinchRef = useRef(null);

  const navigation =
    useNavigation<NavigationProp<RootStackParamList, "Camera">>();

  useEffect(() => {
    (async () => {
      const appName = Constants.expoConfig?.name;
      const prompt = Object.values(PROMPT_TEMPLATES).find(
        (template) => template.AppName === appName
      );
      const settingAiType = prompt!.No;
      if (settingAiType === PROMPT_TEMPLATES.ALL.No) {
        const aiType = await getLocalStorage(KEY.AI_TYPE);
        setMode(
          aiType !== undefined ? Number(aiType) : PROMPT_TEMPLATES.TEST.No
        );
      } else {
        setMode(settingAiType);
      }
      // TODO: Google Admob
      // if (!appContextState.isPremium) initializeInterstitialAd();
    })();
  }, []);

  useEffect(() => {
    if (mode === 0) return;

    const propmpt = Object.values(PROMPT_TEMPLATES).find(
      (template) => template.No === mode
    );
    setProompt(propmpt);
    saveLocalStorage(KEY.AI_TYPE, mode);

    setDisplayExplane(false);
  }, [mode]);

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const handlePinchGesture = (event: GestureEvent<any>) => {
    console.log(event);
    if (event.nativeEvent.state === State.ACTIVE) {
      let newZoom = zoom + event.nativeEvent.velocity * 0.0002;
      if (newZoom < 0) newZoom = 0;
      if (newZoom > 1) newZoom = 1;
      setZoom(newZoom);
    }
  };

  const takePicture = async () => {
    await appContextDispatch.requestPermission();
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      // photo = await cropImage(photo!.uri);
      setPhotoUri(photo!.uri);
      Image.getSize(photo!.uri, (width, height) => {
        setImageSize({ width, height });
      });
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

  const cropImage = async (uri: string) => {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [
        // { crop: { originX: 0, originY: 0, width: 1200, height: 1200 } },
        {
          extent: { backgroundColor: "blue", width: 800, height: 800 },
        } as ImageManipulator.ActionExtent,
      ],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );
    setResizedPhotoUri(manipResult.uri);
    return manipResult;
  };

  const getImageStyle = () => {
    if (!imageSize) {
      return styles.preview;
    }
    const aspectRatio = imageSize.width / imageSize.height;
    if (imageSize.width > screenWidth) {
      return {
        width: screenWidth,
        height: screenWidth / aspectRatio,
      };
    }
    return {
      width: imageSize.width,
      height: imageSize.height,
    };
  };

  const openImagePickerAsync = async () => {
    if (!appContextState.imagePermission?.granted) {
      if (
        appContextState.imagePermission?.status ===
        PermissionStatus.UNDETERMINED
      ) {
        const tmpPermission = await requestMediaLibraryPermissionsAsync();
        appContextDispatch.setImagePermission(tmpPermission);
      } else {
        Alert.alert(
          "イメージビューの許可が必要です",
          "参照するには許可が必要です。設定画面で許可を変更してください。",
          [
            { text: "キャンセル", style: "cancel" },
            {
              text: "設定画面へ",
              onPress: () => Linking.openURL("app-settings:"),
            },
          ]
        );
      }
      return;
    }

    const pickerResult = await launchImageLibraryAsync({
      selectionLimit: 1,
      mediaTypes: MediaTypeOptions.Images,
      quality: 0.1,
    });
    if (!pickerResult.canceled) {
      const url = pickerResult.assets[0].uri;
      setPhotoUri(url);
      Image.getSize(url, (width, height) => {
        setImageSize({ width, height });
      });
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
      // TODO: Google Admob
      // if (!appContextState.isPremium) showInterstitialAd();
      let tmpPhotoUri = _photoUri ?? photoUri;
      if (!tmpPhotoUri) return;
      const size = _photoUri
        ? Image.getSize(_photoUri, (width, height) => {
            setImageSize({ width, height });
          })
        : null;
      setLoading(true);
      const response = await fetch(tmpPhotoUri);
      console.log(response);
      const blob = await response.blob();
      const fileName = tmpPhotoUri.split("/").pop() || "image.jpg";

      const filePath = `public/${fileName}`;
      try {
        // const result = await uploadFileAmplify(blob, filePath);
        const result = await uploadFile(blob, filePath);
        console.log(result);
      } catch (error) {
        console.error(JSON.stringify(error, null, 2));
        alert(JSON.stringify(error, null, 2));
        alert("S3読み込みに失敗しました。");
        return;
      }

      const apiResponse = await post({
        apiName: "IAnswer",
        path: "/image/upload",
        options: {
          body: {
            key: filePath,
            promptUser: prompt!.PromptUser,
            promptSystem: prompt!.PromptSystem,
          } as ApiBodyType,
        },
      }).response;
      if (apiResponse.statusCode !== 200) {
        alert(prompt!.PromptUser);
        alert(prompt!.PromptSystem);
        alert("API読み込みに失敗しました。");
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
  } else if (!appContextState.permission?.granted) {
    // return (
    //   <View style={styles.loadingContainer}>
    //     <ActivityIndicator size="large" color="#000000" />
    //     <Text>解析中...</Text>
    //   </View>
    // );
  }

  const CameraOrView = (child?: ReactNode) => {
    if (appContextState.permission?.granted) {
      return (
        <GestureHandlerRootView style={styles.cameraOutLine}>
          <PinchGestureHandler
            onGestureEvent={handlePinchGesture}
            ref={pinchRef}
          >
            <CameraView
              style={styles.camera}
              facing={facing}
              mute={true}
              zoom={zoom}
              pictureSize="1280x720"
              ref={(ref) => setCameraRef(ref)}
            >
              {child}
            </CameraView>
          </PinchGestureHandler>
        </GestureHandlerRootView>
      );
    } else {
      return (
        <View style={styles.cameraOutLine}>
          <View style={styles.camera}>{child}</View>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {photoUri ? (
        <>
          <Image source={{ uri: photoUri }} style={getImageStyle()} />
        </>
      ) : (
        <View style={styles.container}>
          {prompt?.ShortExplane && (
            <View>
              <Text style={styles.headerHelpText}>{prompt?.ShortExplane}</Text>
            </View>
          )}
          {CameraOrView(
            mode === PROMPT_TEMPLATES.FASSION.No ? (
              <TouchableOpacity
                style={styles.toogleFacing}
                onPress={toggleCameraFacing}
              >
                <IconAtom name="camera-reverse" type="ionicon" size={20} />
              </TouchableOpacity>
            ) : undefined
          )}
          <TouchableOpacity
            style={styles.toogle}
            onPress={() => setDisplayExplane(!isDisplayExplane)}
          >
            <IconAtom
              name="help"
              type="ionicon"
              size={24}
              style={styles.toogleText}
            />
          </TouchableOpacity>
          {(isDisplayExplane || isOpenDropbox) && prompt?.Explane && (
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
              <IconAtom
                name="picture"
                type="simple-line-icon"
                style={styles.galleryButtonText}
                size={24}
                onPress={openImagePickerAsync}
              />
            </TouchableOpacity>
          </View>
          {appContextState.settingAiType === PROMPT_TEMPLATES.ALL.No && (
            <View style={styles.pickerContainer}>
              <DropDownPickerAtom
                value={mode}
                setValue={setMode}
                items={Object.values(PROMPT_TEMPLATES)
                  .filter((allExclude) => allExclude.No > 0)
                  .map((template: PROMPT_TEMPLATE) => ({
                    label: template.Title,
                    value: template.No,
                  }))}
                open={isOpenDropbox}
                setOpen={setOpenDropbox}
              />
            </View>
          )}
        </View>
      )}
      {/* {!appContextState.isPremium && (
        // TODO: Google Admob
        <BannerAd
          // unitId={TestIds.BANNER}
          unitId={BANNER_UNIT_ID.BANNER}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dcdcdc",
  },
  cameraOutLine: {
    backgroundColor: "#f5f5f5",
    marginTop: 64,
    // marginBottom: 30,
    flex: 1,
  },
  camera: {
    margin: 8,
    flex: 1,
    maxHeight: "76%",
    alignItems: "center",
    justifyContent: "center",
  },
  preview: {
    flex: 1,
    width: "100%",
  },
  loading: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  headerHelpText: {
    top: 36,
    position: "absolute",
    alignSelf: "center",
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.6)",
  },
  toogleFacing: {
    top: 8,
    right: 8,
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
    position: "absolute",
    top: "24%",
    left: "10%",
    right: "10%",
    backgroundColor: "rgba(255, 255, 255, 0.7)", // 透明度を下げる
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
  },
  galleryButton: {},
  galleryButtonText: {
    fontSize: 32,
    width: 200,
    height: 200,
    top: 4,
    left: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    position: "absolute",
    bottom: 20,
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0)", // 透明度を下げる
    borderRadius: 10,
    padding: 10,
    alignSelf: "center",
    maxWidth: 280,
  },
  pickerText: {
    // color: "rgba(255, 255, 255, 0.3)", // 透明度を下げる
    textAlign: "center",
    fontSize: 18,
  },
  toogle: {
    bottom: 0,
    left: 10,
    backgroundColor: "rgba(255, 255, 255, 0)", // 透明度を下げる
    position: "absolute",
    alignSelf: "flex-end",
  },
  toogleText: {
    width: 200,
    height: 200,
    left: 3,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CameraScreen;
