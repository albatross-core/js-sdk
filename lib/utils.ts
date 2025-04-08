import { stringify } from "csv-stringify/sync";

interface NestedObject {
  [key: string]: any;
  nest?: Record<string, any>;
}

type FlattenedObject = {
  [key: string]: string | number | boolean | null;
};

export function flattenNested(obj: NestedObject): FlattenedObject {
  const result: FlattenedObject = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === "object" && !Array.isArray(value) && value !== null) {
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        if (Array.isArray(nestedValue)) {
          result[`${key}_${nestedKey}`] = nestedValue.join(",");
        } else if (typeof nestedValue === "object" && nestedValue !== null) {
          Object.entries(nestedValue).forEach(([subKey, subValue]) => {
            result[`${nestedKey}_${subKey}`] = subValue;
          });
        } else {
          (result as any)[`${key}_${nestedKey}`] = nestedValue;
        }
      });
    } else if (Array.isArray(value)) {
      result[key] = value.join(",");
    } else {
      result[key] = value;
    }
  });

  return result;
}

const preFormatRow = (row: Record<string, any>) =>
  Object.values(flattenNested(row)).map((value) => {
    // Handle null/undefined
    if (value === null || value === undefined) {
      return "";
    }

    // Handle objects (including arrays)
    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    // Convert to string for other types
    return String(value);
  });

export const bodyToCSV = (data: Record<string, any>[]) => {
  if (data.length === 0) {
    throw new Error("data is empty");
  }

  const [row0] = data;
  const rowHeaders: string[] = Object.keys(flattenNested(row0));
  // Prepare data for csv-parse
  const csvData = [rowHeaders, ...data.map(preFormatRow)];

  return stringify(csvData, {
    delimiter: ",",
    quote: true,
    quoted_string:true,
    header: false,
  }).trim();
};
