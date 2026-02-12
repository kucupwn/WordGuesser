import styled from "styled-components";
import type { GameLanguage, HiddenLanguage } from "./Game";

interface Props {
  language: GameLanguage;
  hidden: HiddenLanguage;
}

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const InputField = styled.input`
  width: 300px;
`;

const InputButton = styled.button`
  cursor: pointer;
  background-color: var(--action-button-color);
  border-radius: 5px;
`;

export function WordGuess({ language, hidden }: Props) {
  return (
    <InputContainer>
      <InputField
        placeholder={hidden === "foreign" ? language : "english"}
      ></InputField>
      <InputButton>Submit</InputButton>
    </InputContainer>
  );
}
