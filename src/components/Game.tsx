import styled from "styled-components";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { russianVocabulary } from "../assets/russianWords";
import { spanishVocabulary } from "../assets/spanishWords";
import speaker from "../assets/speaker.png";
import next from "../assets/arrow-next.png";
import back from "../assets/arrow-back.png";
import { WordGuess } from "./WordGuess";
import type { Languages } from "../App";
import { WordBox } from "./WordBox";
import { dutchVocabulary } from "../assets/dutchWords";

export type GameLanguage = "russian" | "spanish" | "dutch";

export type VocabularyItem = {
  english: string;
  russian?: string;
  spanish?: string;
  dutch?: string;
};

export type HiddenLanguage = "foreign" | "english" | null;

interface Props {
  language: GameLanguage;
  setLanguage: Dispatch<SetStateAction<Languages>>;
}

const vocabularies: Record<GameLanguage, VocabularyItem[]> = {
  russian: russianVocabulary,
  spanish: spanishVocabulary,
  dutch: dutchVocabulary,
};

const defaultWord: VocabularyItem = {
  english: "English",
  russian: "Russian",
  spanish: "Spanish",
  dutch: "Dutch",
};

const speakLanguage = {
  russian: "ru-RU",
  spanish: "es-ES",
  dutch: "nl-NL",
};

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 2rem;
`;

const WordBoxContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
`;

const Speaker = styled.img`
  cursor: pointer;
  width: 42px;
  height: 42px;
`;

const StepContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 300px;
`;

const Next = styled.img`
  cursor: pointer;
  width: 42px;
  height: 42px;
`;

const Back = styled.img`
  cursor: pointer;
  width: 42px;
  height: 42px;
`;

const LanguagesButton = styled.button`
  cursor: pointer;
  width: 80px;
  background-color: var(--button-color);
  border: 1px solid var(--border-color);
  border-radius: 5px;
`;

export function Game({ language, setLanguage }: Props) {
  const vocabulary = vocabularies[language];

  const [hidden, setHidden] = useState<HiddenLanguage>(null);
  const [history, setHistory] = useState<VocabularyItem[]>([defaultWord]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [guessed, setGuessed] = useState<boolean>(true);

  function getRandomWord() {
    if (currentIndex === history.length - 1) {
      const index = Math.floor(Math.random() * vocabulary.length);
      const randomWord = vocabulary[index];
      setHistory((prev) => [...prev, randomWord]);
    }
    setCurrentIndex((prev) => prev + 1);

    if (hidden) setGuessed(false);
  }

  function speak() {
    const word = history[currentIndex][language];
    const wordToSay = new SpeechSynthesisUtterance(word);
    wordToSay.lang = speakLanguage[language];
    speechSynthesis.speak(wordToSay);
  }

  function getPreviousWord() {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        getRandomWord();
      } else if (event.key === "ArrowLeft") {
        getPreviousWord();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [getRandomWord, getPreviousWord]);

  return (
    <>
      <LanguagesButton onClick={() => setLanguage(null)}>
        Languages
      </LanguagesButton>
      <GameContainer>
        <Speaker src={speaker} alt="speaker" onClick={speak}></Speaker>
        <WordBoxContainer>
          <WordBox
            language={language}
            history={history}
            currentIndex={currentIndex}
            hidden={hidden}
            setHidden={setHidden}
            guessed={guessed}
            setGuessed={setGuessed}
          />
        </WordBoxContainer>
        <StepContainer>
          <Back src={back} alt="back" onClick={getPreviousWord}></Back>
          <Next src={next} alt="next" onClick={getRandomWord}></Next>
        </StepContainer>
        {hidden && (
          <WordGuess
            language={language}
            hidden={hidden}
            currentWord={history[currentIndex]}
            setGuessed={setGuessed}
          />
        )}
      </GameContainer>
    </>
  );
}
