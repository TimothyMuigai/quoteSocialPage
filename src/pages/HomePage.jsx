import { useState, useEffect } from "react";
import { Randomquotes } from "../Data/randomQoutes";
import QuotesServices from "../context/QuotesServices";
import { getAuth } from "firebase/auth";

function HomePage() {
  const [individualQuote, setIndividual] = useState("");
  const [error, setError] = useState("");
  const [allQuotes, setAllQuotes] = useState([]);
  const [sortByDate, setsort] = useState(true);
  const [category, setCategory] = useState("all");
  const [popular, setPopular] = useState(true);
  const [enableDateSort, setEnableDateSort] = useState(true);
  const [authorFilter, setAuthorFilter] = useState(null);

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

  const [authUser, setAuthUser] = useState()
  // function to display all quotes by users
  useEffect(() => {
    getAllQuotes();
    const auth = getAuth();
    auth.onAuthStateChanged(user => {
      setAuthUser(user);
    });
  }, [sortByDate, category, popular, authorFilter]);

  const getAllQuotes = async () => {
    try {
      const data = await QuotesServices.getAllQuotes();
      let displayQuotes = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        liked: false,
      }));

      if (category !== "all") {
        displayQuotes = displayQuotes.filter(
          (displayQuote) => displayQuote.category === category
        );
      }

      if (authorFilter) {
        displayQuotes = displayQuotes.filter(
          (displayQuote) => displayQuote.userName === authorFilter
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

  const searchAuthor = (author) => {
    setAuthorFilter(author);
  };
  
  const clearAuthorSearch = () => {
    setAuthorFilter(null);
  };

  
  const handleAddToFavorites = async (quote) => {
    if (!authUser) {
      alert("You must be logged in to add quotes to favorites.");
      return;
    }
    
    try {
      
      await QuotesServices.addToFavorites(quote, authUser.uid);
      alert("Quote added to favorites!");
    } catch (error) {
      alert("Failed to add to favorites: " + error.message);
    }
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

  const handleLikeSystem = async (id) => {
    try {
      setAllQuotes((prevQuotes) =>
        prevQuotes.map((quote) =>
          quote.id === id
            ? {
                ...quote,
                likeSystem: quote.liked
                  ? (parseInt(quote.likeSystem) || 0) - 1
                  : (parseInt(quote.likeSystem) || 0) + 1,
                liked: !quote.liked,
              }
            : quote
        )
      );
  
      const currentQuote = allQuotes.find((quote) => quote.id === id);
      const toggle = !currentQuote.liked;
      await QuotesServices.updateLikes(id, toggle);
    } catch (err) {
      setError(err.message);
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
        {authorFilter && (
          <button onClick={clearAuthorSearch} className="clear-search-btn">
            Clear Search
          </button>
        )}
        <div className="quotes-list">
          {allQuotes.map((doc) => (
            <div className="quote-item" key={doc.id}>
              <div className="card-body">
                <div className="card-header">
                  <h2>
                    {doc.userName &&
                      doc.userName.length > 0 &&
                      doc.userName.charAt(0).toUpperCase()}
                  </h2>
                  <p className="category-text">{doc.category} </p>
                  <p className="time">{getTimeDifference(doc.createDate)}</p>
                </div>

                <div className="quote-details">
                  <p className="quote-text courgette-regular">
                    &quot; {doc.quote} &quot;
                  </p>
                  <h4
                    className="quote-author"
                    onClick={() => searchAuthor(doc.userName)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="undefined"
                      className="bubbleIcon"
                    >
                      <path d="M480-840q74 0 139.5 28.5T734-734q49 49 77.5 114.5T840-480q0 74-28.5 139.5T734-226q-49 49-114.5 77.5T480-120q-41 0-79-9t-76-26l61-61q23 8 46.5 12t47.5 4q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 24 4 47.5t12 46.5l-60 60q-18-36-27-74.5t-9-79.5q0-74 28.5-139.5T226-734q49-49 114.5-77.5T480-840Zm40 520v-144L176-120l-56-56 344-344H320v-80h280v280h-80Z" />
                    </svg>
                    {doc.userName &&
                      doc.userName.length > 0 &&
                      doc.userName.charAt(0).toUpperCase() +
                        doc.userName.slice(1)}
                  </h4>
                </div>

                <div className="card-icons" style={{width: authUser && "70%"}}>
                  <p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="loveIcon"
                      width="50"
                      height="50"
                      viewBox="0 0 24 24"
                      onClick={() => handleLikeSystem(doc.id)}
                      style={{
                        fill: doc.liked ? "#ff1b6b" : "#fff",
                      }}
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    {doc.likeSystem}
                  </p>
                  {authUser && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      className="saveIcon"
                      onClick={() =>
                        handleAddToFavorites({
                          author: doc.userName,
                          quote: doc.quote,
                          category: doc.category,
                          userId: doc.id,
                        })
                      }
                    >
                      <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
