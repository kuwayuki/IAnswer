import AsyncStorage from "@react-native-async-storage/async-storage";

export const KEY = {
  AI_TYPE: "AI_TYPE",
  INITIAL_READ: "INITIAL_READ",
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
