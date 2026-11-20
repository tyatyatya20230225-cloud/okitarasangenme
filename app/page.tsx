import Omikuji from "./omikuji/Omikuji";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-[#f4ecdc] px-4 py-12 font-serif">
      <header className="mb-10 text-center">
        <p className="text-sm tracking-[0.6em] text-[#6b5444]">今日の運勢を占う</p>
        <h1 className="mt-2 text-4xl font-bold tracking-[0.3em] text-[#2a1a12]">御神籤</h1>
      </header>
      <main className="flex w-full max-w-xl flex-1 flex-col items-center">
        <Omikuji />
      </main>
    </div>
  );
}
