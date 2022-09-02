import { IAutocomplete } from "./types";

/**
 *
 * @param items an Array of string
 * @param text a string to be search in given item array
 * @returns an array of string which match of the given text
 */
export const findAndSort = (items: string[], text: string): string[] =>
  Array.from(new Set(items))
    .filter((d) => typeof d === "string")
    .filter((item) =>
      Object.values(item.trim())
        .join("")
        .trim()
        .toLowerCase()
        .includes(text.toLowerCase())
    )
    .sort((a: string, b: string) => a.localeCompare(b))
    .sort((a: string, b: string) => {
      if (a.length > b.length) {
        return 1;
      } else if (a.length < b.length) {
        return -1;
      } else return 0;
    });

export const autoComplete = ({
  textLength,
  found,
  text,
  items,
  addHint,
  addSuggestions,
  numberOfSuggestions,
  enabled,
  isInline = false,
  addText,
  originalText,
}: IAutocomplete) => {
  if (textLength > 2 && found && enabled) {
    const suggestions = isInline
      ? findAndSort(items, text).slice(0, 1)
      : findAndSort(items, text);

    if (suggestions.length <= 0) {
      addHint("");
      addSuggestions([]);
    }
    /**
     * hint > 1,
     * if(hint matched at beginning) just show the hint and remove it from suggestions
     * if(hint matched at last) don't show hint, and don't remove it from suggestions
     * if(hint matched in the middle) do show the hint, and remove it from suggestions
     */
    if (suggestions.length > 0) {
      const firstMatched = suggestions[0];
      const hintIndex = firstMatched?.toLowerCase().indexOf(text.toLowerCase());
      if (hintIndex === 0) {
        if (isLowerCase(text)) {
          addHint(firstMatched.toLowerCase());
        } else {
          addHint(capitalizeFirstLetter(firstMatched));
        }
      } else if (hintIndex > 0) {
        if (isInline && suggestions.length === 1) {
          const restHint = suggestions[0]?.substring(0, hintIndex);
          if (restHint) {
            if (isLowerCase(suggestions[0].charAt(hintIndex)))
              addText(restHint + text);
            else {
              addText(
                capitalizeFirstLetter(restHint) + capitalizeFirstLetter(text)
              );
            }
          } else {
            addText("");
            addHint("");
            addSuggestions(findAndSort(items, originalText));
          }
        }
        const isLastWord = firstMatched.split(" ").slice(-1).join("");
        if (isLastWord) {
          return addSuggestions(suggestions.slice(0, numberOfSuggestions));
        }
        const hintStart = firstMatched.substring(0, hintIndex);
        // const h = isLowerCase(hintStart)
        //   ? hintStart
        //   : capitalizeFirstLetter(hintStart);
        // const t = isLowerCase(text) ? text : capitalizeFirstLetter(text);
        // const completedWord = h + t;
        addSuggestions([hintStart + text]);
      }
      addSuggestions(suggestions.slice(1, numberOfSuggestions));
    } else {
      addSuggestions([]);
      addHint("");
    }
  }
};
export function isLowerCase(str: string) {
  return str === str.toLowerCase() && str !== str.toUpperCase();
}
export const capitalizeFirstLetter = (s: string) =>
  (s && s[0].toUpperCase() + s.slice(1)) || "";
