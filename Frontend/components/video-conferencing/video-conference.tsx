import {
  ControlBar,
  GridLayout,
  FocusLayoutContainer,
  FocusLayout,
  CarouselLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";

const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_SERVER_URL;

export default function VideoConference({ token }: { token: string }) {
  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={serverUrl}
      data-lk-theme="brand"
      style={{ height: "100dvh" }}
    >
      <MyVideoConference />
      <RoomAudioRenderer />
      <ControlBar />
    </LiveKitRoom>
  );
}

function MyVideoConference() {
  const cameraTracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { onlySubscribed: false }
  );

  const screenTracks = useTracks(
    [{ source: Track.Source.ScreenShare, withPlaceholder: false }],
    { onlySubscribed: false }
  );

  return screenTracks.length > 0 ? (
    <FocusLayoutContainer
      style={{ height: "calc(100dvh - var(--lk-control-bar-height))" }}
    >
      <CarouselLayout orientation="vertical" tracks={cameraTracks}>
        <ParticipantTile />
      </CarouselLayout>
      <FocusLayout trackRef={screenTracks[0]} />
    </FocusLayoutContainer>
  ) : (
    <GridLayout
      tracks={cameraTracks}
      style={{ height: "calc(100dvh - var(--lk-control-bar-height))" }}
    >
      <ParticipantTile />
    </GridLayout>
  );
}
