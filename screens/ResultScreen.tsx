import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import {
  useNavigation,
  useRoute,
  RouteProp,
  NavigationProp,
} from "@react-navigation/native";
import {
  OpenAiResult,
  ResultScreenRouteProp,
  RootStackParamList,
} from "../App";
// import { AdMobInterstitial } from "expo-ads-admob";
const { width: screenWidth } = Dimensions.get("window");

const ResultScreen: React.FC = () => {
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, "Result">>();

  const route = useRoute<ResultScreenRouteProp>();
  const { result, uri } = route.params;
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const size = Image.getSize(uri, (width, height) => {
      return { width, height };
    });
    setImageSize(getImageStyle(size));
  }, [uri]);

  if (!Array.isArray(result))
    return (
      <View style={styles.container}>
        <Text style={styles.resultItem}>解析結果: {result}</Text>
      </View>
    );

  const normalView = (item: OpenAiResult, index: number) => {
    return (
      <View key={index} style={styles.resultItem}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{item.title} </Text>
          {item.result != undefined && (
            <Text style={item.result ? styles.answer : styles.answer_failed}>
              {`（${item.result ? "〇" : "×"}）`}
            </Text>
          )}
        </View>
        {item.body && <Text style={styles.body}>{item.body}</Text>}
        {item.answer && (
          <Text style={item.result ? styles.answer : styles.answer_failed}>
            回答: {item.answer}
          </Text>
        )}
        {item.explanation && (
          <Text style={styles.explanation}>解説: {item.explanation}</Text>
        )}
        {/* <Text style={styles.result}>結果: {item.result ? "〇" : "×"}</Text> */}
      </View>
    );
  };
  const getImageStyle = (imageSize: { width: number; height: number }) => {
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

  return (
    <ScrollView style={styles.container}>
      {result.map((item: OpenAiResult, index: number) =>
        normalView(item, index)
      )}
      <>
        <Image source={{ uri: uri }} style={{ ...imageSize }} />
      </>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  preview: {
    width: screenWidth,
    height: 500,
  },
  resultItem: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
    marginBottom: 8,
  },
  answer: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "green",
  },
  answer_failed: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "red",
  },
  explanation: {
    fontSize: 14,
    marginBottom: 8,
    color: "#555",
  },
  result: {
    fontSize: 14,
    fontWeight: "bold",
    color: "green",
  },
});
export default ResultScreen;
