import React, { createContext, useState, useEffect } from "react";
// import { getAuth, onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext({
  user: false,
  setUser: () => {}
});
const AuthProvider = (props) => {
  // const auth = getAuth();
  // user null = loading
  const [user, setUser] = useState(false);

  useEffect(() => {
    checkLogin();
  }, []);

  function checkLogin() {
    // onAuthStateChanged(auth, (u) => {
    //   // if (u) {
    //   //   setUser(true);
    //   //   // getUserData();
    //   // } else {
    //   //   setUser(false);
    //   //   // setUserData(null);
    //   // }
    // });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
