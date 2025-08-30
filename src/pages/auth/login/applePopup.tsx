// ApplePopup.js
import React, { useEffect } from "react";

const ApplePopup = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.AppleID) {
        window.AppleID.auth.init({
          clientId: "com.muvello.ios1",
          scope: "name email",
          redirectURI: "https://yourdomain.com/api/v1/auth/apple-callback", // must match Apple Developer Console
        });

        window.AppleID.auth
          .signIn()
          .then((response) => {
            window.opener.postMessage(
              {
                id_token: response.authorization.id_token,
                code: response.authorization.code,
              },
              "https://yourdomain.com" // must match main app origin
            );
            window.close();
          })
          .catch((err) => {
            console.error("Apple login error:", err);
            window.close();
          });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <p>Logging in with Apple...</p>;
};

export default ApplePopup;
