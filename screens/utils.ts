import AsyncStorage from "@react-native-async-storage/async-storage";
import { MAX_LIMIT } from "./constant";

export const KEY = {
  AI_TYPE: "AI_TYPE",
  INITIAL_READ: "INITIAL_READ",
  LAST_EXECUTED_AD: "LAST_EXECUTED_AD",
  EXECUTED_COUNT: "EXECUTED_COUNT",
};
export const getLocalStorage = async (
  key: string
): Promise<string | undefined | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (err) {}
  return undefined;
};

export const saveLocalStorage = async (key: string, value: string | number) => {
  try {
    await AsyncStorage.setItem(
      key,
      typeof value === "string" ? value : String(value)
    );
  } catch (err) {
    console.error(err);
  }
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const checkOverMaxLimit = async (): Promise<boolean> => {
  const currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const storedDate = await getLocalStorage(KEY.LAST_EXECUTED_AD);
  const storedCount = await getLocalStorage(KEY.EXECUTED_COUNT);

  if (currentDate !== storedDate) {
    // 日付が変わっている場合、カウントをリセット
    await saveLocalStorage(KEY.LAST_EXECUTED_AD, currentDate);
    await saveLocalStorage(KEY.EXECUTED_COUNT, 1);
    return false;
  } else if (storedCount && parseInt(storedCount, 10) < MAX_LIMIT.ADMOB) {
    await saveLocalStorage(KEY.EXECUTED_COUNT, parseInt(storedCount, 10) + 1);
    return false;
  } else {
    // return false;
    // TODO: 後で治す
    alert("今日はこれ以上実行できません。");
    return true;
  }
};

export const returnMaxLimit = async (): Promise<void> => {
  const storedCount = await getLocalStorage(KEY.EXECUTED_COUNT);
  if (storedCount) {
    await saveLocalStorage(KEY.EXECUTED_COUNT, parseInt(storedCount, 10) - 1);
  }
};
