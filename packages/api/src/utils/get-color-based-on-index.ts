import { Colour } from '../gql/graphql';

export const ColorOptions = [
  Colour.Red,
  Colour.Orange,
  Colour.Amber,
  Colour.Green,
  Colour.Emerald,
  Colour.Teal,
  Colour.Cyan,
  Colour.Sky,
  Colour.Blue,
  Colour.Violet,
  Colour.Fuchsia,
];

export function getColorBasedOnIndex(index: number) {
  const indexColorShift =
    index % 2 === 0 ? index : index + Math.floor(ColorOptions.length / 2);
  return ColorOptions[indexColorShift % ColorOptions.length];
}
