import styled, { keyframes } from "styled-components";
import type { GameLanguage, HiddenLanguage, VocabularyItem } from "./Game";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import { ArrowRightIcon } from "./Icons";

interface Props {
  language: GameLanguage;
  hidden: HiddenLanguage;
  currentWord: VocabularyItem;
  setGuessed: Dispatch<SetStateAction<boolean>>;
}

const slotIn = keyframes`
  from { transform: translateY(4px) scale(0.85); opacity: 0; }
  to { transform: none; opacity: 1; }
`;

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
`;

const Hints = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
`;

const Or = styled.span`
  color: var(--ink-faint);
  font-size: 0.8125rem;
  font-style: italic;
`;

const HintLine = styled.p`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem 1rem;
`;

const HintWord = styled.span`
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 3px;
`;

const Slot = styled.span<{ $filled: boolean }>`
  display: grid;
  place-items: end center;
  width: clamp(1.15rem, 5.4vw, 1.6rem);
  height: clamp(1.75rem, 8vw, 2.25rem);
  padding-bottom: 0.2rem;
  border-bottom: 2px solid ${(p) => (p.$filled ? "var(--accent)" : "var(--ink-faint)")};
  font-family: var(--font-display);
  font-size: clamp(1.125rem, 5vw, 1.5rem);
  font-weight: 600;
  line-height: 1;
  color: var(--ink);

  > span {
    animation: ${slotIn} 280ms cubic-bezier(0.16, 1, 0.3, 1);
  }
`;

const Note = styled.p`
  color: var(--ink-soft);
  font-size: 0.9375rem;
  font-style: italic;
  text-align: center;
`;

const InputRow = styled.div`
  display: flex;
  width: 100%;
  padding: 0.375rem;
  background: var(--card);
  border: 1px solid var(--rule);
  border-radius: 16px;
  transition:
    border-color 160ms,
    box-shadow 160ms;

  &:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 0 4px color-mix(in oklch, var(--accent) 18%, transparent);
  }
`;

const InputField = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0 0.75rem;
  background: none;
  border: none;
  outline: none;
  font-size: 1.0625rem;
  caret-color: var(--accent);

  &::placeholder {
    color: var(--ink-faint);
  }
`;

const InputButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  height: 44px;
  padding: 0 1rem;
  background: var(--ink);
  border: none;
  border-radius: 11px;
  color: var(--paper);
  font-weight: 600;
  cursor: pointer;
  transition: transform 120ms;

  svg {
    width: 18px;
    height: 18px;
  }

  &:active {
    transform: scale(0.97);
  }
`;

function HintDisplay({ line }: { line: string }) {
  return (
    <HintLine aria-label={line.replace(/_/g, " blank ")}>
      {line.split(" ").map((word, wordIndex) => (
        <HintWord key={wordIndex} aria-hidden="true">
          {word.split("").map((char, charIndex) => {
            const filled = char !== "_";
            return (
              <Slot key={charIndex} $filled={filled}>
                {filled && <span>{char}</span>}
              </Slot>
            );
          })}
        </HintWord>
      ))}
    </HintLine>
  );
}

export function WordGuess({
  language,
  hidden,
  currentWord,
  setGuessed,
}: Props) {
  const hiddenLanguage = hidden === "foreign" ? language : "english";

  const raw = currentWord[hiddenLanguage]!;

  const parenthesisMatch = raw.match(/\(.*\)$/);
  const parenthesis = parenthesisMatch ? parenthesisMatch[0] : "";

  const cleanRaw = parenthesis ? raw.replace(parenthesis, "").trim() : raw;

  const correctAnswers = cleanRaw.split(/[,\/]/).map((a) => a.trim());
  const processedAnswers = correctAnswers.map((answer) => {
    let prefix = "";
    let core = answer;

    if (core.startsWith("to ")) {
      prefix = "to ";
      core = core.slice(3);
    }

    return { prefix, core };
  });

  const [inputValue, setInputValue] = useState<string>("");
  const [hint, setHint] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  function updateInputValue(e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  function normalize(str: string) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  const handleGuess = useCallback(() => {
    // The "to " prefix is shown in the hint, so accept guesses with or without it.
    const trimmedInput = inputValue.trim().replace(/^to\s+/i, "");

    const newHint = processedAnswers.map((answer, answerIndex) => {
      const currentHint = hint[answerIndex];

      const matched = currentHint.split("");

      const maxIteration = Math.min(trimmedInput.length, answer.core.length);
      for (let i = 0; i < maxIteration; i++) {
        if (normalize(trimmedInput[i]) === normalize(answer.core[i])) {
          matched[answer.prefix.length + i] = answer.core[i];
        }
      }

      return matched.join("");
    });

    setHint(newHint);

    const isCorrect = processedAnswers.some(
      (answer) => normalize(answer.core) === normalize(trimmedInput),
    );

    if (isCorrect) {
      setGuessed(true);

      const revealed = processedAnswers.map(
        (answer) => answer.prefix + answer.core,
      );

      setHint(revealed);
    }

    setInputValue("");
  }, [inputValue, hint, processedAnswers, setGuessed]);

  useEffect(() => {
    const initialHint = processedAnswers.map((answer) => {
      const maskedCore = answer.core
        .split("")
        .map((char) => (char === " " ? " " : "_"))
        .join("");

      return answer.prefix + maskedCore;
    });

    setHint(initialHint);
    setInputValue("");
    setGuessed(false);
  }, [currentWord, hiddenLanguage]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleGuess();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleGuess]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Panel aria-label="Guess the word">
      <Hints>
        {hint.map((hintLine, index) => (
          <div key={index} style={{ display: "contents" }}>
            {index > 0 && <Or>or</Or>}
            <HintDisplay line={hintLine} />
          </div>
        ))}
        {parenthesis && <Note>{parenthesis}</Note>}
      </Hints>
      <InputRow>
        <InputField
          ref={inputRef}
          name="guess"
          placeholder={`Type the ${hiddenLanguage === "english" ? "English" : hiddenLanguage.charAt(0).toUpperCase() + hiddenLanguage.slice(1)} word`}
          value={inputValue}
          onChange={updateInputValue}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="done"
        ></InputField>
        <InputButton onMouseDown={(e) => e.preventDefault()} onClick={() => handleGuess()}>
          Check
          <ArrowRightIcon />
        </InputButton>
      </InputRow>
    </Panel>
  );
}
