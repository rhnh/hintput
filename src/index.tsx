import React, { useState, useEffect, FC } from "react";
import { IHintput } from "./types";
import "./index.css";
import { findAndSort } from "./utils";

/**
 *
 * @param  - items: array of strings
 * @param - handleBlur: takes an event object and fire action onBlur
 * @param - handleChange: takes an event object and fire action onChange
 * @param - name for the name and id of input box and label
 * @returns - Returns a react component
 */

export const Hintput: FC<
  IHintput & React.InputHTMLAttributes<HTMLInputElement>
> = ({
  items,
  handleBlur,
  handleChange,
  placeholder,
  numberOfSuggestions = 5,
  name,
  className = "",
  style,
}: IHintput): React.ReactElement => {
  const [hint, setHint] = useState("");
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [tabbed, setTabbed] = useState(false);
  const [hide, setHide] = useState(false);
  const [found, setFound] = useState(true);
  const [originalText, setOriginalText] = useState("");
  useEffect(() => {
    if (text === "") {
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
          const restHint = hintArray[0]?.substr(0, hintIndex);
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
          const hintBegging = firstMatch.substr(0, hintIndex);
          const completedWord = hintBegging + text;
          setHint(completedWord);
        }
        setSuggestions(hintArray.slice(1, numberOfSuggestions));
      }
    }
  }, [found, hint, items, numberOfSuggestions, text]);

  const handleBlurInside = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setText(value);
    setHint("");
    setHide(false);
    setOriginalText("");
    if (typeof handleBlur === "function") handleBlur(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key.length === 1) {
      const alphaNum = /[a-z]|[0|9]|\s/;
      if (alphaNum.test(e.key)) setOriginalText((re) => re + e.key);
    }

    if (e.code === "Backspace") {
      setHint("");
      setHint("");
      setText(originalText);
      setOriginalText("");
      setSuggestions([]);
      setHide(false);
      setFound(false);
    }
    if (e.code === "Tab") {
      if (suggestions.length <= 0) {
        if (hint) setText(hint);
        setHint("");
      }
    }
    if (e.code === "Enter") {
      if (hint) setText(hint);
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
      outline: "1px solid blue",
    },
  };
  const handleChangeInside = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    if (text.length === 0) {
      setFound(true);
    }
    setHide(true);
    setText(value.toLowerCase());
    setTabbed(true);
    if (typeof handleChange === "function") handleChange(e);
  };
  const inputRef = React.useRef<HTMLInputElement>(null);
  const inputRefHidden = React.useRef<HTMLInputElement>(null);
  const { width } = style || {};

  return (
    <span
      style={{
        position: "relative",
        padding: 0,
        margin: 0,
        display: "inline-block",
        width,
      }}
    >
      <input
        ref={inputRef}
        className={`${className} hint`}
        type="text"
        name={name}
        id={name}
        placeholder={placeholder}
        value={text.toLowerCase()}
        onChange={handleChangeInside}
        onBlur={handleBlurInside}
        onKeyDown={handleKeyDown}
        tabIndex={suggestions.length > 0 ? 1 : 0}
        style={{
          border: "1px solid black",
          ...style,
          width: "100%",
          color: "#000000",
          borderWidth: "1px",
        }}
      />
      {hide && (
          <span
            className={`${className} `}
            ref={inputRefHidden}
            style={{
              ...style,
              display: "flex",
              pointerEvents: "none",
              backgroundColor: "transparent",
              borderColor: "transparent",
              boxSizing: "border-box",
              color: "rgba(0, 0, 0, 0.35)",
              position: "absolute",
              top: 0,
              left: 0,
              justifyContent: "flex-end",
              alignItems: "stretch",
              border: "none",
              width: "100%",
              outlineStyle: "none",
              margin: "none",
              padding: 0,
            }}
          >
            <input
              value={hint}
              className={`${className} hint`}
              id="#hint"
              style={{
                ...style,
                color: "black",
                caretColor: "transparent",
                backgroundColor: "transparent",
                outline: "none",
                width: "100%",
                border: "none",
                outlineStyle: "none",
              }}
              disabled
              tabIndex={-1}
            />
          </span>
        ) && (
          <span
            className={`${className} `}
            ref={inputRefHidden}
            style={{
              ...style,
              display: "flex",
              pointerEvents: "none",
              backgroundColor: "transparent",
              borderColor: "transparent",
              boxSizing: "border-box",
              color: "rgba(0, 0, 0, 0.35)",
              position: "absolute",
              top: 0,
              left: 0,
              justifyContent: "flex-end",
              alignItems: "stretch",
              border: "none",
              width: "100%",
              outlineStyle: "none",
              margin: "none",
              padding: 0,
            }}
          >
            <input
              value={hint}
              className={`${className} hint`}
              id="#hint"
              style={{
                ...style,
                color: "rgba(0, 0, 0, 0.30)",
                caretColor: "transparent",
                backgroundColor: "transparent",
                outline: "none",
                width: "100%",
                border: "none",
                outlineStyle: "none",
              }}
              disabled
              tabIndex={-1}
            />
          </span>
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
