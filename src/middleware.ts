import { auth } from "./auth";

export default auth(async(req)=>{
    const isLoggedIn = !!req.auth
    console.log(isLoggedIn);
})