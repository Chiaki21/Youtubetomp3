import axios from "axios";
import { useRef, useState } from "react";
import { youtube_parser } from "./utils";

function App() {
  const inputUrlRef = useRef();
  const [urlResult, setUrlResult] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const youtubeID = youtube_parser(inputUrlRef.current.value);

    const options = {
      method: 'get',
      url: 'https://youtube-mp36.p.rapidapi.com/dl',
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
        'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
      },
      params: {
        id: youtubeID
      }
    }

    axios(options)
      .then(res => {
        setUrlResult(res.data.link);
        axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${youtubeID}&key=AIzaSyDbp5LDeuV7mU5T8dHggbfGoAGI8pX0xT4`)
          .then(response => {
            const title = response.data.items[0].snippet.title;
            setVideoTitle(title);
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));

    inputUrlRef.current.value = '';
  }

  return (
    <div className="app">
      <span className="logo">Made by Bakemono</span>
      <a href="https://github.com/Chiaki21" className="logolink" target="_blank" rel="noopener noreferrer">
  github/Chiaki21
</a>

      <section className="content">
        <h1 className="content_title">YouTube to MP3</h1>
        <p className="content_description">
          Paste the YouTube URL in the input box.
        </p>

        <form onSubmit={handleSubmit} className="form">
          <input ref={inputUrlRef} className="form_input" type="text" />
          <button type="submit" className="form_button">Convert</button>
        </form>

        {videoTitle && <p className="video_title">Title: {videoTitle}</p>}

        {urlResult ? <a target='_blank' rel="noreferrer" href={urlResult} className="download_btn">Download MP3</a> : ''}
        
      </section>
    </div>
  )
}

export default App;
