
// ----------------------------------------------------------------------

import useAuth from "../../../../hooks/useAuth";
import LoadingScreen from "../../../../components/LoadingScreen";
import {useMyAuthDetailsQuery} from "../../../../app/api/generated";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useTypedSelector} from "../../../../store/store";
import {selectActiveProfile} from "../../../../store/slices/auth";

export default function Callback() {
  const navigate = useNavigate();

  const { postAuthCallback } = useAuth();

  postAuthCallback()
  if(localStorage.getItem('accessToken') == null){
    return (<LoadingScreen></LoadingScreen>)
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dispatch = useDispatch();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const globalPolling = useTypedSelector(selectActiveProfile);
  console.log('===========')
  console.log(globalPolling)
  if(globalPolling == null){
    return (<LoadingScreen></LoadingScreen>)
  }



  if(globalPolling != null){
    console.log('---------')
    console.log(globalPolling)
    navigate("/dashboard");
  }

  return (
    <LoadingScreen/>
  );
}
