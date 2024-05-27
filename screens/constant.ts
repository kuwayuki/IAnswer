export const BANNER_UNIT_ID = {
  INTERSTIAL: "ca-app-pub-2103807205659646/7025650068",
  // INTERSTIAL_2: "ca-app-pub-2103807205659646/2139213606",
  // INTERSTIAL_3: "ca-app-pub-2103807205659646/4180737796",
  BANNER: "ca-app-pub-2103807205659646/3853773383",
  APP_OPEN_1: "ca-app-pub-2103807205659646/1199351237",
};

export type PROPMT_TEMPLATE = {
  No: number;
  PropmtUser?: string;
  PropmtSystem?: string;
  AppName: string;
  Explane?: string;
};

const PROPMT_SYSTEM =
  "必ず配列のみ返却してください。構成は{No: 1, title: '問１', body: '1 + 1', answer: '2', explanation: '1 + 1 = 2 です。', result: true}のJson形式でお願いします。";
export const PROPMT_TEMPLATES = {
  ALL: {
    No: 0,
    AppName: "IAnswer",
  } as PROPMT_TEMPLATE,
  TEST: {
    No: 1,
    AppName: "IAnswerTest",
    Explane:
      "問題用紙を撮影してください。解説・回答を行います。\r\n５教科の中学生程度までですが、AIの精度によるので必ずしも正解しているわけではありません。",
    PropmtUser:
      "画像は問題用紙です。問題文を解析して、結果を返却してください。titleには問題のタイトル、bodyには問題文、answerには答え、explanationには問題の解き方、resultには合っているか否かをお願いします。答えが書いてない箇所は否にしてください。",
  } as PROPMT_TEMPLATE,
  FASSION: {
    No: 2,
    AppName: "IAnswerFassion",
    Explane:
      "全身コーディネートを撮影してください。\r\n各ファッションの評価を行います。",
    PropmtUser:
      "あなたはプロのファッションデザイナーです。全体的な服の組み合わせを考慮しつつファッションセンスを解析して、結果を返却してください。titleには服の種類（パンツ、靴など）、bodyには服の詳細の種類（サンダル、スニーカーなど）、answerには良い、悪いなどの概要評価、explanationには改善点、resultには合っているか否かをお願いします。最初の配列にはtitleには「総評」、bodyには点数（100点満点）、answerには良い、悪いなどの概要評価、explanationには全体的な改善点、resultにはnullでお願いします。",
  } as PROPMT_TEMPLATE,
  RECEPI: {
    No: 3,
    AppName: "IAnswerRecepi",
    Explane: "食材を撮影してください。\r\nレシピを考案します。",
    PropmtUser:
      "画像は食材です。一部または全てを利用してレシピを考案してください。titleには料理名、bodyには材料、answerには作り方、explanationには料理の説明、resultにはnullをお願いします。",
  } as PROPMT_TEMPLATE,
  CALORY: {
    No: 4,
    AppName: "IAnswerCalory",
    Explane:
      "料理を撮影してください。\r\nカロリーを計算します。AIの精度によるので必ずしも正解しているわけではありません。",
    PropmtUser:
      "画像は料理または食材です。解析して、カロリーを返却してください。titleには「総カロリー数」、bodyにはnull、answerにはカロリー数、explanationにはカロリーの説明、resultにはnullをお願いします。",
  } as PROPMT_TEMPLATE,
  TRASH: {
    No: 5,
    AppName: "IAnswerTrash",
    Explane:
      "ゴミを撮影してください。\r\nゴミ分別を行います。AIの精度によるので必ずしも正解しているわけではありません。",
    PropmtUser:
      "画像はゴミです。解析して、ごみの種類を返却してください。titleには名称、bodyにはnull、answerにはごみの種類、explanationには説明、resultにはnullをお願いします。",
  } as PROPMT_TEMPLATE,
};
