import { useState } from "react";
import MyQuotes from "../pages/AccountPage/MyQuotes";
import NewQuotes from "../pages/AccountPage/NewQuotes";
import { UseUserAuth } from "../context/UserAuthContext";

function DataLayout() {
  const [quoteId, setQuoteId] = useState("");

  const getQuoteIDHandler = (id) => {
    setQuoteId(id);
  };

  const { logOut } = UseUserAuth();
  const handleLogOut = async () => {
    try {
      await logOut();
    } catch (err) {
      console.log(err.message);
    }
  };

  const { user } = UseUserAuth();
  let result = "";
  if (user && user.email) {
    const email = user.email;
    result = email.split("@")[0];
  }

  return (
    <div className="data-layout-container">
      <button onClick={handleLogOut} className="logout-button">Log out</button>
      <h1 className="welcome-message">Welcome {result}</h1>
      <hr className="divider" />
      
      <NewQuotes id={quoteId} setQuoteId={setQuoteId} className="new-quote-form" />
      <hr className="divider" />
      
      
      <MyQuotes getQuoteID={getQuoteIDHandler} className="my-quotes-list" />
    </div>
  );
}

export default DataLayout;
