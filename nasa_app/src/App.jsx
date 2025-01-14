import React, { useEffect, useState } from 'react'
import Footer from './components/Footer'
import Main from './components/Main'
import SideBar from './components/SideBar'
import { use } from 'react'

// showmodal state määrittää, näytetäänkö sivupalkki vai ei (false = ei näy & true = näkyy)
function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  function handleToggleModal() {
    setShowModal(!showModal)
  }

  // haetaan .env - tiedostosta api-avain ja käytetään sitä fetch-funktiolla haettaessa dataa NASA:n API:sta 
  useEffect(() => {
    async function fetchAPIData() {
      const NASA_KEY = import.meta.env.VITE_NASA_API_KEY;
      const url = 'https://api.nasa.gov/planetary/apod' +
        `?api_key=${NASA_KEY}`
      
        const today = new Date().toISOString().slice(0, 10);
        const localKey = `NASA-${today}`;
        
        // tarkista, onko tämän päivän data jo tallennettu
        if (localStorage.getItem(localKey)) {
            const apiData = JSON.parse(localStorage.getItem(localKey));
            setData(apiData);
            console.log('Fetched from cache today');
            return;
        }
        // jos dataa ei ole tallennettu, hae se API:sta
        try {
            const res = await fetch(url);
            const apiData = await res.json();
            setData(apiData);
            console.log('Fetched from API today');
            
            // Tallenna data localStorageen
            localStorage.setItem(localKey, JSON.stringify(apiData));
        } catch (err) {
            console.log(err.message);
        }
        
    }
    fetchAPIData();
  }, []);

  return (
    <>
      {data ? (<Main data={data}/>) : (
        <div className='loadingState'>
          <i className="fa-solid fa-gear"></i>
        </div>
      )}
      {showModal && (
        <SideBar data={data} handleToggleModal={handleToggleModal} />
      )}
      {data && (
      <Footer data={data} handleToggleModal={handleToggleModal} />
      )}
    </>
  )
}

export default App
