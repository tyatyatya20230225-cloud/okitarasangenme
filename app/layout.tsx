import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "御神籤 | おみくじ",
  description: "ボタンひとつで今日の運勢を占えるおみくじアプリ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
