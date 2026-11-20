"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { drawFortune, toKanjiNumber, type Fortune } from "./fortunes";

type Phase = "idle" | "shaking" | "stick" | "result";

const STORAGE_KEY = "omikuji:last";

type Saved = { date: string; fortune: Fortune };

const SAVED_EVENT = "omikuji:saved";

const today = () => new Date().toLocaleDateString("ja-JP");

function subscribe(cb: () => void) {
  window.addEventListener(SAVED_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(SAVED_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function readSaved(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    // 保存領域が使えなくても動作は継続
    return null;
  }
}

export default function Omikuji() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const savedRaw = useSyncExternalStore(subscribe, readSaved, () => null);
  const lastToday = useMemo(() => {
    if (!savedRaw) return null;
    try {
      const saved: Saved = JSON.parse(savedRaw);
      return saved.date === today() ? saved.fortune : null;
    } catch {
      return null;
    }
  }, [savedRaw]);

  const draw = () => {
    const f = drawFortune();
    setFortune(f);
    setPhase("shaking");
    setTimeout(() => setPhase("stick"), 1400);
    setTimeout(() => setPhase("result"), 2800);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today(), fortune: f }));
      window.dispatchEvent(new Event(SAVED_EVENT));
    } catch {}
  };

  const reset = () => {
    setPhase("idle");
    setFortune(null);
  };

  if (phase === "result" && fortune) {
    return <ResultPaper fortune={fortune} onAgain={reset} />;
  }

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="relative mt-20 h-72 w-40">
        {/* 飛び出す棒 */}
        <div
          className={`absolute left-1/2 top-6 -translate-x-1/2 w-5 rounded-sm bg-[#f3e2bf] border border-[#c9a96a] shadow
            flex items-start justify-center pt-2 text-xs font-bold text-[#8b1a1a] [writing-mode:vertical-rl]
            transition-all duration-700 ease-out
            ${phase === "stick" ? "h-44 -translate-y-24 opacity-100" : "h-24 translate-y-0 opacity-0"}`}
        >
          {fortune && phase === "stick" ? `${toKanjiNumber(fortune.number)}番` : ""}
        </div>
        {/* おみくじ筒 */}
        <div
          className={`absolute bottom-0 left-0 h-60 w-40 rounded-b-xl rounded-t-md
            bg-gradient-to-b from-[#b3261e] to-[#7d1712] border-4 border-[#5a0f0b] shadow-xl
            flex items-center justify-center ${phase === "shaking" ? "animate-shake" : ""}`}
        >
          <div className="h-44 w-24 bg-[#fbf6ea] border-2 border-[#c9a96a] flex items-center justify-center">
            <span className="[writing-mode:vertical-rl] text-4xl font-bold tracking-[0.4em] text-[#2a1a12]">
              御神籤
            </span>
          </div>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-4 w-6 rounded-full bg-[#2a1a12]" />
        </div>
      </div>

      <button
        onClick={draw}
        disabled={phase !== "idle"}
        className="rounded-full bg-[#b3261e] px-10 py-4 text-xl font-bold tracking-widest text-[#fbf6ea]
          shadow-lg transition hover:bg-[#9a1f18] active:scale-95 disabled:opacity-50 disabled:cursor-wait"
      >
        {phase === "idle" ? "おみくじを引く" : phase === "shaking" ? "シャカシャカ…" : "出ました！"}
      </button>

      {phase === "idle" && lastToday && (
        <p className="text-sm text-[#6b5444]">
          本日引いたおみくじ：<span className="font-bold text-[#b3261e]">{lastToday.rank}</span>
        </p>
      )}
    </div>
  );
}

function ResultPaper({ fortune, onAgain }: { fortune: Fortune; onAgain: () => void }) {
  const isBad = fortune.rank === "凶";
  return (
    <div className="flex w-full flex-col items-center gap-8 animate-unfold">
      <article className="w-full max-w-md bg-[#fbf6ea] border-[6px] border-double border-[#b3261e] shadow-2xl px-6 py-8 sm:px-10">
        <p className="text-center text-sm tracking-[0.5em] text-[#6b5444]">
          第{toKanjiNumber(fortune.number)}番
        </p>
        <h2
          className={`my-4 text-center text-7xl font-bold tracking-widest ${
            isBad ? "text-[#2a1a12]" : "text-[#b3261e]"
          }`}
        >
          {fortune.rank}
        </h2>
        <p className="border-y border-[#c9a96a] py-4 text-center leading-8 text-[#2a1a12]">
          {fortune.message}
        </p>
        <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          {fortune.items.map((it) => (
            <div key={it.label} className="flex gap-3 border-b border-dotted border-[#c9a96a] pb-2">
              <dt className="shrink-0 font-bold text-[#b3261e]">{it.label}</dt>
              <dd className="text-[#2a1a12]">{it.text}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex justify-center gap-6 text-sm text-[#6b5444]">
          <span>ラッキーカラー：<b className="text-[#2a1a12]">{fortune.luckyColor}</b></span>
          <span>ラッキーアイテム：<b className="text-[#2a1a12]">{fortune.luckyItem}</b></span>
        </div>
        {isBad && (
          <p className="mt-6 text-center text-xs text-[#6b5444]">
            ※ 凶のおみくじは境内の木に結んで、災いを留めてもらいましょう
          </p>
        )}
      </article>
      <button
        onClick={onAgain}
        className="rounded-full border-2 border-[#b3261e] px-8 py-3 font-bold tracking-widest text-[#b3261e] transition hover:bg-[#b3261e] hover:text-[#fbf6ea]"
      >
        もう一度引く
      </button>
    </div>
  );
}
