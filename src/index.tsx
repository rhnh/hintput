import React, { useState, useEffect, FC } from "react";

import "./hintput.css";
import { findAndSort } from "./utils";

export interface IHintput {
  items: string[];
  numberOfSuggestions?: number;
  hintColor?: string;
}

export const Hintput: FC<
  IHintput & React.InputHTMLAttributes<HTMLInputElement>
> = ({
  items,
  placeholder,
  numberOfSuggestions = 5,
  name,
  onChange,
  onBlur,
  className = "",
  style,
  hintColor,
  ...props
}: IHintput &
  React.InputHTMLAttributes<HTMLInputElement>): React.ReactElement => {
  const [hint, setHint] = useState("");
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [tabbed, setTabbed] = useState(false);
  const [hide, setHide] = useState(false);
  const [found, setFound] = useState(true);
  const inputRef = React.useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    if (text === "") {
      setHint("");
      setSuggestions([]);
      return;
    }

    if (text.length > 2 && found) {
      const hintArray = findAndSort(items, text);
      //hint = 0 => don't show suggestions
      if (hintArray.length <= 0) {
        setHint("");
        setSuggestions([]);
      }
      //hint = 1 => don't show suggestions
      if (hintArray.length === 1) {
        const hintIndex = hintArray[0]
          ?.toLowerCase()
          .indexOf(text.toLowerCase());
        if (hintIndex === 0) {
          setHint(hintArray[0].toLowerCase());
        } else if (hintIndex > 0) {
          const restHint = hintArray[0]?.substring(0, hintIndex);
          if (restHint) {
            setText(restHint + text);
          }
        }
        setSuggestions([]);
      }
      /**
       * hint > 1,
       * if(hint matched at beginning) just show the hint and remove it from suggestions
       * if(hint matched at last) don't show hint, and don't remove it from suggestions
       * if(hint matched in the middle) do show the hint, and remove it from suggestions
       */
      if (hintArray.length > 1) {
        const firstMatch = hintArray[0];
        const hintIndex = firstMatch?.toLowerCase().indexOf(text.toLowerCase());
        if (hintIndex === 0) {
          setHint(firstMatch.toLowerCase());
        } else if (hintIndex > 0) {
          const isLastWord = firstMatch.split(" ").slice(-1).join(""); //get the last word
          if (isLastWord) {
            return setSuggestions(hintArray.slice(0, numberOfSuggestions));
          }
          const hintBegging = firstMatch.substring(0, hintIndex);
          const completedWord = hintBegging + text;
          setHint(completedWord);
        }
        setSuggestions(hintArray.slice(1, numberOfSuggestions));
      }
    }
  }, [found, hint, items, numberOfSuggestions, text]);

  const handleBlurInside = (e: React.FocusEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (typeof onChange === "function") onChange(e);
    setText(value);
    setHint("");
    setHide(false);
    if (typeof onBlur === "function") onBlur(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Tab") {
      if (suggestions.length <= 0) {
        if (hint) setText(hint);
        setHint("");
      }
      setTabbed(true);
    }
    if (e.code === "Enter") {
      if (hint) {
        setText(hint);
      }
      setHint("");
      setSuggestions([]);
      setTabbed(false);
    }
    if (e.shiftKey && e.code === "Tab") {
      setHint("");
      setSuggestions([]);
      setTabbed(false);
    }
  };
  const innerStyle = {
    background: "transparent",
    border: "none",
    ":selected, :focused": {
      border: "none",
      outline: "1px solid black",
    },
  };
  const handleChangeInside = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    if (typeof onChange === "function") {
      onChange(e);
    }
    if (text.length === 0) {
      setFound(true);
    }
    setHide(true);
    setText(value.toLowerCase());
    setTabbed(true);
  };

  return (
    <span
      style={{
        position: "relative",
        padding: 0,
        margin: 0,
        display: "inline-block",
      }}
    >
      <input
        ref={inputRef}
        className={`${className} hint`}
        type="text"
        name={name}
        id={name}
        {...props}
        placeholder={placeholder}
        value={text.toLowerCase()}
        onChange={handleChangeInside}
        onBlur={handleBlurInside}
        onKeyDown={handleKeyDown}
        tabIndex={suggestions.length > 0 ? 1 : 0}
      />
      {hide && (
          <input
            value={hint}
            className={`${className} hint`}
            id="#hint"
            style={{
              caretColor: "transparent",
              backgroundColor: "transparent",
              outline: "none",
              border: "none",
              outlineStyle: "none",
              ...style,
            }}
            {...props}
            disabled
            tabIndex={-1}
          />
        ) && (
          <input
            value={hint}
            className={`${className} hint`}
            id="#hint"
            style={{
              caretColor: "transparent",
              backgroundColor: "transparent",
              outline: "none",
              ...style,
              borderSpacing: inputRef.current?.style.borderSpacing,
              position: "absolute",
              top: 0,
              left: 0,
              outlineStyle: "none",
              margin: 0,
              color: hintColor ?? "rgba(0, 0, 0, 0.30)",
            }}
            disabled
            tabIndex={-1}
          />
        )}
      {tabbed && suggestions.length > 0 && (
        <span id="suggestion-ul" style={{ display: "table" }}>
          {suggestions.map((suggestion, i) => (
            <span key={i} style={{ display: "block" }}>
              <button
                onClick={() => {
                  setText("");
                  setText(suggestion);
                  inputRef.current?.focus();
                  setSuggestions([]);
                }}
                tabIndex={i + 2}
                style={innerStyle}
              >
                {suggestion}
              </button>
            </span>
          ))}
        </span>
      )}
    </span>
  );
};
