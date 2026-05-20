import { useEffect } from "react";

function App() {

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/prescriptions/")
      .then(response => response.json())
      .then(data => console.log("DJANGO SAYS:", data));
  }, []);

  return <h1>Hello does this work</h1>;

}

export default App;
