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
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
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
