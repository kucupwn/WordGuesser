import styled from "styled-components";

const LanguageChooseButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const LanguageChooseButton = styled.div`
  background-color: burlywood;
  font-size: 32px;
  padding: 0.5rem;
  border-radius: 10px;
  cursor: pointer;
`;

export function LanguageSelect() {
  return (
    <LanguageChooseButtonContainer>
      <LanguageChooseButton>Russian</LanguageChooseButton>
      <LanguageChooseButton>Spanish</LanguageChooseButton>
    </LanguageChooseButtonContainer>
  );
}
