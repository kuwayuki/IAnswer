import {
  InterstitialAd,
  AdEventType,
  MobileAds,
  TestIds,
} from "react-native-google-mobile-ads";
import { BANNER_UNIT_ID } from "./constant";
import { sleep } from "./utils";

export const getRandomId = (maxCount: number) => {
  const randomIndex = Math.floor(Math.random() * maxCount);
  return randomIndex;
};

function selectAdId() {
  const random = getRandomId(0);
  // const random = getRandomId(3);
  switch (random) {
    case 0:
      // return TestIds.INTERSTITIAL;
      return BANNER_UNIT_ID.INTERSTIAL;
    case 1:
      return BANNER_UNIT_ID.INTERSTIAL;
    case 2:
      return BANNER_UNIT_ID.INTERSTIAL;
  }
  // return TestIds.INTERSTITIAL;
  return BANNER_UNIT_ID.INTERSTIAL;
}

let interstitial: InterstitialAd | null = null;
let isAdmobing: boolean = false;

export function initializeInterstitialAd(setAdClosed: (is: boolean) => void) {
  // alert("initializeInterstitialAd");
  const id = selectAdId();
  interstitial = InterstitialAd.createForAdRequest(id);

  interstitial.load();
  // alert("load");

  // イベントリスナーの追加
  interstitial.addAdEventListener(AdEventType.LOADED, () => {
    console.log("Ad Loaded");
    // alert("Ad Loaded");
  });

  interstitial.addAdEventListener(AdEventType.CLOSED, () => {
    console.log("Ad Closed");
    setAdClosed(true);
    isAdmobing = true;
    // alert("Ad Closed");
    // 広告を再ロードする
    interstitial?.load();
  });

  interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
    console.error("Ad Load Error: ", error);
    // alert("Ad Load Error");
    interstitial?.load();
  });
}

export async function showInterstitialAd(setAdClosed: (is: boolean) => void) {
  if (interstitial?.loaded) {
    setAdClosed(false);
    isAdmobing = false;

    interstitial.show();
    const timeout = 60 * 1000; // 60 seconds
    const start = Date.now();

    while (true) {
      await sleep(1000);
      if (isAdmobing || Date.now() - start > timeout) break;
    }
  } else {
    // alert("Ad is not ready to be shown");
    console.error("Ad is not ready to be shown");
  }
}
