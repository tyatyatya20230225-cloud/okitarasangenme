export type Rank = "大吉" | "中吉" | "小吉" | "吉" | "末吉" | "凶";

export type Fortune = {
  rank: Rank;
  number: number;
  message: string;
  items: { label: string; text: string }[];
  luckyColor: string;
  luckyItem: string;
};

// 出やすさ（重み）
const RANK_WEIGHTS: { rank: Rank; weight: number }[] = [
  { rank: "大吉", weight: 16 },
  { rank: "中吉", weight: 20 },
  { rank: "小吉", weight: 20 },
  { rank: "吉", weight: 22 },
  { rank: "末吉", weight: 14 },
  { rank: "凶", weight: 8 },
];

const MESSAGES: Record<Rank, string[]> = {
  大吉: [
    "天高く道ひらけ、思うことみな叶う時。驕らず感謝を忘れずに。",
    "朝日の昇るがごとく運気盛ん。迷わず一歩を踏み出せ。",
  ],
  中吉: [
    "春の風に花ほころぶ。焦らず進めば実りは大きい。",
    "積み重ねた努力が形となる兆し。周りの声にも耳を傾けよ。",
  ],
  小吉: [
    "小さな幸せが日々を照らす。足元の喜びを大切に。",
    "細き流れもやがて川となる。こつこつと続けるべし。",
  ],
  吉: [
    "穏やかな日和なり。平常心でいれば良きこと訪れる。",
    "縁を大切にすれば道は自ずとひらける。",
  ],
  末吉: [
    "今は種まきの時。後になるほど運は開ける。",
    "雲間に光差す。辛抱の先に良き知らせあり。",
  ],
  凶: [
    "嵐の後には晴れ間あり。慎重に過ごせば災い転じて福となる。",
    "今は動かず力を蓄えるべし。凶は吉に転じる始まりなり。",
  ],
};

const ITEMS: Record<string, Record<"good" | "mid" | "bad", string[]>> = {
  願望: {
    good: ["思いのまま叶う", "望み通りになる"],
    mid: ["時間はかかるが叶う", "人の助けで叶う"],
    bad: ["今は控えめに", "焦れば遠のく"],
  },
  待人: {
    good: ["来る 喜びあり", "便りあり すぐ来る"],
    mid: ["遅れるが来る", "音信あり"],
    bad: ["来ず 待つべし", "遅し"],
  },
  失物: {
    good: ["すぐ見つかる", "身近にあり"],
    mid: ["時を経て出る", "高い所を探せ"],
    bad: ["出にくし", "諦めも肝心"],
  },
  旅行: {
    good: ["良し 得るものあり", "西の方角が吉"],
    mid: ["近場なら良し", "連れと行け"],
    bad: ["控えよ", "忘れ物に注意"],
  },
  商売: {
    good: ["利益大いにあり", "広げて良し"],
    mid: ["堅実にすれば利あり", "焦らず待て"],
    bad: ["損あり 慎め", "欲張るな"],
  },
  学問: {
    good: ["実力を発揮できる", "安心して励め"],
    mid: ["努力次第で伸びる", "基礎を固めよ"],
    bad: ["油断禁物", "怠れば危うし"],
  },
  恋愛: {
    good: ["想いは通じる", "良縁あり"],
    mid: ["誠実さが鍵", "ゆっくり育め"],
    bad: ["今は自分を磨け", "急ぐと実らず"],
  },
  健康: {
    good: ["すこぶる良し", "活力みなぎる"],
    mid: ["休息を取れば良し", "食に気を配れ"],
    bad: ["無理は禁物", "早寝を心がけよ"],
  },
};

const COLORS = ["朱色", "藍色", "若草色", "山吹色", "桜色", "白", "紫", "金色"];
const LUCKY_ITEMS = ["お茶", "手鏡", "ハンカチ", "鈴", "本", "傘", "和菓子", "手帳"];

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

function pickRank(): Rank {
  const total = RANK_WEIGHTS.reduce((s, r) => s + r.weight, 0);
  let n = Math.random() * total;
  for (const r of RANK_WEIGHTS) {
    n -= r.weight;
    if (n < 0) return r.rank;
  }
  return "吉";
}

function tierFor(rank: Rank): ("good" | "mid" | "bad")[] {
  // ランクに応じて各項目の良し悪しの出方を変える
  switch (rank) {
    case "大吉":
      return ["good", "good", "good", "mid"];
    case "中吉":
      return ["good", "good", "mid", "mid"];
    case "小吉":
    case "吉":
      return ["good", "mid", "mid", "bad"];
    case "末吉":
      return ["mid", "mid", "bad", "good"];
    case "凶":
      return ["bad", "bad", "mid", "mid"];
  }
}

export function drawFortune(): Fortune {
  const rank = pickRank();
  const tiers = tierFor(rank);
  return {
    rank,
    number: Math.floor(Math.random() * 100) + 1,
    message: pick(MESSAGES[rank]),
    items: Object.entries(ITEMS).map(([label, t]) => ({
      label,
      text: pick(t[pick(tiers)]),
    })),
    luckyColor: pick(COLORS),
    luckyItem: pick(LUCKY_ITEMS),
  };
}

const KANJI_DIGITS = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

export function toKanjiNumber(n: number): string {
  if (n === 100) return "百";
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return (
    (tens > 1 ? KANJI_DIGITS[tens] : "") +
    (tens > 0 ? "十" : "") +
    (ones > 0 || tens === 0 ? KANJI_DIGITS[ones] : "")
  );
}
