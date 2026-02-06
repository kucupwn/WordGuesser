import styled from "styled-components";
import { useState } from "react";
import { russianVocabulary } from "../assets/russianWords";
import { spanishVocabulary } from "../assets/spanishWords";

type GameLanguage = "russian" | "spanish";

interface Props {
  language: GameLanguage;
}

type VocabularyItem = {
  english: string;
  russian?: string;
  spanish?: string;
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
  background-color: aquamarine;
  border-radius: 20px;
  font-size: 2rem;
  cursor: pointer;
`;

const GetButton = styled.button`
  width: auto;
  border-radius: 10px;
  font-size: 40px;
  cursor: pointer;
`;

export function Game({ language }: Props) {
  const vocabulary =
    language === "russian" ? russianVocabulary : spanishVocabulary;

  const [currentWord, setCurrentWord] = useState<VocabularyItem | null>(null);

  function getRandomWord() {
    const index = Math.floor(Math.random() * vocabulary.length);
    setCurrentWord(vocabulary[index]);
  }

  return (
    <GameContainer>
      <WordBoxContainer>
        <WordBox>
          <p>{currentWord?.[language]}</p>
        </WordBox>
        <WordBox>
          <p>{currentWord?.english}</p>
        </WordBox>
      </WordBoxContainer>
      <GetButton onClick={getRandomWord}>Get</GetButton>
    </GameContainer>
  );
}
