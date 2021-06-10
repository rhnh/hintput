import { ChangeEvent, Dispatch, KeyboardEvent, SetStateAction } from "react";

export interface IHintDisplay {
  inputName: string;
  placeholder: string;
  text: string;
  hint: string;
  tabbed: boolean;
  suggestions: string[];
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  setSuggestions: Dispatch<SetStateAction<string[]>>;
  setText: Dispatch<SetStateAction<string>>;
}

export interface IHintput {
  name: string;
  placeholder?: string;
  items: string[];
  numberOfSuggestions?: number;
  handleBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
