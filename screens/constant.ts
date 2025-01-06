import { ReactNode } from "react";
import IconAtom from "./IconAtom";
import { IconProps } from "react-native-elements";
import { i18n } from "./locales/i18n";

export const MAX_LIMIT = {
  ADMOB: 5,
};

export const BANNER_UNIT_ID = {
  INTERSTIAL: "ca-app-pub-2103807205659646/7025650068",
  INTERSTIAL_MOVIE: "ca-app-pub-2103807205659646/1735973989",
  // INTERSTIAL_2: "ca-app-pub-2103807205659646/2139213606",
  // INTERSTIAL_3: "ca-app-pub-2103807205659646/4180737796",
  BANNER: "ca-app-pub-2103807205659646/3853773383",
  BANNER_2: "ca-app-pub-2103807205659646/3715270066",
  BANNER_3: "ca-app-pub-2103807205659646/6582188129",
  BANNER_4: "ca-app-pub-2103807205659646/1549353293",
  BANNER_5: "ca-app-pub-2103807205659646/5269106455",
  BANNER_6: "ca-app-pub-2103807205659646/2402188395",
  BANNER_7: "ca-app-pub-2103807205659646/3136685568",
  BANNER_8: "ca-app-pub-2103807205659646/1823603890",
  BANNER_9: "ca-app-pub-2103807205659646/9236271621",
  APP_OPEN_1: "ca-app-pub-2103807205659646/1199351237",
  REWARD_INTERSTIAL_1: "ca-app-pub-2103807205659646/6244310618",
};

export type PROMPT_TEMPLATE = {
  No: number;
  Title: string;
  PromptUser?: string;
  PromptSystem?: string;
  AppName: string;
  Explane?: string;
  ShortExplane?: string;
  Icon?: () => JSX.Element;
};

const PROPMT_SYSTEM = i18n.t("propmpt_system");

const CustomPromptUser = (
  name: string,
  result: string,
  title?: string,
  body?: string,
  answer?: string,
  explanation?: string
) => {
  return i18n.t("custom_prompt_user", {
    name: name,
    result: result ? result : "null",
    title: title ? title : "null",
    body: body ? body : "null",
    answer: answer ? answer : "null",
    explanation: explanation ? explanation : "null",
  });
};
const COMMON_ICON_PROPS = {
  style: {
    backgroundColor: "rgba(255, 255, 255, 0)",
    margin: 1,
    padding: 0,
  },
  containerStyle: {
    backgroundColor: "rgba(255, 255, 255, 0)",
    margin: 1,
    padding: 0,
  },
  iconStyle: {
    backgroundColor: "rgba(255, 255, 255, 0)",
    maxWidth: 22,
    margin: 1,
    padding: 0,
  },
} as IconProps;

const DETAIL_OR_EASY = i18n.t("detail_or_easy");
export const PROMPT_TEMPLATES = {
  ALL: {
    No: 0,
    AppName: "IAnswer",
    Title: i18n.t("all"),
  } as PROMPT_TEMPLATE,
  TEST: {
    No: 1,
    AppName: "IAnswerTest",
    Title: i18n.t("test_answer_mode"),
    Icon: () =>
      IconAtom({
        ...COMMON_ICON_PROPS,
        name: "book-open-variant",
        type: "material-community",
      } as IconProps),
    Explane: i18n.t("explane.test"),
    ShortExplane: i18n.t("short_explane.test"),
    PromptUser: i18n.t("prompt_user_descriptions.test", {
      detail_or_easy: DETAIL_OR_EASY,
    }),
  } as PROMPT_TEMPLATE,
  TRANSLATE: {
    No: 2,
    AppName: "IAnswerTranslate",
    Title: i18n.t("translate_mode"),
    Icon: () =>
      IconAtom({
        ...COMMON_ICON_PROPS,
        name: "google-translate",
        type: "material-community",
      } as IconProps),
    Explane: i18n.t("explane.translate"),
    ShortExplane: i18n.t("short_explane.translate"),
    PromptUser: i18n.t("prompt_user_descriptions.translate", {
      detail_or_easy: DETAIL_OR_EASY,
    }),
  } as PROMPT_TEMPLATE,
  FASSION: {
    No: 3,
    AppName: "IAnswerFassion",
    Title: i18n.t("fashion_check_mode"),
    Icon: () =>
      IconAtom({
        ...COMMON_ICON_PROPS,
        name: "tshirt-v",
        type: "material-community",
      } as IconProps),
    Explane: i18n.t("explane.fashion"),
    ShortExplane: i18n.t("short_explane.fashion"),
    PromptUser: i18n.t("prompt_user_descriptions.fashion", {
      detail_or_easy: DETAIL_OR_EASY,
    }),
  } as PROMPT_TEMPLATE,
  RECEPI: {
    No: 4,
    AppName: "IAnswerRecepi",
    Title: i18n.t("recipe_mode"),
    Icon: () =>
      IconAtom({
        ...COMMON_ICON_PROPS,
        name: "silverware-fork-knife",
        type: "material-community",
      } as IconProps),
    Explane: i18n.t("explane.recipe"),
    ShortExplane: i18n.t("short_explane.recipe"),
    PromptUser: i18n.t("prompt_user_descriptions.recipe", {
      detail_or_easy: DETAIL_OR_EASY,
    }),
  } as PROMPT_TEMPLATE,
  CALORY: {
    No: 5,
    AppName: "IAnswerCalory",
    Title: i18n.t("calory_mode"),
    Icon: () =>
      IconAtom({
        ...COMMON_ICON_PROPS,
        name: "scale",
        type: "material-community",
      } as IconProps),
    Explane: i18n.t("explane.calory"),
    ShortExplane: i18n.t("short_explane.calory"),
    PromptUser: i18n.t("prompt_user_descriptions.calory", {
      detail_or_easy: DETAIL_OR_EASY,
    }),
  } as PROMPT_TEMPLATE,
  TRASH: {
    No: 6,
    AppName: "IAnswerTrash",
    Title: i18n.t("trash_separation_mode"),
    Icon: () =>
      IconAtom({
        ...COMMON_ICON_PROPS,
        name: "trash-can",
        type: "material-community",
      } as IconProps),
    Explane: i18n.t("explane.trash"),
    ShortExplane: i18n.t("short_explane.trash"),
    PromptUser: i18n.t("prompt_user_descriptions.trash", {
      detail_or_easy: DETAIL_OR_EASY,
    }),
  } as PROMPT_TEMPLATE,
  PLANTS: {
    No: 7,
    AppName: "IAnswerPlants",
    Title: i18n.t("plant_care_mode"),
    Icon: () =>
      IconAtom({
        ...COMMON_ICON_PROPS,
        name: "flower-tulip",
        type: "material-community",
      } as IconProps),
    Explane: i18n.t("explane.plants"),
    ShortExplane: i18n.t("short_explane.plants"),
    PromptUser: i18n.t("prompt_user_descriptions.plants", {
      detail_or_easy: DETAIL_OR_EASY,
    }),
  } as PROMPT_TEMPLATE,
  FACE_REVIEW: {
    No: 8,
    AppName: "IAnswerFace",
    Title: i18n.t("face_diagnosis_mode"),
    Icon: () =>
      IconAtom({
        ...COMMON_ICON_PROPS,
        name: "face-retouching-natural",
        type: "material",
      } as IconProps),
    Explane: i18n.t("explane.face_review"),
    ShortExplane: i18n.t("short_explane.face_review"),
    PromptUser: i18n.t("prompt_user_descriptions.face_review", {
      detail_or_easy: DETAIL_OR_EASY,
    }),
  } as PROMPT_TEMPLATE,
  HAIR_REVIEW: {
    No: 9,
    AppName: "IAnswerHair",
    Title: i18n.t("hair_diagnosis_mode"),
    Icon: () =>
      IconAtom({
        ...COMMON_ICON_PROPS,
        name: "face-man-profile",
        type: "material-community",
      } as IconProps),
    Explane: i18n.t("explane.hair_review"),
    ShortExplane: i18n.t("short_explane.hair_review"),
    PromptUser: i18n.t("prompt_user_descriptions.hair_review", {
      detail_or_easy: DETAIL_OR_EASY,
    }),
  } as PROMPT_TEMPLATE,
  MAKE_REVIEW: {
    No: 10,
    AppName: "IAnswerFace",
    Title: i18n.t("makeup_diagnosis_mode"),
    Icon: () =>
      IconAtom({
        ...COMMON_ICON_PROPS,
        name: "face-woman-outline",
        type: "material-community",
      } as IconProps),
    Explane: i18n.t("explane.makeup_review"),
    ShortExplane: i18n.t("short_explane.makeup_review"),
    PromptUser: i18n.t("prompt_user_descriptions.makeup_review", {
      detail_or_easy: DETAIL_OR_EASY,
    }),
  } as PROMPT_TEMPLATE,
};
