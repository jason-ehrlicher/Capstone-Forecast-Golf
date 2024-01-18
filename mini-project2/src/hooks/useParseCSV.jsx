import { useState, useEffect } from 'react';
import Papa from 'papaparse';


// Custom hook for parsing data
const useParseCSV = () => {
  // State to store the parsed data
  const [data, setData] = useState([]);
  // State to indicate whether the data is being loaded
  const [loading, setLoading] = useState(true);
  // State to store any error that occurs during fetching or parsing
  const [error, setError] = useState(null);

    // useEffect hook to fetch and parse data when the component mounts
  useEffect(() => {

    // Asynchronous function to fetch and parse the CSV data
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetching the CSV file 
        const response = await fetch('/assets/Rounds Played.csv');
        // If response is not OK, throw an error
        if (!response.ok) throw new Error('Failed to fetch CSV file');

        // Extract text content from the response
        const csvText = await response.text();

       // Using PapaParse to parse the CSV text
        Papa.parse(csvText, {
          header: true,            //First row has headers
          complete: (results) => {
            console.log("Parsed Data:", results.data);

            // Update the state with the parsed data
            setData(results.data);
            setLoading(false);
          },
          error: (parseError) => {
            setError(parseError);
            setLoading(false);
          }
        });

      } catch (fetchError) {
        setError(fetchError);
        setLoading(false);
      }
    };

    fetchData();
  }, []);  // Empty dependency array to ensure this effect runs only once on mount

  return { data, loading, error };
};


export default useParseCSV;
