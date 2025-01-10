import { useState, useEffect } from "react";
import { Randomquotes } from "../Data/randomQoutes";
import QuotesServices from "../context/QuotesServices";

function HomePage() {
  const [individualQuote, setIndividual] = useState("");
  const [error, setError] = useState("");
  const [allQuotes, setAllQuotes] = useState([]);
  const [sortByDate, setsort] = useState(true);
  const [category, setCategory] = useState("all");
  const [popular, setPopular] = useState(true);
  const [enableDateSort, setEnableDateSort] = useState(true);

  // function to display random quotes
  function displayData(data) {
    const quoteData = [...data];
    for (let i = quoteData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [quoteData[i], quoteData[j]] = [quoteData[j], quoteData[i]];
    }
    return quoteData;
  }

  useEffect(() => {
    let currentIndex = 0;
    let randomData = displayData(Randomquotes);

    function getNextQuote() {
      if (currentIndex >= randomData.length) {
        randomData = displayData(Randomquotes);
        currentIndex = 0;
      }
      const quote = randomData[currentIndex];
      currentIndex++;
      setIndividual(quote);
    }
    const intervalId = setInterval(getNextQuote, 20000);
    return () => clearInterval(intervalId);
  }, []);

  // function to display all quotes by users
  useEffect(() => {
    getAllQuotes();
  }, [sortByDate, category, popular]);

  const getAllQuotes = async () => {
    try {
      const data = await QuotesServices.getAllQuotes();
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
          }, 3000);
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
        }, 3000);
        return popular
          ? b.likeSystem - a.likeSystem
          : a.likeSystem - b.likeSystem;
      });

      setAllQuotes(displayQuotes);
    } catch (err) {
      setError("Failed to fetch quotes data.", err);
    }
  };

  const handleLikeSystem = async (id) => {
    try {
      await QuotesServices.updateLikes(id);
      setAllQuotes((prevQuotes) =>
        prevQuotes.map((quote) =>
          quote.id === id
            ? { ...quote, likeSystem: (parseInt(quote.likeSystem) || 0) + 1 }
            : quote
        )
      );
    } catch (err) {
      console.error("Failed to update likes:", err);
      setError("Failed to update likes. Please try again later.");
    }
  };

  return (
    <div className="home-page">
      <div className="random-quote">
        {individualQuote ? (
          <>
            <p className="quote-text">&quot;{individualQuote.text}&quot;</p>
            <h2 className="quote-author">
              <em>--{individualQuote.author}--</em>
            </h2>
          </>
        ) : (
          <>
            <p className="quote-text">
              &quot; Getting started is easy just choose your Category and the
              fun begins &quot;
            </p>
            <h2 className="quote-author">--TTM Programmer--</h2>
          </>
        )}
      </div>
      <div className="all-quotes">
        <h2 className="quotes-heading">
          Inspiring Quotes from other contributors
        </h2>

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

        <div className="quotes-list">
          {allQuotes.map((doc) => (
            <div className="quote-item" key={doc.id}>
              <hr />
              <button className="add-to-favorite">Add to favourite</button>
              <div className="quote-details">
                <button
                  className="like-button"
                  onClick={() => handleLikeSystem(doc.id)}
                >
                  Like
                </button>
                <p className="quote-text">&quot; {doc.quote} &quot;</p>
                <h2 className="quote-author">quote by --{doc.userName}--</h2>
                <p className="quote-likes">Likes: {doc.likeSystem}</p>
                <p className="quote-timestamp">{doc.postTimeLine}</p>
              </div>
              <hr />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
