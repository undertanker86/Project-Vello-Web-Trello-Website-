import React from "react";
import { useSearchParams, Navigate } from 'react-router-dom'
import LinearProgress from '@mui/material/LinearProgress';
import { verifyUserAPI } from '../../apis/index'
function AccountVerification() {

  // Get email and token from URL
  let [searchParams] = useSearchParams()
  const { email, token } = Object.fromEntries([...searchParams])

  // Create State to know the status of the verification
  const [isVerified, setIsVerified] = React.useState(false)

  // Call API to verify the account
  React.useEffect(() => {
    if(email && token) {
      verifyUserAPI({email, token})
      .then(() => {
        setIsVerified(true)
      })
      .catch(() => {
        setIsVerified(false)
      })
    }
  }, [email, token])


  if(!email || !token) {
    return <Navigate to="/404" />
  }
  if(!isVerified) {
    return <LinearProgress />
  }

  return (
    <Navigate to={`/login?verifiedEmail=${email}`}/>
  );
}

export default AccountVerification;