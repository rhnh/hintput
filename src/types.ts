import { CSSProperties } from "react";

export interface IHintput {
  items: string[];
  numberOfSuggestions?: number;
  buttonsStyle?: Record<string, CSSProperties> | CSSProperties;
  buttonsClass?: string;
  btnContainer?: Record<string, CSSProperties> | CSSProperties;
  btnContainerClass?: string;
  container?: Record<string, CSSProperties> | CSSProperties;
  containerClass?: string;
  hintColor?: string;
  focused?: boolean;
  isInline?: boolean;
  fadePercentage?: number;
  textDirection?: "left" | "right";
}

export interface IAutocomplete {
  numberOfSuggestions: number;
  enabled: boolean;
  addText: (str: string) => void;
  addSuggestions: (suggestions: string[]) => void;
  addHint: (str: string) => void;
  found: boolean;
  textLength: number;
  text: string;
  items: string[];
  isInline?: boolean;
  originalText: string;
}
