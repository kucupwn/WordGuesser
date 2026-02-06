import { useState } from "react";
import { LanguageSelect } from "./components/LanguageSelect";
import { Game } from "./components/Game";

export type Languages = "" | "russian" | "spanish";

export function App() {
  const [language, setLanguage] = useState<Languages>("");

  return (
    <>
      {language === "" ? (
        <LanguageSelect setLanguage={setLanguage} />
      ) : (
        <Game language={language} />
      )}
    </>
  );
}
