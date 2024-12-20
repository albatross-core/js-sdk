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
