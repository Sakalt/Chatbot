const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");
const BOT_IMG = "bot.png";
const PERSON_IMG = "user.png";
const BOT_NAME = "ボット";
const PERSON_NAME = "ユーザー";

const prompts = [
  ["こんにちは", "やあ", "おはよう", "こんばんは"],
  ["元気ですか", "調子はどうですか"],
  ["何をしているの", "どうしたの", "何かあったの"],
  ["あなたは何歳ですか"],
  ["あなたは誰ですか", "人間ですか", "ボットですか"],
  ["誰があなたを作ったの", "誰が作りましたか"],
  ["名前は何ですか", "あなたの名前は", "名前を教えてください"],
  ["愛してます", "好きだよ"],
  ["楽しい", "良い", "素晴らしい", "最高", "クール"],
  ["悪い", "つまらない", "疲れた"],
  ["助けて", "話をして", "ジョークを言って"],
  ["ああ", "はい", "わかりました", "いいえ"],
  ["さようなら", "バイバイ", "またね"],
  ["今日は何を食べればいいですか"],
  ["兄弟", "友達"],
  ["何", "なぜ", "どう", "どこ", "いつ"],
  ["いいえ", "わからない", "多分", "いいえ、ありがとう"],
  ["ハハ", "ハ", "笑", "おもしろい", "ジョーク"],
  ["最近のニュースはどうですか", "何か面白いことがあった？"],
  ["趣味は何ですか", "好きなことは？"],
  ["好きな映画は？", "おすすめの映画はある？"],
  ["旅行は好きですか？", "どこに行きたいですか？"],
  ["好きな音楽のジャンルは？", "最近聴いている曲は？"]
];

const replies = [
  ["こんにちは！", "やあ！", "おはよう！"],
  ["元気です...あなたは？", "まあまあです、あなたはどうですか？"],
  ["特に何も", "もうすぐ寝るところ"],
  ["私は無限です"],
  ["私はただのボットです。あなたは？"],
  ["私を作ったのは、JavaScriptです"],
  ["私は名前がありません"],
  ["私も愛してる", "私もだよ"],
  ["悪い気分になったことはありますか？"],
  ["それを聞いて嬉しいです"],
  ["何についてですか？", "昔々..."],
  ["物語を教えて", "ジョークを言って"],
  ["さようなら", "バイバイ"],
  ["寿司やピザはどう？", "美味しいものを選んで！"],
  ["兄弟！", "友達！"],
  ["良い質問", "それは興味深いですね"],
  ["それについてはわからない", "再試行してみて！"],
  ["ハハ！", "いいね！"],
  ["最近は忙しかったよ", "新しいことを学んでる！"],
  ["趣味はプログラミングかな", "読書も好きだよ"],
  ["好きな映画は『インセプション』です", "おすすめは『スタジオジブリ』の作品だよ"],
  ["旅行は好きです！海に行きたい", "ヨーロッパを訪れたいな"],
  ["好きな音楽はロックかな", "最近はジャズを聴いているよ"]
];

const alternative = [
  "同じです", "続けて...", "わかりません :/"
];

const brain = new brain.NeuralNetwork();

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
brain.train(trainingData);

msgerForm.addEventListener("submit", event => {
  event.preventDefault();
  const msgText = msgerInput.value.trim();
  if (!msgText) {
    displayError("メッセージを入力してください。");
    return;
  }
  msgerInput.value = "";
  addChat(PERSON_NAME, PERSON_IMG, "right", msgText);
  output(msgText);
});

function displayError(message) {
  const errorMessageElement = get(".error-message");
  errorMessageElement.textContent = message;
  errorMessageElement.style.display = "block";

  // エラーを数秒後に非表示にする
  setTimeout(() => {
    errorMessageElement.style.display = "none";
  }, 3000);
}

function output(input) {
  let product;
  let text = input.toLowerCase().replace(/[^\w\s]/gi, "").replace(/[\d]/gi, "").trim();

  // Brain.jsを使って応答を生成
  const outputResponse = brain.run({ [text]: 1 });
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
