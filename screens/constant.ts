export const BANNER_UNIT_ID = {
  INTERSTIAL: "ca-app-pub-2103807205659646/7025650068",
  // INTERSTIAL_2: "ca-app-pub-2103807205659646/2139213606",
  // INTERSTIAL_3: "ca-app-pub-2103807205659646/4180737796",
  BANNER: "ca-app-pub-2103807205659646/3853773383",
  APP_OPEN_1: "ca-app-pub-2103807205659646/1199351237",
};

export type PROMPT_TEMPLATE = {
  No: number;
  PromptUser?: string;
  PromptSystem?: string;
  AppName: string;
  Explane?: string;
};

const PROPMT_SYSTEM =
  "必ず配列のみ返却してください。構成は{No: 1, title: '問１', body: '1 + 1', answer: '2', explanation: '1 + 1 = 2 です。', result: true}のJson形式でお願いします。";

const CustomPromptUser = (
  name: string,
  title?: string,
  body?: string,
  answer?: string,
  explanation?: string
) => {
  return `画像は${name}です。解析して、カロリーを返却してください。titleには「${
    title ? title : "null"
  }」、bodyには「${body ? body : "null"}」、answerには「${
    answer ? answer : "null"
  }」、explanationには「${
    explanation ? explanation : "null"
  }」、resultにはnullをお願いします。`;
};

export const PROMPT_TEMPLATES = {
  ALL: {
    No: 0,
    AppName: "IAnswer",
  } as PROMPT_TEMPLATE,
  TEST: {
    No: 1,
    AppName: "IAnswerTest",
    Explane:
      "問題用紙を撮影してください。解説・回答を行います。\r\n５教科の中学生程度までですが、数学などは読み取れない記号などが存在します。",
    PromptUser:
      "画像は問題用紙です。問題文を解析して、結果を返却してください。titleには問題のタイトル、bodyには問題文、answerには答え、explanationには問題の解き方、resultには合っているか否かをお願いします。答えが書いてない箇所は否にしてください。",
  } as PROMPT_TEMPLATE,
  TRANSLATE: {
    No: 2,
    AppName: "IAnswerTranslate",
    Explane:
      "外国語を撮影してください。\r\n翻訳を行います。AIの精度によるので必ずしも正解しているわけではありません。",
    PromptUser:
      "画像は外国語です。解析して、日本語にしてください。titleには「翻訳結果」、bodyには読み取った外国語、answerには翻訳結果、explanationにはnull、resultにはnullをお願いします。",
  } as PROMPT_TEMPLATE,
  FASSION: {
    No: 3,
    AppName: "IAnswerFassion",
    Explane:
      "コーディネートを撮影してください。\r\n各ファッションに関しての評価を行います。",
    PromptUser:
      "あなたはプロのファッションデザイナーです。全体的な服の組み合わせを考慮しつつファッションセンスを解析して、結果を返却してください。titleには服の種類（パンツ、靴など）、bodyには服の詳細の種類（サンダル、スニーカーなど）、answerには良い、悪いなどの概要評価、explanationには改善点、resultには合っているか否かをお願いします。最初の配列にはtitleには「総評」、bodyには点数（100点満点）、answerには良い、悪いなどの概要評価、explanationには全体的な改善点、resultにはnullでお願いします。",
  } as PROMPT_TEMPLATE,
  RECEPI: {
    No: 4,
    AppName: "IAnswerRecepi",
    Explane: "食材を撮影してください。\r\n食材からレシピを考案します。",
    PromptUser:
      "画像は食材です。一部または全てを利用してレシピを考案してください。titleには料理名、bodyには材料、answerには作り方、explanationには料理の説明、resultにはnullをお願いします。",
  } as PROMPT_TEMPLATE,
  CALORY: {
    No: 5,
    AppName: "IAnswerCalory",
    Explane:
      "料理を撮影してください。\r\nカロリーを計算します。距離や大きさが把握できない可能性があるため、必ずしも正解しているわけではありません。",
    PromptUser:
      "画像は料理または食材です。解析して、カロリーを返却してください。titleには「総カロリー数」、bodyにはnull、answerにはカロリー数、explanationにはカロリーの説明、resultにはnullをお願いします。",
  } as PROMPT_TEMPLATE,
  TRASH: {
    No: 6,
    AppName: "IAnswerTrash",
    Explane:
      "ゴミを撮影してください。\r\nゴミの分別を行います。ゴミの収集日に関しては自治体のルールに則ってください。",
    PromptUser:
      "画像はゴミです。解析して、ごみの種類を返却してください。titleには名称、bodyにはnull、answerにはごみの種類、explanationには説明、resultにはnullをお願いします。",
  } as PROMPT_TEMPLATE,
  PLANTS: {
    No: 7,
    AppName: "IAnswerPlants",
    Explane: "植物を撮影してください。\r\n植物の状態を評価します。",
    PromptUser:
      "画像は植物です。解析して、状態を確認してください。titleには植物名称、bodyには良し悪しの概要、answerには状態の詳細、explanationにはケアの方法、resultにはnullをお願いします。",
  } as PROMPT_TEMPLATE,
};
