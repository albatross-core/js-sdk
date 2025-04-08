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

export const bodyToCSV = (data: Record<string, any>[]) => {
  if (data.length === 0) {
    throw new Error("data is empty");
  }

  const [row0] = data;
  const rowHeaders: string[] = Object.keys(flattenNested(row0));
  return [
    rowHeaders.join(","),
    ...data.map((row) =>
      Object.values(flattenNested(row))
        .map((value) => {
          if (value === null || value === undefined) {
            return "";
          }

          // Handle objects (including arrays)
          if (typeof value === "object") {
            // Convert to JSON string and properly escape for CSV
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }

          if (typeof value === "string") {
            return `"${value.replace(/"/g, '""').replace(/\n/g, "\\n")}"`;
          }

          return value;
        })
        .join(",")
    ),
  ].join("\n");
};
