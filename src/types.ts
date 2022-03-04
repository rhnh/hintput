import { ChangeEvent, Dispatch, KeyboardEvent, SetStateAction } from "react";

export interface IHintDisplay {
  inputName: string;
  placeholder: string;
  text: string;
  hint: string;
  tabbed: boolean;
  customClass?: string;
  customStyle?: {
    [x: string]: string;
  };
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
  className?: string;
  numberOfSuggestions?: number;
  style?: {
    [x: string]: string;
  };
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
