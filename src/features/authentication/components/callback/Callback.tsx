
// ----------------------------------------------------------------------

import useAuth from "../../../../hooks/useAuth";
import LoadingScreen from "../../../../components/LoadingScreen";
import {useMyAuthDetailsQuery} from "../../../../app/api/generated";
import {useNavigate} from "react-router-dom";

export default function Callback() {
  const navigate = useNavigate();

  const { postAuthCallback } = useAuth();

  postAuthCallback()
  if(localStorage.getItem('accessToken') == null){
    return (<LoadingScreen></LoadingScreen>)
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, isLoading, isFetching } = useMyAuthDetailsQuery()




  if(data != null){
    console.log('---------')
    console.log(data)
    navigate("/dashboard");
  }

  return (
    <div >
     hello
    </div>
  );
}
