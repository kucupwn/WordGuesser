import { useState } from "react";
import { LanguageSelect } from "./components/LanguageSelect";
import { Game } from "./components/Game";

export type Languages = null | "russian" | "spanish";

export function App() {
  const [language, setLanguage] = useState<Languages>(null);

  return (
    <>
      {language === null ? (
        <LanguageSelect setLanguage={setLanguage} />
      ) : (
        <Game language={language} />
      )}
    </>
  );
}
