import { useState, useEffect } from "react";
import QuotesServices, { QuotesCollection } from "../../context/QuotesServices";
import { auth } from "../../context/FirebaseConfig";
import { query, where } from "firebase/firestore";

// eslint-disable-next-line react/prop-types
function MyQuotes({ getQuoteID,refreshFlag }) {
  const [error, setError] = useState("");
  const [allQuotes, setAllQuotes] = useState([]);
  const [sortByDate, setsort] = useState(true);
  const [category, setCategory] = useState("all");
  const [popular, setPopular] = useState(true);
  const [enableDateSort, setEnableDateSort] = useState(true);

  useEffect(() => {
    getAllQuotes();
  }, [sortByDate, category, popular,refreshFlag]);

  const getAllQuotes = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setError("User not logged in");
        return;
      }

      const q = query(QuotesCollection, where("userId", "==", userId));
      const data = await QuotesServices.getAllQuotes(q);

      let displayQuotes = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      if (category !== "all") {
        displayQuotes = displayQuotes.filter(
          (displayQuote) => displayQuote.category === category
        );
      }

      displayQuotes.sort((a, b) => {
        if (enableDateSort) {
          const dateComparison = sortByDate
            ? new Date(b.createDate) - new Date(a.createDate)
            : new Date(a.createDate) - new Date(b.createDate);

          
          if (dateComparison !== 0) {
            return dateComparison;
          }
        }

        
        return popular
          ? b.likeSystem - a.likeSystem
          : a.likeSystem - b.likeSystem;
      });

      setAllQuotes(displayQuotes);
    } catch (err) {
      setError("Failed to fetch quotes data.", err);
    }
    
  };

  const deleteHandler = async (id) => {
    await QuotesServices.deleteQuote(id);
    getAllQuotes();
    setError("Deleted successfully!");
    setTimeout(() => {
      setError("");
    }, 3000);
  };
  const getTimeDifference = (createDate) => {
      const now = new Date();
      const createdAt = new Date(createDate);
      const diffInSeconds = Math.floor((now - createdAt) / 1000);

      if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)} min ago`;
      if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 604800)
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
      if (diffInSeconds < 2592000)
        return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
      if (diffInSeconds < 31536000)
        return `${Math.floor(diffInSeconds / 2592000)} months ago`;
      return `${Math.floor(diffInSeconds / 31536000)} years ago`;
    };

  return (
    <div className="my-quotes">
      <div className="sorting-components">
        <div className="sort-buttons">
          <button
            onClick={() => {
              setEnableDateSort(true);
              setsort((prev) => !prev);
            }}
            className="sort-button"
          >
            Sort By {sortByDate ? "Oldest" : "Most Recent"}
          </button>
          <button
            onClick={() => {
              setEnableDateSort(false);
              setPopular((prev) => !prev);
            }}
            className="sort-button"
          >
            Sort By {popular ? "Least Liked" : "Most Liked"}
          </button>
        </div>
        <div className="category-filter">
          <label htmlFor="categoryFilter">Filter by Category:</label>
          <select
            id="categoryFilter"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="category-select"
          >
            <option value="all">All</option>
            <option value="joke">Joke</option>
            <option value="happiness">Happiness</option>
            <option value="joy">Joy</option>
            <option value="life">Life</option>
            <option value="love">Love</option>
            <option value="success">Success</option>
            <option value="motivation">Motivation</option>
            <option value="friendship">Friendship</option>
            <option value="courage">Courage</option>
            <option value="wisdom">Wisdom</option>
            <option value="gratitude">Gratitude</option>
            <option value="change">Change</option>
            <option value="hope">Hope</option>
            <option value="strength">Strength</option>
          </select>
        </div>
      </div>

      {error && <h3 className="error-message">{error}</h3>}
      <h2 className="quotes-title">{allQuotes.length === 0?"You have No quotes":"Your Posted Quotes"}</h2>

      <div className="quotes-list">
        {allQuotes.map((doc) => (
          
          <div className="quote-item" key={doc.id}>
            <div className="card-body">

              <div className="card-header">
                  <p className="category-text">{doc.category} </p>
                  <p className="time">Created {getTimeDifference(doc.createDate)}</p>
              </div>
              <div className="quote-details">
                <p className="quote-text courgette-regular">
                  &quot; {doc.quote} &quot;
                </p>
              </div>
              <div className="card-icons">
                  <p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="loveIcon"
                      width="50"
                      height="50"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    {doc.likeSystem}
                  </p>
                </div>
            </div>
            <button
              onClick={() => getQuoteID(doc.id)}
              className="edit-quote-button"
            >
              Edit Quote
            </button>
            <button
              onClick={() => deleteHandler(doc.id)}
              className="delete-quote-button"
            >
              Delete Quote
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyQuotes;
