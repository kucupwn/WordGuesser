import styled from "styled-components";
import type { GameLanguage, HiddenLanguage, VocabularyItem } from "./Game";
import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";

interface Props {
  language: GameLanguage;
  hidden: HiddenLanguage;
  currentWord: VocabularyItem;
  setGuessed: Dispatch<SetStateAction<boolean>>;
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
  background-color: var(--button-color);
  border: 1px solid var(--border-color);
  border-radius: 5px;
`;

const Hint = styled.p`
  letter-spacing: 1rem;
  font-size: 20px;
  font-weight: bold;
`;

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

  function updateInputValue(e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  function normalize(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  const handleGuess = useCallback(() => {
    const trimmedInput = inputValue.trim();

    const newHint = processedAnswers.map((answer, answerIndex) => {
      const currentHint = hint[answerIndex];

      const matched = currentHint.split("");

      const maxIteration = Math.min(trimmedInput.length, answer.core.length);
      for (let i = 0; i < maxIteration; i++) {
        if (normalize(trimmedInput[i]) === normalize(answer.core[i])) {
          matched[answer.prefix.length + i] = trimmedInput[i];
        }
      }

      return matched.join("");
    });

    setHint(newHint);
    console.log(inputValue);

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

  return (
    <InputContainer>
      <InputField
        name="guess"
        placeholder={hiddenLanguage}
        value={inputValue}
        onChange={updateInputValue}
      ></InputField>
      <InputButton onClick={() => handleGuess()}>Submit</InputButton>
      {hint.map((hintLine, index) => (
        <Hint key={index}>{hintLine}</Hint>
      ))}
      {parenthesis && <Hint>{parenthesis}</Hint>}
    </InputContainer>
  );
}
