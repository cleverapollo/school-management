
// ----------------------------------------------------------------------

import useAuth from "../../../../hooks/useAuth";

export default function Callback() {
  const { postAuthCallback } = useAuth();

  postAuthCallback()

  return (
    <div >
     hello
    </div>
  );
}
