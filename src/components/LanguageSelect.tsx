import type { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import type { Languages } from "../App";

interface Props {
  setLanguage: Dispatch<SetStateAction<Languages>>;
}

const LanguageChooseButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 3rem;
  gap: 1rem;
`;

const LanguageChooseButton = styled.div`
  background-color: var(--button-color);
  border: 2px solid var(--border-color);
  font-size: 32px;
  padding: 0.5rem;
  border-radius: 10px;
  cursor: pointer;
`;

export function LanguageSelect({ setLanguage }: Props) {
  return (
    <LanguageChooseButtonContainer>
      <LanguageChooseButton onClick={() => setLanguage("russian")}>
        Russian
      </LanguageChooseButton>
      <LanguageChooseButton onClick={() => setLanguage("spanish")}>
        Spanish
      </LanguageChooseButton>
      <LanguageChooseButton onClick={() => setLanguage("dutch")}>
        Dutch
      </LanguageChooseButton>
    </LanguageChooseButtonContainer>
  );
}
