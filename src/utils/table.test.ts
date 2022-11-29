import { createFormattedStringForDayjs } from "./table";

describe("test createFormattedStringForDayjs", () => {
  const exampleWrongString = '09/10/2022';
  const exampleDateString = '09.10.2022';

  test("should return initial value if it's wrong string for formatting", () => {
    expect(createFormattedStringForDayjs(exampleWrongString)).toBe(exampleWrongString);
  });

  test("should return formatted string if we passed correct value", () => {
    expect(createFormattedStringForDayjs(exampleDateString)).toBe('10.09.2022');
  });
});
