import { useState, useEffect } from "react";
import QuotesServices from "../../context/QuotesServices";
import { auth } from "../../context/FirebaseConfig";
import { UseUserAuth } from "../../context/UserAuthContext";

// eslint-disable-next-line react/prop-types
function NewQuotes({ id, setQuoteId, refreshQuotes }) {
  const [quote, setQuote] = useState("");
  const [category, setCategory] = useState("");
  const [likeSystem, setLikeSystem] = useState(0);
  const [, setCreateDate] = useState(new Date());
  const [toggleOperation, setToggle] = useState(true);
  const [message, setMessage] = useState({ error: false, msg: "" });
  const [postTimeLine, setPosttimeLine] = useState("");
  const [userName, setUserName] = useState("");
  const { user } = UseUserAuth();

  useEffect(() => {
    if (user && user.email) {
      const email = user.email;
      const result = email.split("@")[0];
      setUserName(result);
    }
  }, [user]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (quote === "" || category === "") {
      setMessage({ error: true, msg: "Fill in all inputs!" });
      return;
    }

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const date = currentDate.getDate();

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec",
    ];
    const month = months[currentDate.getMonth()];

    const days = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
    ];
    const day = days[currentDate.getDay()];

    let hours = currentDate.getHours();
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const meridiem = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const timeline = `${day}, ${month} ${date}, ${year} at ${hours}:${minutes} ${meridiem}`;
    console.log(postTimeLine);
    const newQuoteText = {
      quote,
      category,
      likeSystem,
      createDate: currentDate.toISOString(),
      postTimeLine: timeline,
      userId: auth.currentUser?.uid,
      userName
    };

    try {
      if (id !== undefined && id !== "") {
        await QuotesServices.updateQuote(id, newQuoteText);
        setQuoteId("");
        setMessage({ error: false, msg: "Updated successfully!" });
        setToggle(true);
        setTimeout(() => {
          setMessage("");
        }, 3000);
      } else {
        await QuotesServices.addQuotes(newQuoteText);
        setMessage({ error: false, msg: "Your quote has been posted" });
        setTimeout(() => {
          setMessage("");
        }, 3000);
      }
      refreshQuotes();
    } catch (err) {
      setMessage({ error: true, msg: err.message });
    }

    setCategory("");
    setQuote("");
  };

  const editHandler = async () => {
    setMessage("");
    setToggle(false);
    
    try {
      const documentSnap = await QuotesServices.getQuote(id);
      setCategory(documentSnap.data().category);
      setQuote(documentSnap.data().quote);
      setCreateDate(new Date(documentSnap.data().createDate));
      setLikeSystem(documentSnap.data().likeSystem);
      setPosttimeLine(documentSnap.data().postTimeLine);
    } catch (err) {
      setMessage({ error: true, msg: err.message });
    }
  };

  const cancelHandler = () => {
    setToggle(true);
    setQuote("");
    setCategory("");
    setMessage("");
  };

  useEffect(() => {
    if (id !== undefined && id !== "") {
      editHandler();
    }
  }, [id]);

  return (
    <div className="new-quote-container">
      {toggleOperation ? <h1 className="form-title">Post a quote</h1> : <h1 className="form-title">Edit Post</h1>}
      
      <div className="message-container">
        {message?.msg && <h1 className={`message ${message.error ? 'error' : 'success'}`}>{message.msg}</h1>}
      </div>

      <form onSubmit={handlePostSubmit} className="quote-form">
        <label htmlFor="txtQuote" className="input-label">
          Enter quote:
          <input
            type="text"
            id="txtQuote"
            value={quote}
            placeholder="Enter quote"
            onChange={(e) => setQuote(e.target.value)}
            className="input-field"
          />
        </label>

        <label htmlFor="txtCategory" className="input-label">
          Enter category:
          <input
            type="text"
            id="txtCategory"
            value={category}
            placeholder="Enter category"
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          />
        </label>

        {!toggleOperation && (
          <label htmlFor="Likes" className="input-label">
            Number of likes:
            <input
              type="number"
              id="likes"
              value={likeSystem}
              onChange={(e) => setLikeSystem(e.target.value)}
              className="input-field"
            />
          </label>
        )}
        {!toggleOperation && <button type="button" className="cancel-button" onClick={()=>cancelHandler()}>
              Cancel
            </button>}
        <button type="submit" className="submit-button">
          {toggleOperation ? "Post quote" : "Save Edited quote"}
        </button>
      </form>
    </div>
  );
}

export default NewQuotes;
