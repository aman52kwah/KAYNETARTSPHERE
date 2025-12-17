import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const GoogleLoginButton =()=>{
    return (
<GoogleLogin
onSuccess={async(credentialResponse)=>{
    try {
        const res= await axios.get(`${import.meta.env.REACT_APP_BACKEND_URL}/auth/google`,
            {
                params:{credential: credentialResponse.credential},
                withCredentials:true
            }
        );
        console.log('Login Successful',res.data);
        
    } catch (error) {
        console.error('Login Failed',error);
    }
}}
onError={()=>console.log('login failed')}
/>
)
};

export default GoogleLoginButton;