import { TitleOverride } from "../components/table/types";
import { createTitleForProfileTypes } from "./table";

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
