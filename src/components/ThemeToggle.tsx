import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { MoonIcon, SunIcon } from "./Icons";

type Theme = "light" | "dark";

const spin = keyframes`
  from { transform: rotate(-90deg) scale(0.6); opacity: 0; }
  to { transform: none; opacity: 1; }
`;

const Button = styled.button`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  background: var(--card);
  border: 1px solid var(--rule);
  border-radius: 999px;
  color: var(--ink-soft);
  cursor: pointer;
  transition:
    color 160ms,
    border-color 160ms;

  svg {
    width: 20px;
    height: 20px;
    animation: ${spin} 360ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  @media (hover: hover) {
    &:hover {
      color: var(--accent);
      border-color: var(--ink-faint);
    }
  }
`;

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.add("theme-switching");
  root.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#1d1a16" : "#f7f2e8");
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Storage unavailable (private mode etc.) — the choice just won't persist.
  }
  window.setTimeout(() => root.classList.remove("theme-switching"), 320);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(currentTheme);
  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <Button
      type="button"
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      // Don't steal focus from the guess input mid-game.
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => {
        applyTheme(next);
        setTheme(next);
      }}
    >
      {theme === "dark" ? <SunIcon key="sun" /> : <MoonIcon key="moon" />}
    </Button>
  );
}
