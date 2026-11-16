import type { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import type { Languages } from "../App";
import { ArrowRightIcon } from "./Icons";

interface Props {
  setLanguage: Dispatch<SetStateAction<Languages>>;
}

const Page = styled.main`
  width: 100%;
  max-width: 440px;
  margin: auto 0;
  padding-block: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Title = styled.h1`
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.75rem, 12vw, 3.75rem);
  font-weight: 600;
  font-variation-settings: "opsz" 144;
  line-height: 0.95;
  letter-spacing: -0.03em;

  em {
    font-style: italic;
    font-weight: 400;
    color: var(--accent);
  }
`;

const Lede = styled.p`
  color: var(--ink-soft);
  font-size: 1.0625rem;
  max-width: 32ch;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--rule);
`;

const Option = styled.button`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 0.25rem;
  background: none;
  border: none;
  border-bottom: 1px solid var(--rule);
  text-align: left;
  cursor: pointer;
  transition: padding 240ms cubic-bezier(0.16, 1, 0.3, 1);

  svg {
    color: var(--ink-faint);
    transition:
      transform 240ms cubic-bezier(0.16, 1, 0.3, 1),
      color 160ms;
  }

  @media (hover: hover) {
    &:hover {
      padding-left: 0.75rem;
    }
    &:hover svg {
      color: var(--accent);
      transform: translateX(4px);
    }
  }

  &:active svg {
    color: var(--accent);
  }
`;

const Names = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

const Name = styled.span`
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 500;
  line-height: 1.15;
  letter-spacing: -0.015em;
`;

const Native = styled.span`
  color: var(--ink-soft);
  font-size: 0.9375rem;
`;

const languages: { id: Exclude<Languages, null>; name: string; native: string }[] = [
  { id: "russian", name: "Russian", native: "Русский" },
  { id: "spanish", name: "Spanish", native: "Español" },
  { id: "dutch", name: "Dutch", native: "Nederlands" },
];

export function LanguageSelect({ setLanguage }: Props) {
  return (
    <Page>
      <Header>
        <Title>
          Word <em>Guesser</em>
        </Title>
        <Lede>Choose a language to practice.</Lede>
      </Header>
      <List>
        {languages.map((lang) => (
          <li key={lang.id}>
            <Option onClick={() => setLanguage(lang.id)}>
              <Names>
                <Name>{lang.name}</Name>
                <Native lang={lang.id === "russian" ? "ru" : lang.id === "spanish" ? "es" : "nl"}>
                  {lang.native}
                </Native>
              </Names>
              <ArrowRightIcon />
            </Option>
          </li>
        ))}
      </List>
    </Page>
  );
}
