  import { collection, increment } from "firebase/firestore";
  import { db } from "./FirebaseConfig"
  import { getDocs } from "firebase/firestore";
  import { addDoc } from "firebase/firestore";
  import { getDoc } from "firebase/firestore";
  import { updateDoc } from "firebase/firestore";
  import { deleteDoc } from "firebase/firestore";
  import { doc } from "firebase/firestore";

  export const QuotesCollection = collection (db, "quotes");
  export const FavouriteCollection = collection (db, "favorites");

  const QuotesServices={
      addQuotes: (newQuoteText) => {
          return addDoc(QuotesCollection, newQuoteText);
        },
      getAllQuotes: (q) => {
        return getDocs( q || QuotesCollection);
      },
      getQuote: (id)=>{
          const quoteText = doc(db, "quotes", id)
          return getDoc(quoteText);
      },
      updateQuote: (id, updatedQuote) => {
        const quoteText = doc(db, "quotes", id);
        return updateDoc(quoteText, updatedQuote)
      },
      deleteQuote: (id) =>{
        const quoteText = doc(db, "quotes", id);
        return deleteDoc(quoteText);
      },
      updateLikes: (id, toggle) => {
        const quoteText = doc(db, "quotes", id);
        return updateDoc(quoteText, {
          likeSystem: increment(toggle ? 1 : -1),
        });
      },

      addToFavorites: async (quote, userId) => {
        try {
          const snapshot = await getDocs(FavouriteCollection);
          const isAlreadyFavorited = snapshot.docs.some(
            (doc) =>
              doc.data().quote === quote.quote &&
              doc.data().author === quote.author &&
              doc.data().userId === userId
          );
      
          if (!isAlreadyFavorited) {
            return await addDoc(FavouriteCollection, {
              ...quote,
              userId,
            });
          } else {
            throw new Error("Quote already exists in favorites.");
          }
        } catch (error) {
          console.error("Failed to add to favorites:", error);
          throw error;
        }
      },
      getUserFavorites: async (userId) => {
        try {
          const snapshot = await getDocs(FavouriteCollection);
          return snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((favorite) => favorite.userId === userId);
        } catch (error) {
          console.error("Failed to fetch user favorites:", error);
          throw error;
        }
      },       
      deleteFromFavorites: async (id) => {
        try {
          const favoriteDoc = doc(db, "favorites", id);
          return await deleteDoc(favoriteDoc);
        } catch (error) {
          console.error("Failed to delete from favorites:", error);
          throw error;
        }
      },
      
  }

  export default QuotesServices