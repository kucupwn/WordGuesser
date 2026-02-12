import styled from "styled-components";
import { useState } from "react";
import { russianVocabulary } from "../assets/russianWords";
import { spanishVocabulary } from "../assets/spanishWords";
import speaker from "../assets/speaker.png";
import back from "../assets/arrow-back.png";

type GameLanguage = "russian" | "spanish";

type VocabularyItem = {
  english: string;
  russian?: string;
  spanish?: string;
};

type HiddenLanguage = "foreign" | "english" | null;

interface Props {
  language: GameLanguage;
}

const vocabularies: Record<GameLanguage, VocabularyItem[]> = {
  russian: russianVocabulary,
  spanish: spanishVocabulary,
};

const defaultWord: VocabularyItem = {
  english: "English",
  russian: "Russian",
  spanish: "Spanish",
};

const speakLanguage = {
  russian: "ru-RU",
  spanish: "es-ES",
};

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
`;

const WordBoxContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
`;

const WordBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 5px;
  width: 400px;
  height: 100px;
  background-color: var(--language-button-color);
  border-radius: 20px;
  font-size: 2rem;
  cursor: pointer;
`;

const GetButton = styled.button`
  width: auto;
  border-radius: 10px;
  font-size: 40px;
  background-color: var(--action-button-color);
  cursor: pointer;
`;

const Speaker = styled.img`
  cursor: pointer;
  width: 42px;
  height: 42px;
`;

const Back = styled.img`
  cursor: pointer;
  width: 42px;
  height: 42px;
`;

export function Game({ language }: Props) {
  const vocabulary = vocabularies[language];

  const [hidden, setHidden] = useState<HiddenLanguage>(null);
  const [history, setHistory] = useState<VocabularyItem[]>([defaultWord]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  function getRandomWord() {
    if (currentIndex === history.length - 1) {
      const index = Math.floor(Math.random() * vocabulary.length);
      const randomWord = vocabulary[index];
      setHistory((prev) => [...prev, randomWord]);
    }
    setCurrentIndex((prev) => prev + 1);
  }

  function hideWord(language: HiddenLanguage) {
    hidden === language ? setHidden(null) : setHidden(language);
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

  return (
    <GameContainer>
      <Speaker src={speaker} alt="speaker" onClick={speak}></Speaker>
      <WordBoxContainer>
        <WordBox onClick={() => hideWord("foreign")}>
          {hidden === "foreign" ? null : (
            <p>{history[currentIndex][language]}</p>
          )}
        </WordBox>
        <WordBox onClick={() => hideWord("english")}>
          {hidden === "english" ? null : <p>{history[currentIndex].english}</p>}
        </WordBox>
      </WordBoxContainer>
      <GetButton onClick={getRandomWord}>Get</GetButton>
      <Back src={back} alt="back" onClick={getPreviousWord}></Back>
    </GameContainer>
  );
}
