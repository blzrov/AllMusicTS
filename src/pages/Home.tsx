import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Button, Space, Grid } from "@mantine/core";
import { IconDeviceSpeaker } from "@tabler/icons-react";
import { deezerRequestOptions } from "../helpers/requestOptions";

export default function Home() {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<any[]>([]);
  const [audioSRC, setAudioSRC] = useState("");

  useEffect(() => {
    requestMusic();
  }, []);

  function requestMusic(q: string = "eminem") {
    setAudioSRC("");
    async function getMusic(q: string = "eminem") {
      try {
        const response = await axios.request({ ...deezerRequestOptions, params: { q } });
        if (response.data.error) throw new Error();
        setTracks(response.data.data);
        console.log(response.data);
      } catch (error) {
        getMusic(q);
      }
    }
    getMusic(q);
  }

  return (
    <div>
      <Grid>
        <Grid.Col span={11}>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            icon={<IconDeviceSpeaker />}
            placeholder="eminem"
            size="md"
          />
        </Grid.Col>
        <Grid.Col span={1}>
          <Button fullWidth onClick={() => requestMusic(query)} disabled={!query} size="md">
            Найти
          </Button>
        </Grid.Col>
      </Grid>

      <Space h="md" />
      <audio style={{ display: "none" }} controls autoPlay src={audioSRC} />
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
      </div>
    </div>
  );
}
