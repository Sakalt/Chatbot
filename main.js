const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");
const BOT_IMG = "bot.png";
const PERSON_IMG = "user.png";
const BOT_NAME = "BOT";
const PERSON_NAME = "ももんが";

const prompts = [
  ["こんにちは", "やあ", "おはよう", "こんばんは"],
  ["元気ですか", "調子はどうですか"],
  ["何をしているの", "どうしたの", "何かあったの"],
  ["あなたは何歳ですか"],
  ["あなたは誰ですか", "人間ですか", "ボットですか", "あなたは人間かボットか"],
  ["誰があなたを作ったの", "誰が作りましたか"],
  [
    "名前は何ですか",
    "あなたの名前は",
    "名前を教えてください",
    "あなたの名前は何ですか",
    "自分をどう呼びますか"
  ],
  ["愛してます"],
  ["楽しい", "良い", "素晴らしい", "最高", "クール"],
  ["悪い", "つまらない", "疲れた"],
  ["助けて", "話をして", "ジョークを言って"],
  ["ああ", "はい", "わかりました", "いいえ"],
  ["さようなら", "バイバイ", "またね"],
  ["今日は何を食べればいいですか"],
  ["兄弟"],
  ["何", "なぜ", "どう", "どこ", "いつ"],
  ["いいえ", "わからない", "多分", "いいえ、ありがとう"],
  [""],
  ["ハハ", "ハ", "笑", "おもしろい", "ジョーク"]
];

const replies = [
  ["こんにちは！", "やあ！", "おはよう！", "やあ、元気？", "どうも"],
  [
    "元気です...あなたは？",
    "まあまあです、あなたはどうですか？",
    "素晴らしいです、あなたは？"
  ],
  [
    "特に何も",
    "もうすぐ寝るところ",
    "何か当ててみて",
    "実はわからない"
  ],
  ["私は無限です"],
  ["私はただのボットです。あなたは？"],
  ["私を作ったのは、JavaScriptです"],
  ["私は名前がありません", "名前は持っていません"],
  ["私も愛してる", "私もだよ"],
  ["悪い気分になったことはありますか？", "それを聞いて嬉しいです"],
  ["なぜ？", "それは良くない！", "テレビを見てみて"],
  ["何についてですか？", "昔々..."],
  ["物語を教えて", "ジョークを言って", "自己紹介して"],
  ["さようなら", "バイバイ", "またね"],
  ["寿司", "ピザ"],
  ["兄弟！"],
  ["良い質問"],
  ["大丈夫です", "理解しています", "何を話したいですか？"],
  ["何か言ってください :("],
  ["ハハ！", "いいね！"]
];

// Brain.jsのセットアップ
const brain = require('brain.js');
const net = new brain.NeuralNetwork();

// トレーニングデータの生成
const trainingData = [];

// プロンプトとリプライをトレーニングデータに変換
for (let i = 0; i < prompts.length; i++) {
  for (let j = 0; j < prompts[i].length; j++) {
    trainingData.push({
      input: { [prompts[i][j]]: 1 },
      output: { [replies[i][Math.floor(Math.random() * replies[i].length)]]: 1 }
    });
  }
}

// ネットワークをトレーニング
net.train(trainingData);

msgerForm.addEventListener("submit", event => {
  event.preventDefault();
  const msgText = msgerInput.value;
  if (!msgText) return;
  msgerInput.value = "";
  addChat(PERSON_NAME, PERSON_IMG, "right", msgText);
  output(msgText);
});

function output(input) {
  let product;
  let text = input.toLowerCase().replace(/[^\w\s]/gi, "").replace(/[\d]/gi, "").trim();
  text = text
    .replace(/ a /g, " ")  
    .replace(/私の気分は/g, "")
    .replace(/何/g, "何ですか")
    .replace(/お願いします/g, "")
    .replace(/お願いします/g, "")
    .replace(/あなたは/g, "あなたは");

  // Brain.jsを使って応答を生成
  const outputResponse = net.run({ [text]: 1 });
  product = Object.keys(outputResponse).reduce((a, b) => outputResponse[a] > outputResponse[b] ? a : b);

  if (!product) {
    product = alternative[Math.floor(Math.random() * alternative.length)];
  }

  const delay = input.split(" ").length * 100;
  setTimeout(() => {
    addChat(BOT_NAME, BOT_IMG, "left", product);
  }, delay);
}

function addChat(name, img, side, text) {
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>
      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>
        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;
  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();
  return `${h.slice(-2)}:${m.slice(-2)}`;
}
