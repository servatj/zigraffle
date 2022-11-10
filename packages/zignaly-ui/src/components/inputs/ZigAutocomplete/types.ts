import { LabelActionProps } from "../ZigInput/types";
import { AutocompleteProps } from "@mui/material/Autocomplete/Autocomplete";
import React from "react";

export type ZigAutocompleteProps<T> = Omit<
  AutocompleteProps<T, undefined, true, undefined>,
  "renderInput"
> & {
  label?: string | JSX.Element;
  disablePortal?: boolean;
  error?: boolean | string;
  wide?: boolean;
  labelAction?: LabelActionProps;
};
