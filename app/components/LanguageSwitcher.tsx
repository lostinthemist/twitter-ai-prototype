"use client";

import { useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const router = useRouter();

  const changeLanguage = (locale: string) => {
    router.push(`/${locale}`);
  };

  return (
    <div>
      <button onClick={() => changeLanguage("en-US")}>English</button>
      <button onClick={() => changeLanguage("ko")}>한국어</button>
    </div>
  );
}