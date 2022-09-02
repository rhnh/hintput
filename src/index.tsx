import React, { useState, useEffect, FC } from "react";
import { IHintput } from "./types";
import { autoComplete } from "./utils";

/**
 * @this {HTMLInputElement|HTMLElement}
 * @description This is an input which gives hint as inline, and suggestion as drop down
 * @param items - an Array of strings
 * @param {object} IHintput Param that this Component takes
 * @param {number} numberOfSuggestions - How many suggestions (buttons) do you want to see below the input box ?.
 * @param {CSSProperties}styleOfSuggestions - Style for for suggestions buttons below the input box!
 * @param {string} classNameSuggestions - A css class name suggestions buttons below the input box.
 * @param {string} hintColor - a color for hint inside the input box.
 * @param {number} fadePercentage - if you don't provide hintColor, you can add fadePercentage, reduce the color of hint
 * @param {Function} onBlur you can extract the value of input by using onBlur
 * @param {Function} onChange you can extract the value of input by using onBlur
 * @param {boolean} isInline You if you isInline is true, no suggestions will provide.
 * @param {boolean} textDirection - if you are adding language which reads from right. You can change to right
 * @info if you want to change container style add container as style
 * @info If you want to change the style of it. You can use style.
 * @info If you want change the suggestions button below the input box,
 * you can add buttonsStyle as parameter.
 * @info If you want change the
 * @returns {HTMLElement} an input box which has search capability.
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
  btnContainer,
  buttonsStyle,
  buttonsClass,
  containerClass,
  btnContainerClass,
  isInline = false,
  container,
  fadePercentage = 0.45,
  textDirection = "left",
  children,
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
  const [enabled, setEnabled] = useState<boolean>(true);
  const [originalText, setOriginalText] = useState("");

  const { style } = props;

  const shade = inputRef.current?.style.color
    ? inputRef.current?.style.color
        .replace(/rgb/i, "rgba")
        .replace(/\)/i, `,${fadePercentage})`)
    : "rgba(0, 0, 0, 0.30)";

  const addText = (str: string) => {
    setText(str);
  };
  const addHint = (str: string) => {
    setHint(str);
  };

  const addSuggestions = (str: string[]) => {
    setSuggestions(str);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
    autoComplete({
      textLength: text.length,
      numberOfSuggestions,
      items: items,
      addText,
      addHint,
      addSuggestions,
      found,
      text,
      enabled,
      isInline,
      originalText,
    });
  }, [
    enabled,
    found,
    hint,
    isInline,
    items,
    numberOfSuggestions,
    originalText,
    text,
  ]);

  const handleBlurInside = (e: React.FocusEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (typeof onChange === "function") onChange(e);
    setText(value);
    setHint("");
    setHide(false);
    if (typeof onBlur === "function") onBlur(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key.length === 1 && isInline) {
      if (
        originalText.length > 2 &&
        isInline &&
        hint.length > 0 &&
        e.key !== " "
      ) {
        if (!hint.includes(originalText)) {
          setText(originalText);
          setHint("");
        } else {
        }
      }
      setOriginalText((re) => re + e.key);
    }
    if (e.code === "Backspace" && isInline) {
      if (hint.length > 0) {
        setHint("");
        setText(originalText);
        setOriginalText("");
        setHide((e) => !e);
        setFound((e) => !e);
      } else {
        setOriginalText("");
        setText("");
        setHide(true);
      }
    }
    if (e.code === "Tab") {
      if (suggestions.length <= 0) {
        if (hint) {
          setText(hint);
          setHint("");
          setTabbed(false);
        }
      } else {
        if (hint === text) {
          setTabbed(false);
        }
      }
    }
    if (e.code === "Enter") {
      setTabbed(false);
      if (hint || suggestions.length > 0) {
        setText(hint);
        setHint("");
        setSuggestions([]);
        setOriginalText("");
        setTabbed(false);
        return;
      }
      setHint("");
      setSuggestions([]);
      setTabbed(false);
      setOriginalText("");
    }
    if (e.shiftKey && e.code === "Backspace") {
      setEnabled((prev) => !prev);
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
    setText(value);
    setTabbed(true);
  };

  return (
    <div
      title="Shift + Backspace to toggle to the auto completions"
      style={{
        position: "relative",
        padding: 0,
        margin: 0,
        top: 0,
        display: "block block",
        fontSize: "unset",
        boxSizing: "border-box",
        MozBoxSizing: "border-box",
        ...container,
        alignSelf: "auto",
      }}
      className={containerClass}
    >
      <div className="hint-input-div" style={{ display: "flex" }}>
        <input
          ref={inputRef}
          className={`${className} hint-put hintput-text`}
          type="text"
          name={name}
          id={name}
          {...props}
          style={{
            fontSize: "unset",
            ...style,
            textAlign: textDirection ?? "left",
          }}
          placeholder={placeholder}
          value={text}
          onChange={handleChangeInside}
          onBlur={handleBlurInside}
          onKeyDown={handleKeyDown}
          tabIndex={suggestions.length > 0 ? 1 : 0}
        />
        {hide && (
          <input
            data-testid="hint-test"
            value={hint}
            className={`${className} hint-put hintput-hint`}
            id="hint"
            style={{
              outline: "unset",
              borderSpacing: inputRef.current?.style.borderSpacing,
              position: "absolute",
              left: 0,
              outlineStyle: "none",
              display: "block",
              top: 0,
              fontSize: "unset",
              ...style,
              color: hintColor ? hintColor : shade,
              caretColor: "transparent",
              backgroundColor: "transparent",
              boxShadow: "unset",
              textAlign: textDirection ?? "left",
            }}
            disabled
            tabIndex={-1}
          />
        )}
        {children}
      </div>
      {tabbed && suggestions.length > 0 && (
        <div
          data-testid="div-test"
          style={{
            position: "absolute",
            background: "transparent",
            marginTop: 3,
            width: inputRef.current?.offsetWidth,
            ...style,
            ...btnContainer,
          }}
          className={`btnContainer ${btnContainerClass}`}
        >
          {suggestions.map((suggestion, i) => (
            <button
              onClick={() => {
                setText("");
                setText(suggestion);
                inputRef.current?.focus();
                setSuggestions([]);
              }}
              tabIndex={i + 2}
              style={{
                ...innerStyle,
                fontSize: "unset",
                display: "block",
                top: 0,
                cursor: "pointer",
                width: "unset",
                background: "none",
                textAlign: textDirection ?? "left",
                // maxWidth: inputRef.current?.offsetWidth,
                ...style,
                color: hintColor ?? "",
                ...buttonsStyle,
              }}
              className={`hint-buttons ${buttonsClass}`}
              key={i}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
