import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { openURL } from "expo-linking";
import IconAtom from "./IconAtom";
import { pointsChange } from "./utils";
import { AppContextState } from "../App";
import Purchases, {
  CustomerInfo,
  PurchasesOffering,
  LOG_LEVEL,
} from "react-native-purchases";

type PointPack = {
  id: string;
  points: number;
  price: number;
  bonusPoints?: number;
};

// 1回5円ほど...10:50, 100: 500
const pointPacks: PointPack[] = [
  { id: "price_1", points: 3, price: 100 }, // 14 (+50)
  { id: "price_2", points: 10, price: 300, bonusPoints: 2 }, // 42 (+160)
  { id: "price_3", points: 20, price: 500, bonusPoints: 5 }, // 70 (+250)
  { id: "price_4", points: 45, price: 1000, bonusPoints: 15 }, // 140 (+490)
  { id: "price_5", points: 100, price: 2000, bonusPoints: 40 }, // 280 (+900)
];

const subscriptionPointPacks: PointPack[] = [
  // { id: "sub_1", points: 25, price: 500 },
  // { id: "sub_2", points: 60, price: 1000 },
  // { id: "sub_3", points: 130, price: 2000 },
];

const NAME = "チケット";
const PurchaseOptions: React.FC = () => {
  // const [currentOffering, setCurrentOffering] =
  // useState<PurchasesOffering | null>(null);

  useEffect(() => {
    try {
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
      Purchases.configure({ apiKey: "appl_miqrnekZMsTcXqtGnQlMGBqpYQG" });
    } catch (error) {}
  }, []);

  const fetchProducts = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null) {
        // Offerings が存在する場合、最初のパッケージを取得
        return offerings.current.availablePackages;
      }
      return [];
    } catch (error) {
      console.error("Error fetching offerings", error);
      return [];
    }
  };

  const purchaseProduct = async (productId: string): Promise<boolean> => {
    try {
      const packages = await fetchProducts();
      const desiredPackage = packages.find(
        (p) => p.product.identifier === productId
      );
      if (desiredPackage) {
        await Purchases.purchasePackage(desiredPackage);
        return true; // 購入が成功したことを示す
      }
    } catch (error: any) {
      if (!error.userCancelled) {
        console.error("Purchase failed", error);
      }
    }
    return false;
  };

  const payment = async (point: PointPack) => {
    if (await purchaseProduct(point.id)) {
      await pointsChange(point.points);
    }
  };

  return (
    <ScrollView style={styles.optionsContainer}>
      <View style={{ margin: 8 }}>
        <Text style={styles.optionTitle}>
          購入した{NAME}
          は1日のAI利用制限を超えて使用できます。また、広告が表示されないため、結果を確認するまでの時間が短くなります。
        </Text>
        <Text style={styles.optionWarning}>
          注意：{NAME}
          消費時は動画広告はでませんが、解析には多少の時間がかかります。
        </Text>
      </View>
      {pointPacks.map((pack) => (
        <View key={pack.id} style={styles.optionItem}>
          <View style={styles.bonusContainer}>
            <IconAtom
              name="ticket"
              type="ionicon"
              size={20}
              style={styles.bonusIcon}
            />
            <Text style={styles.optionText}>
              {pack.points}
              {NAME}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.priceButton}
            onPress={() => payment(pack)}
          >
            <Text style={styles.priceText}>¥{pack.price}</Text>
          </TouchableOpacity>
          {pack.bonusPoints && (
            <Text style={styles.bonusText}>
              ボーナス: {pack.bonusPoints}
              {NAME}
            </Text>
          )}
        </View>
      ))}
      {subscriptionPointPacks?.length > 0 && (
        <View style={{ margin: 8, paddingTop: 16 }}>
          <Text style={styles.optionTitle}>
            本アプリで購入した{NAME}
            は、1日のAI利用制限を超えて使用できます。また、広告が表示されないため、結果を確認までの時間が短くなります。
          </Text>
          <Text style={styles.optionWarning}>
            注意：1月で利用できなかった{NAME}
            は翌月に繰り越せません。また、消費時は動画広告はでませんが、解析には多少の時間がかかります。
          </Text>
        </View>
      )}
      {subscriptionPointPacks.map((pack) => (
        <View key={pack.id} style={styles.optionItem}>
          <View style={styles.bonusContainer}>
            <IconAtom
              name="coins"
              type="font-awesome-5"
              size={26}
              style={{ ...styles.bonusIcon, color: "#FFD700" }}
            />
            <Text style={styles.optionText}>
              {pack.points}
              {NAME}/月
            </Text>
          </View>
          <TouchableOpacity
            style={styles.priceSubscriptionButton}
            onPress={() => console.log("Purchase", pack.id)}
          >
            <Text style={styles.priceText}>¥{pack.price}/月</Text>
          </TouchableOpacity>
          {pack.bonusPoints && (
            <Text style={styles.bonusText}>
              ボーナス: {pack.bonusPoints}
              {NAME}
            </Text>
          )}
        </View>
      ))}
      <View style={styles.linkContainer}>
        <TouchableOpacity
          onPress={() =>
            openURL("https://kuwank.hatenablog.com/entry/2024/06/03/141839")
          }
        >
          <Text style={styles.linkText}>利用規約　</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            openURL("https://kuwank.hatenablog.com/entry/2024/06/03/141528")
          }
        >
          <Text style={styles.linkText}>　プライバシーポリシー</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    padding: 10,
  },
  optionTitle: {
    fontSize: 14,
    color: "black", // 文字色を白に設定
  },
  optionWarning: {
    fontSize: 12,
    color: "red", // 文字色を白に設定
  },
  optionItem: {
    flexDirection: "row", // アイテムを横に並べる
    justifyContent: "space-between", // 要素間のスペースを均等に配置
    alignItems: "center", // 要素を中央揃えにする
    backgroundColor: "white",
    padding: 20,
    paddingLeft: 10,
    height: 80, // カードの高さを統一
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bonusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bonusIcon: {
    marginRight: 0,
    color: "#FFD700", // 金色の背景
  },
  priceButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FFD700", // 金色の背景
    borderRadius: 10,
    width: 96,
  },
  priceSubscriptionButton: {
    paddingVertical: 10,
    backgroundColor: "#FFD700", // 金色の背景
    paddingHorizontal: 20,
    borderRadius: 10,
    width: 116,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black", // 文字色を白に設定
  },
  bonusText: {
    fontSize: 14,
    color: "#555",
    position: "absolute", // ボーナステキストを絶対位置に配置
    bottom: 10, // 下から10の位置に
    left: 20, // 左から20の位置に
  },
  linkContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "center", // 要素間のスペースを均等に配置
    alignItems: "center",
  },
  linkText: {
    color: "#007AFF", // iOSブルー
    fontSize: 16,
  },
});

export default PurchaseOptions;
