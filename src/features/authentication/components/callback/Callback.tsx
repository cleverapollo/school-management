
// ----------------------------------------------------------------------

import useAuth from "../../../../hooks/useAuth";
import LoadingScreen from "../../../../components/LoadingScreen";
import {useMyAuthDetailsQuery} from "../../../../app/api/generated";
import {useNavigate} from "react-router-dom";
import {useDispatch, useTypedSelector} from "../../../../store/store";
import {updateEvent} from "../../../../store/slices/auth";
import {useEffect} from "react";

export default function Callback() {
  const navigate = useNavigate();

  const { postAuthCallback } = useAuth();
  postAuthCallback()

  const globalPolling = useTypedSelector((state) => state.auth);
  useEffect(() => {
    if(globalPolling.activeProfile !== null){
      navigate("/");
    }
  }, [navigate, globalPolling]);

  return (
    <LoadingScreen/>
  );
}
