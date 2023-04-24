import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Button, Space, Grid, Skeleton } from "@mantine/core";
import { IconDeviceSpeaker } from "@tabler/icons-react";
import { deezerRequestOptions } from "../helpers/requestOptions";

export default function Home() {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<any[]>([]);
  const [audioSRC, setAudioSRC] = useState("");
  const [loading, setLoading] = useState(true);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    requestMusic();
    const handleFirstClick = () => {
      setClicked(true);
      console.log("click");
      window.removeEventListener("click", handleFirstClick);
    };

    window.addEventListener("click", handleFirstClick);
    return () => {
      window.removeEventListener("click", handleFirstClick);
    };
  }, []);

  function requestMusic(q: string = "eminem") {
    setLoading(true);
    setAudioSRC("");
    setTracks([]);
    let index: number = 0;
    async function getMusic() {
      try {
        const response = await axios.request({ ...deezerRequestOptions, params: { q, index } });
        if (response.data.error) throw new Error();
        setTracks((prev) => [...prev, ...response.data.data]);
        if (response.data.next) {
          index += 25;
          getMusic();
        } else {
          setLoading(false);
        }
      } catch (error) {
        getMusic();
      }
    }
    getMusic();
  }

  return (
    <div>
      <Grid>
        <Grid.Col span="auto">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            icon={<IconDeviceSpeaker />}
            placeholder="eminem"
            size="md"
          />
        </Grid.Col>
        <Grid.Col span="content">
          <Button onClick={() => requestMusic(query)} disabled={!query} size="md">
            Найти
          </Button>
        </Grid.Col>
      </Grid>
      {!clicked && (
        <p>
          Пожалуйста, кликните в любом месте, из за autoplay policy браузер не будет проигрывать музыку, пока вы не
          кликните :)
        </p>
      )}
      <Space h="md" />
      <audio style={{ display: "none" }} autoPlay loop src={audioSRC} />
      <div className="tracks">
        {tracks.map((e) => (
          <div
            key={e.id}
            className="track"
            style={{ backgroundImage: `url("${e.album.cover_xl}")` }}
            onMouseEnter={() => setAudioSRC(e.preview)}
            onMouseLeave={() => setAudioSRC("")}
          >
            <div
              className="track_artistName"
              onClick={() => {
                setQuery(e.artist.name);
                requestMusic(e.artist.name);
              }}
            >
              {e.artist.name}
            </div>
          </div>
        ))}
        {loading &&
          new Array(50).fill(1).map((e, i) => <Skeleton key={i} style={{ margin: "2px" }} className="track" />)}
      </div>
    </div>
  );
}
