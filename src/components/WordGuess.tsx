import styled from "styled-components";
import type { GameLanguage, HiddenLanguage, VocabularyItem } from "./Game";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";

interface Props {
  language: GameLanguage;
  hidden: HiddenLanguage;
  currentWord: VocabularyItem;
  setGuessed: Dispatch<SetStateAction<boolean>>;
}

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const InputField = styled.input`
  width: 300px;
`;

const InputButton = styled.button`
  cursor: pointer;
  width: 80px;
  background-color: var(--action-button-color);
  border-radius: 5px;
`;

const Hint = styled.p`
  letter-spacing: 1rem;
  font-size: 20px;
  font-weight: bold;
`;

export function WordGuess({
  language,
  hidden,
  currentWord,
  setGuessed,
}: Props) {
  const hiddenLanguage = hidden === "foreign" ? language : "english";
  const correctAnswers = currentWord[hiddenLanguage]!.split("/").map((a) =>
    a.trim(),
  );

  const [inputValue, setInputValue] = useState<string>("");
  const [hint, setHint] = useState<string[]>([]);

  function updateInputValue(e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  function updateHint() {
    const trimmedInput = inputValue.trim();

    const newHint = correctAnswers.map((answer, answerIndex) => {
      const matched = hint[answerIndex].split("");

      for (let i = 0; i < trimmedInput.length; i++) {
        if (trimmedInput[i] === answer[i]) {
          matched[i] = trimmedInput[i];
        }
      }

      return matched.join("");
    });

    setHint(newHint);

    const isCorrect = correctAnswers.some((answer) => answer === trimmedInput);

    if (isCorrect) {
      setGuessed(true);
      setHint(correctAnswers);
    }

    setInputValue("");
  }

  useEffect(() => {
    const initialHint = correctAnswers.map((answer) =>
      "_".repeat(answer.length),
    );

    setHint(initialHint);
    setInputValue("");
    setGuessed(false);
  }, [currentWord, hiddenLanguage]);

  return (
    <InputContainer>
      <InputField
        name="guess"
        placeholder={hiddenLanguage}
        value={inputValue}
        onChange={updateInputValue}
      ></InputField>
      <InputButton onClick={() => updateHint()}>Submit</InputButton>
      {hint.map((hintLine, index) => (
        <Hint key={index}>{hintLine}</Hint>
      ))}
    </InputContainer>
  );
}
