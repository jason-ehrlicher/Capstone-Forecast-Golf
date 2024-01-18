import { useState, useEffect } from 'react';
import Papa from 'papaparse';



const useParseCSV = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetching the CSV file 
        const response = await fetch('/assets/Rounds Played.csv');
        if (!response.ok) throw new Error('Failed to fetch CSV file');

        const csvText = await response.text();

        // Parse CSV text with PapaParse 
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            console.log("Parsed Data:", results.data);
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
  }, []);

  return { data, loading, error };
};


export default useParseCSV;
