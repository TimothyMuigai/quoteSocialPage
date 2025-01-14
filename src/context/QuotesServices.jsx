  import { collection, increment } from "firebase/firestore";
  import { db } from "./FirebaseConfig"
  import { getDocs } from "firebase/firestore";
  import { addDoc } from "firebase/firestore";
  import { getDoc } from "firebase/firestore";
  import { updateDoc } from "firebase/firestore";
  import { deleteDoc } from "firebase/firestore";
  import { doc } from "firebase/firestore";

  export const QuotesCollection = collection (db, "quotes");

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
      updateLikes: (id) => {
        const quoteText = doc(db, "quotes", id);
        return updateDoc(quoteText, {
          likeSystem: increment(1),
        });
      },
  }

  export default QuotesServices