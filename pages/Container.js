import React, { useEffect } from "react";
import { useRouter } from "next/router";
import cookie from "js-cookie";
import Api from "../src/api";

const Index = props => {
  const token = cookie.get("token");
  const router = useRouter();

  useEffect(() => {
    const pathname = router.pathname;
    if (!token || token == null) {
      if (pathname !== "/pages/login") {
        router.push("/pages/login");
      }
    } else {
      _checkToken(0, 1);
    }
  }, []);

  const _checkToken = (page, counts) => {
    // Api.Branches.all(page, counts).then((res)=>{
    //   if(res.statusCode !== 200){
    //       if(res.data.message === "Invalid Token"){
    //         router.push('/pages/logout');
    //       }
    //   }
    // });
  };

  return <>{props.children}</>;
};

export default Index;
