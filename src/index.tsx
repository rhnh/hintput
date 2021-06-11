import React, { useState, useEffect } from "react";
import HintDisplay from "./HintDisplay";
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
export function Hintput({
  items,
  handleBlur,
  handleChange,
  placeholder,
  numberOfSuggestions = 5,
  name,
}: IHintput): React.ReactElement {
  const [hint, setHint] = useState("");
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [tabbed, setTabbed] = useState(false);

  useEffect(() => {
    if (text === "") {
      return;
    }
    if (text.length > 2) {
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
  }, [hint, items, numberOfSuggestions, text]);
  const handleBlurInside = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setText(value);
    if (typeof handleBlur === "function") handleBlur(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Backspace") {
      setHint("");
      setText("");
      setSuggestions([]);
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

  const handleChangeInside = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    setText(value.trim().toLowerCase());
    setTabbed(true);
    if (typeof handleChange === "function") handleChange(e);
  };

  return (
    <HintDisplay
      text={text}
      setText={setText}
      hint={hint}
      handleBlur={handleBlurInside}
      handleChange={handleChangeInside}
      handleKeyDown={handleKeyDown}
      suggestions={suggestions}
      setSuggestions={setSuggestions}
      tabbed={tabbed}
      placeholder={placeholder || ""}
      inputName={name || ""}
    />
  );
}
