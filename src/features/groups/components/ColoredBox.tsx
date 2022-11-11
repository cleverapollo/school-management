import { Box } from "@mui/system";
import { capitalize } from "lodash";
import { FC } from "react";
import { SubjectGroupLevel, TypeOfCustomGroup } from "../../../app/api/generated";
import { CUSTOM_GROUP_TYPE, SUBJECT_GROUP_LEVEL } from "../../../constants";

interface IColoredBoxProps {
  content: TypeOfCustomGroup | SubjectGroupLevel | undefined;
}

const ColoredBox: FC<IColoredBoxProps> = ({ content }) => {
  let backgroundColor;
  let color;

  switch(content){
    case SUBJECT_GROUP_LEVEL.HIGHER:
    case CUSTOM_GROUP_TYPE.DYNAMIC: 
      backgroundColor = '#FFF1F2';
      color = '#BE123C';
      break;
    case SUBJECT_GROUP_LEVEL.ORDINARY:
    case CUSTOM_GROUP_TYPE.STATIC:
      backgroundColor = '#ECFEFF';
      color = '#0891B2';
      break;
    case SUBJECT_GROUP_LEVEL.COMMON:
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
