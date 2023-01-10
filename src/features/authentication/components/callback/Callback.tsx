
// ----------------------------------------------------------------------

import LoadingScreen from "../../../../components/LoadingScreen";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import { useUser } from "@tyro/api";

export default function Callback() {
  const navigate = useNavigate();
  const { activeProfile } = useUser();

  useEffect(() => {
    if(activeProfile !== null){
      navigate("/");
    }
  }, [navigate, activeProfile]);

  return (
    <LoadingScreen/>
  );
}
