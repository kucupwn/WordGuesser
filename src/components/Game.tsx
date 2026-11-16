import styled from "styled-components";
import {
  useEffect,
  useState,
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
} from "react";
import { russianVocabulary } from "../assets/russianWords";
import { spanishVocabulary } from "../assets/spanishWords";
import { WordGuess } from "./WordGuess";
import type { Languages } from "../App";
import { WordBox } from "./WordBox";
import { dutchVocabulary } from "../assets/dutchWords";
import { ChevronLeftIcon, ChevronRightIcon, SpeakerIcon } from "./Icons";
import { ThemeToggle } from "./ThemeToggle";

export type GameLanguage = "russian" | "spanish" | "dutch";

export type VocabularyItem = {
  english: string;
  russian?: string;
  spanish?: string;
  dutch?: string;
};

export type HiddenLanguage = "foreign" | "english" | null;

interface Props {
  language: GameLanguage;
  setLanguage: Dispatch<SetStateAction<Languages>>;
}

const vocabularies: Record<GameLanguage, VocabularyItem[]> = {
  russian: russianVocabulary,
  spanish: spanishVocabulary,
  dutch: dutchVocabulary,
};

const defaultWord: VocabularyItem = {
  english: "English",
  russian: "Russian",
  spanish: "Spanish",
  dutch: "Dutch",
};

const speakLanguage = {
  russian: "ru-RU",
  spanish: "es-ES",
  dutch: "nl-NL",
};

const languageLabels: Record<GameLanguage, string> = {
  russian: "Russian",
  spanish: "Spanish",
  dutch: "Dutch",
};

// Keep focus where it is (e.g. the guess input) when tapping controls.
const keepFocus = (event: MouseEvent) => event.preventDefault();

const Page = styled.main`
  width: 100%;
  max-width: 520px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 44px;
`;

const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: -0.5rem;
  padding: 0.5rem 0.875rem 0.5rem 0.375rem;
  min-height: 44px;
  background: none;
  border: none;
  border-radius: 999px;
  color: var(--ink-soft);
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 160ms,
    color 160ms;

  svg {
    width: 20px;
    height: 20px;
  }

  @media (hover: hover) {
    &:hover {
      color: var(--ink);
      background: var(--accent-soft);
    }
  }
`;

const TopBarEnd = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
`;

const LanguageName = styled.p`
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 500;
  font-style: italic;
  color: var(--accent);
`;

const Stage = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.75rem;
  padding-block: 0.5rem 1rem;
`;

const Controls = styled.div`
  position: sticky;
  bottom: max(16px, env(safe-area-inset-bottom));
  display: grid;
  grid-template-columns: 56px 56px 1fr;
  gap: 0.75rem;
`;

const IconButton = styled.button`
  display: grid;
  place-items: center;
  height: 56px;
  background: var(--card);
  border: 1px solid var(--rule);
  border-radius: 16px;
  color: var(--ink);
  cursor: pointer;
  transition:
    transform 120ms,
    border-color 160ms,
    color 160ms;

  @media (hover: hover) {
    &:hover:not(:disabled) {
      border-color: var(--ink-faint);
    }
  }

  &:active:not(:disabled) {
    transform: scale(0.96);
  }

  &:disabled {
    color: var(--ink-faint);
    opacity: 0.55;
    cursor: default;
  }
`;

const NextButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  height: 56px;
  background: var(--accent);
  border: none;
  border-radius: 16px;
  color: var(--accent-ink);
  font-size: 1.0625rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 20px -10px var(--accent);
  transition:
    transform 120ms,
    filter 160ms;

  svg {
    width: 20px;
    height: 20px;
  }

  @media (hover: hover) {
    &:hover {
      filter: brightness(1.07);
    }
  }

  &:active {
    transform: scale(0.98);
  }
`;

const Shortcuts = styled.p`
  display: none;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.25rem 1.25rem;
  color: var(--ink-faint);
  font-size: 0.8125rem;

  kbd {
    display: inline-block;
    min-width: 1.75em;
    margin-right: 0.25em;
    padding: 0 0.4em;
    border: 1px solid var(--rule);
    border-bottom-width: 2px;
    border-radius: 5px;
    font-family: inherit;
    font-size: 0.75rem;
    line-height: 1.6;
    text-align: center;
    color: var(--ink-soft);
  }

  span:has(kbd) {
    white-space: nowrap;
  }

  @media (hover: hover) and (pointer: fine) {
    display: flex;
  }
`;

export function Game({ language, setLanguage }: Props) {
  const vocabulary = vocabularies[language];

  const [hidden, setHidden] = useState<HiddenLanguage>(null);
  const [history, setHistory] = useState<VocabularyItem[]>([defaultWord]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [guessed, setGuessed] = useState<boolean>(true);

  function getRandomWord() {
    if (currentIndex === history.length - 1) {
      const index = Math.floor(Math.random() * vocabulary.length);
      const randomWord = vocabulary[index];
      setHistory((prev) => [...prev, randomWord]);
    }
    setCurrentIndex((prev) => prev + 1);

    if (hidden) setGuessed(false);
  }

  function speak() {
    const word = history[currentIndex][language];
    const wordToSay = new SpeechSynthesisUtterance(word);
    wordToSay.lang = speakLanguage[language];
    speechSynthesis.speak(wordToSay);
  }

  function getPreviousWord() {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        getRandomWord();
      } else if (event.key === "ArrowLeft") {
        getPreviousWord();
      } else if (event.key === "F2") {
        speak();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [getRandomWord, getPreviousWord, speak]);

  return (
    <Page>
      <TopBar>
        <BackLink onClick={() => setLanguage(null)}>
          <ChevronLeftIcon />
          Languages
        </BackLink>
        <TopBarEnd>
          <LanguageName>{languageLabels[language]}</LanguageName>
          <ThemeToggle />
        </TopBarEnd>
      </TopBar>
      <Stage>
        <WordBox
          language={language}
          languageLabel={languageLabels[language]}
          history={history}
          currentIndex={currentIndex}
          hidden={hidden}
          setHidden={setHidden}
          guessed={guessed}
          setGuessed={setGuessed}
        />
        {hidden && (
          <WordGuess
            language={language}
            hidden={hidden}
            currentWord={history[currentIndex]}
            setGuessed={setGuessed}
          />
        )}
      </Stage>
      <Controls>
        <IconButton
          aria-label="Previous word"
          onMouseDown={keepFocus}
          onClick={getPreviousWord}
          disabled={currentIndex === 0}
        >
          <ChevronLeftIcon />
        </IconButton>
        <IconButton
          aria-label="Pronounce word"
          onMouseDown={keepFocus}
          onClick={speak}
        >
          <SpeakerIcon />
        </IconButton>
        <NextButton onMouseDown={keepFocus} onClick={getRandomWord}>
          Next word
          <ChevronRightIcon />
        </NextButton>
      </Controls>
      <Shortcuts>
        <span>
          <kbd>←</kbd>
          <kbd>→</kbd>browse
        </span>
        <span>
          <kbd>↑</kbd>
          <kbd>↓</kbd>hide a side
        </span>
        <span>
          <kbd>F2</kbd>speak
        </span>
        <span>
          <kbd>Enter</kbd>guess
        </span>
      </Shortcuts>
    </Page>
  );
}
