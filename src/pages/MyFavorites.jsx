import { useEffect, useState } from "react"
import QuotesServices from "../context/QuotesServices";
import { auth } from "../context/FirebaseConfig";


function MyFavorites() {
  const [allQuotes,setFavorites] = useState([]);
  const [ErrorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    fetchFavorites();
  }, []);
  
  const fetchFavorites = async () => {
    try {
      const userId = auth.currentUser?.uid;
      const favorites = await QuotesServices.getUserFavorites(userId);
      setFavorites(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };
  const deleteHandler = async (id)=>{
    await QuotesServices.deleteFromFavorites(id);
    fetchFavorites();
    setErrorMsg("Removed from favourites");
  };

  return (
    <div>
      <h1>My Favorite Quotes</h1>
      {ErrorMsg && <h3 className="error-message">{ErrorMsg}</h3>}
      <div className="quotes-list">
        {allQuotes.length > 0 ? (
          allQuotes.map((quote) => (
            <div className="quote-item" key={quote.id}>
              <div className="card-body">
                <div className="card-header">
                  <h2>
                    {quote.author && quote.author.length>0 &&
                    quote.author.charAt(0).toUpperCase()}
                  </h2>
                  <p className="category-text">{quote.category}</p>
                </div>

                <div className="quote-details">
                  <p className="quote-text courgette-regular">
                    &quot; {quote.quote} &quot;
                  </p>
                  <h4 className="quote-author">
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
                    {quote.author && quote.author.length>0 &&
                    quote.author.charAt(0).toUpperCase()+quote.author.slice(1)}
                  </h4>
                </div>

                <div className="card-icons" style={{width:"6%"}}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed" className="deleteIcon" onClick={()=>deleteHandler(quote.id)}>
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                  </svg>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No favorites yet.</p>
        )}
        </div>
    </div>
  );
  
}

export default MyFavorites