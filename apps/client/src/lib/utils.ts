import type { Selection } from "@heroui/react";

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const normalizeSelectionValue = (selection: Selection): string => {
  if (Array.isArray(selection)) {
    return selection.length > 0 ? selection[0].toString() : "";
  }

  if (typeof selection === "string") {
    return selection;
  }

  return "";
};
