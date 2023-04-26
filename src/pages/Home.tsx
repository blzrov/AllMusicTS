import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Button, Space, Grid } from "@mantine/core";
import { IconDeviceSpeaker } from "@tabler/icons-react";
import { deezerRequestOptions } from "../helpers/requestOptions";
import TrackList from "../components/TrackList";
import { ITrack } from "../types/types";

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [tracks, setTracks] = useState<ITrack[]>([]);
  const [audioSRC, setAudioSRC] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [clicked, setClicked] = useState<boolean>(false);

  useEffect(() => {
    requestMusic();
    const handleFirstClick = () => {
      setClicked(true);
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
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
      <TrackList
        tracks={tracks}
        setAudioSRC={setAudioSRC}
        setQuery={setQuery}
        requestMusic={requestMusic}
        loading={loading}
      />
    </div>
  );
}
