import { Skeleton } from "@mantine/core";
import { ITrack } from "../types/types";

interface TrackListProps {
  tracks: ITrack[];
  loading: boolean;
  setAudioSRC: (arg0: string) => void;
  setQuery: (arg0: string) => void;
  requestMusic: (q: string) => void;
}

export default function TrackList({ tracks, setAudioSRC, setQuery, requestMusic, loading }: TrackListProps) {
  return (
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
      {loading && new Array(25).fill(1).map((e, i) => <Skeleton key={i} style={{ margin: "2px" }} className="track" />)}
    </div>
  );
}
