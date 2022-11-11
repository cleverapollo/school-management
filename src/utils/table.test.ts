import { TitleOverride } from "../components/table/types";
import { createTitleForProfileTypes, createFormattedStringForDayjs } from "./table";

describe("test createTitleForProfileTypes", () => {
  const exampleProfileType = 'Teacher';
  const exampleProfileTypeWithoutOverride = 'Principal';
  const exampleTitle = 'Example title';
  const exampleTitleOverride: TitleOverride[] = [{ Teacher: 'Example table for teacher' }];

  test("should return generalTitle if no titleOverride or array is empty", () => {
    expect(createTitleForProfileTypes(exampleProfileType, undefined, exampleTitle)).toBe(exampleTitle);
    expect(createTitleForProfileTypes(exampleProfileType, [], exampleTitle)).toBe(exampleTitle);
  });

  test("should return generalTitle if no correct keys in titleOverride array", () => {
    expect(createTitleForProfileTypes(exampleProfileTypeWithoutOverride, exampleTitleOverride, exampleTitle)).toBe(exampleTitle);
  });

  test("should return title from titleOverride for correct profileType", () => {
    expect(createTitleForProfileTypes(exampleProfileType, exampleTitleOverride, exampleTitle)).toBe(exampleTitleOverride[0][exampleProfileType]);
  });
});


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
