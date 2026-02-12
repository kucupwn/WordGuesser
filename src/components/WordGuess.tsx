import styled from "styled-components";
import type { GameLanguage } from "./Game";

interface Props {
  language: GameLanguage;
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

export function WordGuess({ language }: Props) {
  return (
    <InputContainer>
      <InputField placeholder={language}></InputField>
      <InputButton>Submit</InputButton>
    </InputContainer>
  );
}
