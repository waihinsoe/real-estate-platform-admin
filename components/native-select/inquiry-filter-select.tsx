"use client";

import { GenericSelect, type GenericSelectProps } from "./generic-select";
import {
  INQUIRY_STATUSES,
  INQUIRY_TYPES,
  INQUIRY_SOURCES,
  type InquiryStatus,
  type InquiryType,
  type InquirySource,
} from "@/types/inquiry";

const options = <T extends string>(values: readonly T[]) =>
  values.map((value) => ({
    value,
    label: value.charAt(0) + value.slice(1).toLowerCase().replaceAll("_", " "),
  }));
type Props<T extends string> = Omit<
  GenericSelectProps<T>,
  "options" | "placeholder" | "label"
>;

export function InquiryStatusSelect(props: Props<InquiryStatus>) {
  return (
    <GenericSelect
      {...props}
      label="Status"
      placeholder="All statuses"
      options={options(INQUIRY_STATUSES)}
    />
  );
}
export function InquiryTypeSelect(props: Props<InquiryType>) {
  return (
    <GenericSelect
      {...props}
      label="Inquiry type"
      placeholder="All inquiry types"
      options={options(INQUIRY_TYPES)}
    />
  );
}
export function InquirySourceSelect(props: Props<InquirySource>) {
  return (
    <GenericSelect
      {...props}
      label="Source"
      placeholder="All sources"
      options={options(INQUIRY_SOURCES)}
    />
  );
}
