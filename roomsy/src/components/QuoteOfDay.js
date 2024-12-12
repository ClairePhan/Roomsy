import { useState, useEffect } from 'react';

const getQuote = async () => {
    const url = "http://api.quotable.io/quotes/random";

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.length > 0) {
        const { content, author } = data[0];
        return { content, author };
        } else {
            throw new Error("No quotes found.");
        }
    } catch (error) {
        console.error("Error fetching the quote:", error);
        return null;
    }
};

const QuoteOfDay = () => {
    const [quote, setQuote] = useState("Loading...");
    const [author, setAuthor] = useState("");

    useEffect( () => {
        async function fetchQuote() {
            const today = new Date().toISOString().split('T')[0];
            const storedDate = localStorage.getItem('quoteDate');
            const storedQuote = localStorage.getItem('quote');
            const storedAuthor = localStorage.getItem('author');

            if (storedDate === today && storedQuote && storedAuthor) {
                setQuote(storedQuote);
                setAuthor(storedAuthor);
            } else {
                try {
                    const newQuote = await getQuote();
                    if (newQuote) {
                        setQuote(newQuote.content);
                        setAuthor(newQuote.author);

                        localStorage.setItem('quoteDate', today);
                        localStorage.setItem('quote', newQuote.content);
                        localStorage.setItem('author', newQuote.author);
                    } else {
                        setQuote("getQuote is not returning a new quote");
                    }

                    
                } catch (e) {
                    console.log("Could not load quote");
                    console.log(e);
                    setQuote("Could not load quote");
                }
            }
        }
        fetchQuote();
    }, []);
    
    return (
        <div className="quote" style={{
            border: '1px solid white',
            marginTop: 0,
            paddingTop: 0,
            paddingLeft: "15px",
            marginBottom: "10%",
            marginLeft: 0,
            borderRadius: "20px"
          }}>
          <p style={{ color: 'white' }}>{quote}</p>
          <p style={{ color: 'white' }}><em>- {author}</em></p>
        </div>
    );
}

export default QuoteOfDay;