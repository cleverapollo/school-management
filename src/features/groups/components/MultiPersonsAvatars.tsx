import {Avatar, AvatarGroup, BreadcrumbsProps, Stack} from "@mui/material";
import {PartyPerson} from "../../../app/api/generated";
import {Person} from '@tyro/api/src/gql/graphql'
import {displayName} from "../../../utils/nameUtils";

export interface Props  {
  person: Person | [Person] | undefined;
}

export default function MultiPersonsAvatars({person}: Props) {

  if(person == null || (Array.isArray(person) && !person.length)){
    return <Stack
        direction="row"
        spacing={2}
    >
      <span>-</span>
    </Stack>
  }

  else if(Array.isArray(person)){
    return (
        <Stack
            direction="row"
            spacing={1}
            alignItems="center"
        >
          <AvatarGroup max={1} spacing={10}>
            {person?.map(p => {
              return   <Avatar alt={displayName(p)} src={p.avatarUrl || ''}/>

            })}
          </AvatarGroup>
            <span >{displayName(person[0])}</span>
        </Stack>
    );

  } else {
    return (
        <Stack
            direction="row"
            spacing={1}
            alignItems="center"
        >
          <Avatar />
          <span>{displayName(person)}</span>
        </Stack>
    )
  }


}
