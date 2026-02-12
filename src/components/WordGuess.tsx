import styled from "styled-components";
import type { GameLanguage, HiddenLanguage, VocabularyItem } from "./Game";
import { useState } from "react";

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

  const [hint, setHint] = useState<string>(getDefaultHintLines());

  function getDefaultHintLines() {
    const underlines = [];
    for (let i = 0; i <= currentWord[hiddenLanguage]!.length - 1; i++) {
      underlines.push("_");
    }

    return underlines.join("");
  }

  return (
    <InputContainer>
      <InputField name="guess" placeholder={hiddenLanguage}></InputField>
      <InputButton>Submit</InputButton>
      <Hint>{hint}</Hint>
    </InputContainer>
  );
}
