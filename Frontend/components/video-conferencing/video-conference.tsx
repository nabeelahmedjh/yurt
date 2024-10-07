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
      // Use the default LiveKit theme for nice styles.
      data-lk-theme="default"
      style={{ height: "100dvh" }}
    >
      {/* Your custom component with basic video conferencing functionality. */}
      <MyVideoConference />
      {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
      <RoomAudioRenderer />
      {/* Controls for the user to start/stop audio, video, and screen
        share tracks and to leave the room. */}
      <ControlBar />
    </LiveKitRoom>
  );
}

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
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
