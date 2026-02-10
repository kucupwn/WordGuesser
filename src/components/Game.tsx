import styled from "styled-components";
import { useState } from "react";
import { russianVocabulary } from "../assets/russianWords";
import { spanishVocabulary } from "../assets/spanishWords";

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

export function Game({ language }: Props) {
  const vocabulary = vocabularies[language];

  const [currentWord, setCurrentWord] = useState<VocabularyItem>(defaultWord);
  const [hidden, setHidden] = useState<HiddenLanguage>(null);

  function getRandomWord() {
    const index = Math.floor(Math.random() * vocabulary.length);
    setCurrentWord(vocabulary[index]);
  }

  function hideWord(language: HiddenLanguage) {
    hidden === language ? setHidden(null) : setHidden(language);
  }

  return (
    <GameContainer>
      <WordBoxContainer>
        <WordBox onClick={() => hideWord("foreign")}>
          {hidden === "foreign" ? null : <p>{currentWord[language]}</p>}
        </WordBox>
        <WordBox onClick={() => hideWord("english")}>
          {hidden === "english" ? null : <p>{currentWord.english}</p>}
        </WordBox>
      </WordBoxContainer>
      <GetButton onClick={getRandomWord}>Get</GetButton>
    </GameContainer>
  );
}
