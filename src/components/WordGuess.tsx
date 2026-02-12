import styled from "styled-components";
import type { HiddenLanguage } from "./Game";

interface Props {
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

export function WordGuess({ hidden }: Props) {
  return (
    <InputContainer>
      <InputField></InputField>
      <InputButton>Submit</InputButton>
    </InputContainer>
  );
}
