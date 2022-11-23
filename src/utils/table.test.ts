import { OPTIONS_COLUMN_NAME, SYSTEM_HIDED_COLUMN_NAME } from "../components/table/constants";
import { TitleOverride } from "../components/table/types";
import {
  createTitleForProfileTypes,
  createFormattedStringForDayjs,
  checkIsColumnRenderNeeded,
  checkIsColumnForTechnicalOptions 
} from "./table";

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


describe("test checkIsColumnRenderNeeded", () => {
  const exampleColumnName = 'Teacher';
  const anotherExampleColumnName = 'Tutor';

  test("should return false if this is incorrect column name", () => {
    expect(checkIsColumnRenderNeeded(exampleColumnName)).toBe(true);
    expect(checkIsColumnRenderNeeded(anotherExampleColumnName)).toBe(true);
  });

  test("should return true if this is correct column name", () => {
    expect(checkIsColumnRenderNeeded(SYSTEM_HIDED_COLUMN_NAME)).toBe(false);
  });
});


describe("test checkIsColumnForTechnicalOptions", () => {
  const exampleColumnName = 'Teacher';
  const anotherExampleColumnName = 'Tutor';

  test("should return false if this is incorrect column name", () => {
    expect(checkIsColumnForTechnicalOptions(exampleColumnName)).toBe(false);
    expect(checkIsColumnForTechnicalOptions(anotherExampleColumnName)).toBe(false);
  });

  test("should return true if this is correct column name", () => {
    expect(checkIsColumnForTechnicalOptions(OPTIONS_COLUMN_NAME)).toBe(true);
  });
});