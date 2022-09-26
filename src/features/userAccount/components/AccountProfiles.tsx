import {Card, Grid, MenuItem, Typography} from "@mui/material";
import {useTypedSelector} from "../../../store/store";
import {Link as RouterLink} from "react-router-dom";
import ProfileCard from "./ProfileCard";
import {Profile} from "../../../app/api/generated";

export default function AccountGeneral() {
  const user =useTypedSelector((state) => state.auth.user);

  return (
      <Grid container spacing={3}>
          {/* {user?.profiles?.map((profile) => (
            <Grid item xs={12} md={4}   key={profile?.id}>
                <ProfileCard key={profile?.id} profile={profile as Profile} />
            </Grid>
          ))} */}

      </Grid>
  );
}
