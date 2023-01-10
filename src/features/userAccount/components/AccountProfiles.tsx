import { Grid} from "@mui/material";
import ProfileCard from "./ProfileCard";
import { useUser, Profile } from "@tyro/api";

export default function AccountGeneral() {
  const { user } = useUser();

  return (
    <Grid container spacing={3}>
      {user?.profiles?.map((profile) => (
        <Grid item xs={12} md={4} key={profile?.id}>
          <ProfileCard key={profile?.id} profile={profile as Profile} />
        </Grid>
      ))}

    </Grid>
  );
}
