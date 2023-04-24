import React, { useEffect, useState } from "react";
import axios from "axios";
import { deezerRequestOptions } from "../helpers/requestOptions";

export default function Home() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [audioSRC, setAudioSRC] = useState("");

  useEffect(() => {
    requestMusic();
  }, []);

  function requestMusic(q: string = "eminem") {
    async function getMusic(q: string = "eminem") {
      try {
        const response = await axios.request({ ...deezerRequestOptions, params: { q } });
        if (response.data.error) throw new Error();
        setTracks(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        getMusic(q);
      }
    }
    getMusic(q);
  }

  return (
    <div>
      <audio controls autoPlay src={audioSRC} />
      {tracks.map((e) => (
        <div key={e.id} onMouseEnter={() => setAudioSRC(e.preview)}>
          {e.title}
        </div>
      ))}
    </div>
  );
}
