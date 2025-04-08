import { describe, expect, it } from "bun:test";
import { bodyToCSV } from "./utils";

describe("bodyToCSV", () => {
  it("should convert simple object array to CSV", () => {
    const input = [
      { name: "John Doe", age: 30, active: true },
      { name: "Jane Smith", age: 25, active: false },
    ];

    const expectedCSV =
      '"name","age","active"\n' +
      '"John Doe","30","true"\n' +
      '"Jane Smith","25","false"';

    const result = bodyToCSV(input);
    expect(result).toBe(expectedCSV);
  });

  it("should handle nested objects", () => {
    const input = [
      {
        name: "John Doe",
        details: {
          age: 30,
        },
        address: {
          city: "New York",
          zip: "10001",
        },
      },
    ];

    const expectedCSV =
      '"name","details_age","address_city","address_zip"\n' +
      '"John Doe","30","New York","10001"';

    const result = bodyToCSV(input);
    expect(result).toBe(expectedCSV);
  });

  it("should handle null and undefined values", () => {
    const input = [
      { name: "John Doe", age: null, active: undefined },
      { name: "Jane Smith", age: 25, active: true },
    ];

    const expectedCSV =
      '"name","age","active"\n' +
      '"John Doe","",""\n' +
      '"Jane Smith","25","true"';

    const result = bodyToCSV(input);
    expect(result).toBe(expectedCSV);
  });

  it("should handle arrays and complex objects", () => {
    const input = [
      {
        name: "John Doe",
        hobbies: ["reading", "cycling"],
        details: { tags: ["admin", "user"] },
      },
    ];

    const expectedCSV =
      '"name","hobbies","details_tags"\n' +
      '"John Doe","reading,cycling","admin,user"';

    const result = bodyToCSV(input);
    expect(result).toBe(expectedCSV);
  });

  it("should throw an error for empty input", () => {
    expect(() => bodyToCSV([])).toThrow("data is empty");
  });
});
