import { ChangeEvent, Dispatch, KeyboardEvent, SetStateAction } from "react";

export interface IHinputDisplayProps {
  name: string;
  placeholder?: string;
  text: string;
  hint: string;
  suggestions: string[];
  setText: Dispatch<SetStateAction<string>>;
  setSuggestions: Dispatch<SetStateAction<string[] | []>>;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export interface Types {
  name: string;
  placeholder?: string;
  items: string[];
  numberOfSuggestions?: number;
  handleBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
