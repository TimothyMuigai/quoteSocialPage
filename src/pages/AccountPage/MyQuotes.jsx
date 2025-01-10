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

          setError(
            sortByDate
              ? "Sorted by most recent quotes."
              : "Sorted by oldest quotes."
          );
          setTimeout(() => {
            setError("");
          }, 1000);
          if (dateComparison !== 0) {
            return dateComparison;
          }
        }

        setError(
          popular
            ? "Sorted by most liked quotes."
            : "Sorted by least liked quotes."
        );
        setTimeout(() => {
          setError("");
        }, 1000);
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
      <h2 className="quotes-title">Your Posted Quotes</h2>
      <div className="quotes-list">
        {allQuotes.map((doc) => (
          <div className="quote-item" key={doc.id}>
            <hr />
            <p className="quote-text">&quot; {doc.quote} &quot;</p>
            <h2 className="quote-author">--{doc.userName}--</h2>
            <p className="quote-likes">Likes: {doc.likeSystem}</p>
            <p className="quote-timestamp">{doc.postTimeLine}</p>
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
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyQuotes;
