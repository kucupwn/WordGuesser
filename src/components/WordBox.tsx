import styled from "styled-components";
import type { GameLanguage, HiddenLanguage, VocabularyItem } from "./Game";
import { type Dispatch, type SetStateAction, useEffect } from "react";

interface Props {
  language: GameLanguage;
  history: VocabularyItem[];
  currentIndex: number;
  hidden: HiddenLanguage;
  setHidden: Dispatch<SetStateAction<HiddenLanguage>>;
  guessed: boolean;
  setGuessed: Dispatch<SetStateAction<boolean>>;
}

const Box = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 5px;
  width: 400px;
  height: 100px;
  background-color: var(--button-color);
  border: 2px solid var(--border-color);
  border-radius: 20px;
  font-size: 2rem;
  cursor: pointer;
`;

export function WordBox({
  language,
  history,
  currentIndex,
  hidden,
  setHidden,
  guessed,
  setGuessed,
}: Props) {
  function hideWord(language: HiddenLanguage) {
    hidden === language ? setHidden(null) : setHidden(language);
    setGuessed(false);
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        hideWord("foreign");
      } else if (event.key === "ArrowDown") {
        hideWord("english");
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [hideWord]);

  return (
    <>
      <Box onClick={() => hideWord("foreign")}>
        {hidden === "foreign" ? (
          guessed ? (
            <p>{history[currentIndex][language]}</p>
          ) : null
        ) : (
          <p>{history[currentIndex][language]}</p>
        )}
      </Box>
      <Box onClick={() => hideWord("english")}>
        {hidden === "english" ? (
          guessed ? (
            <p>{history[currentIndex].english}</p>
          ) : null
        ) : (
          <p>{history[currentIndex].english}</p>
        )}
      </Box>
    </>
  );
}
