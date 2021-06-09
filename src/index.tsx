import React, { useState, useEffect } from "react";

import "./index.css";
/**
 *
 * @param  - items: array of strings
 * @param - handleBlur: takes an event object and fire action onBlur
 * @param - handleChange: takes an event object and fire action onChange
 * @param - name for the name and id of input box and label
 * @returns - Returns a react component
 */
interface Types {
  name: string;
  placeholder?: string;
  items: string[];
  numberOfSuggestions?: number;
  handleBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export function Hintput({
  items,
  handleBlur,
  handleChange,
  placeholder,
  numberOfSuggestions = 5,
  name,
}: Types): React.ReactElement {
  const [hint, setHint] = useState("");
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  useEffect(() => {
    if (text === "") {
      return;
    }
    if (text.length > 1) {
      const copyOfText = text;
      const noDuplicate = Array.from(new Set(items));
      const suggests = noDuplicate.filter((item) =>
        Object.values(item).join("").toLowerCase().includes(text.toLowerCase())
      );

      const hint = suggests[0]?.toLowerCase().indexOf(text.toLowerCase());
      if (hint >= 0) setHint(suggests[0]?.toLowerCase());
      //match the query in the middle ?
      const restHint = suggests[0]?.substr(0, hint);
      if (restHint) {
        setText(restHint + text);
      }

      const filtered = noDuplicate.filter((item) =>
        Object.values(item)
          .join("")
          .toLowerCase()
          .includes(copyOfText.toLowerCase())
      );
      setSuggestions(filtered.slice(1, numberOfSuggestions));
    }
  }, [items, text]);
  const handleBlurInside = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setText(value);
    handleBlur(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === "Backspace") {
      setHint("");
    }
    if (e.code === "Tab" && suggestions.length <= 0) {
      setText(hint);
      setHint("");
    }
    if (e.code === "Enter") {
      setText(hint);
    }
  };

  const handleChangeInside = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    setText(value);
    handleChange(e);
  };

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
      }}
    >
      <input
        ref={inputRef}
        className="hint"
        type="text"
        name={name}
        id={name}
        placeholder={placeholder}
        value={text.toLowerCase()}
        onChange={handleChangeInside}
        onBlur={handleBlurInside}
        onKeyDown={handleKeyDown}
        tabIndex={suggestions.length > 0 ? 1 : 0}
        style={{ color: "#000000" }}
      />

      <span
        style={{
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
          className="hint "
          id="#hint"
          style={{
            color: "rgba(0, 0, 0, 0.30)",
            caretColor: "transparent",
            backgroundColor: "transparent",
            outline: "none",
          }}
          disabled
          tabIndex={-1}
        />
      </span>
      {suggestions.length > 0 && (
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
