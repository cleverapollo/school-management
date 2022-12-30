import { Box } from "@mui/system";
import { GeneralGroupType, SubjectGroupLevelIrePp } from "@tyro/api";
import { capitalize } from "lodash";
import { FC } from "react";
import { TypeOfCustomGroup } from "../../../app/api/generated";

interface IColoredBoxProps {
  content: TypeOfCustomGroup | SubjectGroupLevelIrePp | undefined;
}

const ColoredBox: FC<IColoredBoxProps> = ({ content }) => {
  let backgroundColor;
  let color;

  switch(content){
    case SubjectGroupLevelIrePp.Higher:
    case GeneralGroupType.DynamicGroup: 
      backgroundColor = '#FFF1F2';
      color = '#BE123C';
      break;
    case SubjectGroupLevelIrePp.Ordinary:
    case GeneralGroupType.StaticGroup:
      backgroundColor = '#ECFEFF';
      color = '#0891B2';
      break;
    case SubjectGroupLevelIrePp.Common:
      backgroundColor = 'rgba(255, 193, 7, 0.16)';
      color = '#B78103';
      break;
    default: break;
  }

  return (
    <Box sx={{ padding: '1px 8px', borderRadius: '6px', background: backgroundColor, color: color, width: 'min-content' }}>
      {capitalize(content)}
    </Box>
  );
}

export default ColoredBox;
