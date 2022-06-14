import React, { useState, useEffect, FC, CSSProperties } from "react";
import { findAndSort } from "./utils";

export interface IHintput {
  items: string[];
  numberOfSuggestions?: number;
  buttonsStyle?: Record<string, CSSProperties> | CSSProperties;
  buttonsClass?: string;
  buttonsDiv?: Record<string, CSSProperties> | CSSProperties;
  listClassName?: string;
  container?: Record<string, CSSProperties> | CSSProperties;
  containerClass?: string;
  hintColor?: string;
  focused?: boolean;
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
  buttonsDiv,
  buttonsStyle,
  buttonsClass,
  containerClass,
  container,

  ...props
}: IHintput &
  React.InputHTMLAttributes<HTMLInputElement>): React.ReactElement => {
  const value = (props.value as string) || "";
  const [hint, setHint] = useState("");
  const [text, setText] = useState<string>(value || "");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [tabbed, setTabbed] = useState(false);
  const [hide, setHide] = useState(false);
  const [found, setFound] = useState(true);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { style } = props;
  const propsWithoutFocus = { ...props };
  delete propsWithoutFocus.autoFocus;
  delete propsWithoutFocus.focused;
  const shade = "rgba(0, 0, 0, 0.30)";
  const dynamicWidth = "calc(100% - " + 8 + "px)";
  const width = style?.width;
  useEffect(() => {
    if (value === "") {
      setText("");
    }
  }, [value]);

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
    background: buttonsClass ?? "transparent",
    border: buttonsClass ?? "none",
    ...buttonsStyle,
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
        minWidth: "max-content",
        boxSizing: "border-box",
        MozBoxSizing: "border-box",
        width,
        ...container,
      }}
      className={containerClass}
    >
      <input
        ref={inputRef}
        className={`${className} hint`}
        type="text"
        name={name}
        id={name}
        style={{ ...style, width: dynamicWidth }}
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
              width: dynamicWidth,
              textAlign: "left",
            }}
            {...propsWithoutFocus}
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
              width: dynamicWidth,
              textAlign: "left",

              color: hintColor ? hintColor : shade,
            }}
            disabled
            tabIndex={-1}
          />
        )}
      {tabbed && suggestions.length > 0 && (
        <span id="suggestion-ul" style={{ display: "table", ...buttonsDiv }}>
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
                className={buttonsClass}
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
