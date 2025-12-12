import { useEffect, useState } from "react";

const Fetch = () => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const FetchData = async () => {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await res.json();
        setQuery(data);
        if (res) {
          console.log(data);
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    FetchData();
  }, []);

  return (
    <div>
      
    </div>
  );
};

export default Fetch;
