export const findAndSort = (items: string[], text: string): string[] =>
  Array.from(new Set(items))
    .filter((d) => d) // remove undefined
    .filter((d) => typeof d === "string")
    .filter((item) =>
      Object.values(item)
        .join("")
        .trim()
        .toLowerCase()
        .includes(text.toLowerCase())
    )
    .sort((a: string, b: string) => b.localeCompare(a))
    .sort((a: string, b: string) => {
      if (a.length > b.length) {
        return 1;
      } else if (a.length < b.length) {
        return -1;
      } else return 0;
    });
