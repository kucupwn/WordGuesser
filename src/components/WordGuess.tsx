import styled from "styled-components";
import type { GameLanguage, HiddenLanguage, VocabularyItem } from "./Game";
import { useEffect, useState, type ChangeEvent } from "react";

interface Props {
  language: GameLanguage;
  hidden: HiddenLanguage;
  currentWord: VocabularyItem;
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

export function WordGuess({ language, hidden, currentWord }: Props) {
  const hiddenLanguage = hidden === "foreign" ? language : "english";

  const [hint, setHint] = useState<string>(
    getDefaultHintLines(currentWord[language]!),
  );
  const [inputValue, setInputValue] = useState<string>("");

  function getDefaultHintLines(word: string) {
    return "_".repeat(word.length);
  }

  function updateInputValue(e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  function checkInput(input: string) {
    const matched = hint.split("");

    for (let i = 0; i < input.length; i++) {
      if (input[i] === currentWord[language]![i]) {
        matched[i] = input[i];
      }
    }

    return matched.join("");
  }

  function updateHint() {
    const matchedHint = checkInput(inputValue);
    setHint(matchedHint);
    setInputValue("");
  }

  useEffect(() => {
    const hiddenWord = currentWord[hiddenLanguage]!;
    setHint(getDefaultHintLines(hiddenWord));
    setInputValue("");
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
      <Hint>{hint}</Hint>
    </InputContainer>
  );
}
