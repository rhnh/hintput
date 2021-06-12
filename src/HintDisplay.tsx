import React from "react";
import { IHintDisplay } from "./types";

export default function HintDisplay({
  inputName,
  placeholder,
  text,
  hint,
  tabbed,
  suggestions,
  handleBlur,
  handleChange,
  handleKeyDown,
  customClass,
  customStyle,
  setSuggestions,
  setText,
}: IHintDisplay) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const innerStyle = {
    background: "transparent",
    border: "none",
    ":selected, :focused": {
      border: "none",
      outline: "1px solid blue",
    },
  };
  return (
    <span
      style={{
        position: "relative",
        padding: 0,
        margin: 0,
        display: "inline-block",
        width: "100%",
      }}
    >
      <input
        ref={inputRef}
        className={`${customClass} hint`}
        type="text"
        name={inputName}
        id={inputName}
        placeholder={placeholder}
        value={text.toLowerCase()}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        tabIndex={suggestions.length > 0 ? 1 : 0}
        style={{ ...customStyle, color: "#000000" }}
      />

      <span
        className={`${customClass} `}
        style={{
          ...customStyle,
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
          alignItems: "center",
        }}
      >
        <input
          value={hint}
          className={`${customClass} hint`}
          id="#hint"
          style={{
            ...customStyle,
            color: "rgba(0, 0, 0, 0.30)",
            caretColor: "transparent",
            backgroundColor: "transparent",
            outline: "none",
          }}
          disabled
          tabIndex={-1}
        />
      </span>
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
}
