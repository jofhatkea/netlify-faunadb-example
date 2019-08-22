import React, { useState } from "react";
import "react-netlify-identity-widget/styles.css";
import {
  useIdentityContext,
  IdentityContextProvider
} from "react-netlify-identity-widget";

// code split the modal til you need it!
const IdentityModal = React.lazy(() => import("react-netlify-identity-widget"));

export default function Login() {
  const [dialog, setDialog] = useState(false);
  const identity = useIdentityContext();
  const isLoggedIn = identity && identity.isLoggedIn;
  return (
    <div className="App">
      <button className="btn" onClick={() => setDialog(true)}>
        {isLoggedIn ? "LOG OUT" : "LOG IN"}
      </button>
      <React.Suspense fallback="loading...">
        <IdentityModal
          showDialog={dialog}
          onCloseDialog={() => setDialog(false)}
        />
      </React.Suspense>
    </div>
  );
}
