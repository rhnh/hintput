import React, { useState, useEffect, FC, CSSProperties } from "react";
import { findAndSort } from "./utils";

export interface IHintput {
  items: string[];
  numberOfSuggestions?: number;
  styleOfSuggestions?: Record<string, CSSProperties> | CSSProperties;
  classNameSuggestions?: string;
  styleOfList?: Record<string, CSSProperties> | CSSProperties;
  classNameList?: string;
  hintColor?: string;
}
/**
 *
 * @param items - an Array of strings
 * @param numberOfSuggestions - How many suggestions (buttons) do you want to see below the input box ?
 * @param styleOfSuggestions - Style for for suggestions buttons below the input box!
 * @param classNameSuggestions - A css class name suggestions buttons below the input box.
 * @param classNameList - A css class name for list of suggestions (buttons) below the input box ?
 * @param styleOfLists - How would design the list of suggestions below the input box ?
 * @param hintColor - a color for hint inside the input box.
 * @returns - Returns an input box which has search capability.
 */
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
  hintColor,
  styleOfList,
  styleOfSuggestions,
  classNameSuggestions,
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
  const { style } = props;
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
    background: classNameSuggestions ?? "transparent",
    border: classNameSuggestions ?? "none",
    ...styleOfSuggestions,
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
    <div
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
        style={{ ...style }}
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

              color: hintColor ?? "rgba(0, 0, 0, 0.30)",
            }}
            disabled
            tabIndex={-1}
          />
        )}
      {tabbed && suggestions.length > 0 && (
        <span id="suggestion-ul" style={{ display: "table", ...styleOfList }}>
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
                className={classNameSuggestions}
              >
                {suggestion}
              </button>
            </span>
          ))}
        </span>
      )}
    </div>
  );
};
