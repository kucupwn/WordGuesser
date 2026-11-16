import styled, { keyframes } from "styled-components";
import type { GameLanguage, HiddenLanguage, VocabularyItem } from "./Game";
import { type Dispatch, type SetStateAction, useEffect } from "react";
import { EyeIcon, EyeOffIcon } from "./Icons";

interface Props {
  language: GameLanguage;
  languageLabel: string;
  history: VocabularyItem[];
  currentIndex: number;
  hidden: HiddenLanguage;
  setHidden: Dispatch<SetStateAction<HiddenLanguage>>;
  guessed: boolean;
  setGuessed: Dispatch<SetStateAction<boolean>>;
}

const wordIn = keyframes`
  from { opacity: 0; transform: translateY(6px); filter: blur(4px); }
  to { opacity: 1; transform: none; filter: none; }
`;

const Card = styled.section`
  background: var(--card);
  border: 1px solid var(--rule);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
`;

const Side = styled.div<{ $primary?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: ${(p) => (p.$primary ? "10.5rem" : "7.5rem")};
  padding: 1rem 1.25rem 1.5rem;
  cursor: pointer;
  user-select: none;
  transition: background-color 160ms;

  & + & {
    border-top: 1px dashed var(--rule);
  }

  @media (hover: hover) {
    &:hover {
      background: color-mix(in oklch, var(--accent-soft) 35%, transparent);
    }
    &:hover [data-toggle] {
      color: var(--accent);
    }
  }
`;

const SideHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--ink-faint);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
`;

const Toggle = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 500;
  letter-spacing: 0;
  transition: color 160ms;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const WordArea = styled.div`
  flex: 1;
  display: grid;
  place-items: center;
  text-align: center;
`;

const Word = styled.p<{ $primary?: boolean; $correct?: boolean }>`
  font-family: var(--font-display);
  font-size: ${(p) =>
    p.$primary ? "clamp(2rem, 9vw, 3rem)" : "clamp(1.5rem, 6.5vw, 2rem)"};
  font-weight: ${(p) => (p.$primary ? 600 : 400)};
  font-variation-settings: "opsz" 96;
  line-height: 1.1;
  letter-spacing: -0.02em;
  text-wrap: balance;
  overflow-wrap: anywhere;
  color: ${(p) => (p.$correct ? "var(--success)" : p.$primary ? "var(--ink)" : "var(--ink-soft)")};
  animation: ${wordIn} 420ms cubic-bezier(0.16, 1, 0.3, 1);
`;

const Concealed = styled.p`
  display: flex;
  gap: 0.5rem;

  span {
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 50%;
    background: var(--rule);
  }
`;

export function WordBox({
  language,
  languageLabel,
  history,
  currentIndex,
  hidden,
  setHidden,
  guessed,
  setGuessed,
}: Props) {
  function hideWord(language: HiddenLanguage) {
    hidden === language ? setHidden(null) : setHidden(language);
    setGuessed(false);
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        hideWord("foreign");
      } else if (event.key === "ArrowDown") {
        hideWord("english");
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [hideWord]);

  const sides = [
    { id: "foreign" as const, label: languageLabel, word: history[currentIndex][language] },
    { id: "english" as const, label: "English", word: history[currentIndex].english },
  ];

  return (
    <Card aria-label="Flashcard">
      {sides.map((side, i) => {
        const isHidden = hidden === side.id;
        const showWord = !isHidden || guessed;
        return (
          <Side
            key={side.id}
            $primary={i === 0}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => hideWord(side.id)}
          >
            <SideHeader>
              <span>{side.label}</span>
              <Toggle data-toggle>
                {isHidden ? <EyeOffIcon /> : <EyeIcon />}
                {isHidden ? "Hidden" : "Hide"}
              </Toggle>
            </SideHeader>
            <WordArea>
              {showWord ? (
                <Word
                  key={`${currentIndex}-${isHidden}`}
                  $primary={i === 0}
                  $correct={isHidden && guessed}
                >
                  {side.word}
                </Word>
              ) : (
                <Concealed aria-label="Hidden word">
                  <span />
                  <span />
                  <span />
                </Concealed>
              )}
            </WordArea>
          </Side>
        );
      })}
    </Card>
  );
}
