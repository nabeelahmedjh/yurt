"use client";

import "@/app/tldraw.css";

import { useSync } from "@tldraw/sync";
import {
  AssetRecordType,
  getHashForString,
  TLAssetStore,
  TLBookmarkAsset,
  Tldraw,
  uniqueId,
  useTldrawUser,
  TLUserPreferences,
  TLComponents,
  TldrawUiButton,
  DefaultSharePanel,
} from "tldraw";

import { useCopyToClipboard } from "usehooks-ts";

import { useSearchParams } from "next/navigation";

import { API_URL as WORKER_URL, TOKEN } from "@/constants";
import { useState } from "react";
import { toast } from "sonner";
import { getCookie } from "cookies-next";

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

const AUTH_HEADER = `Bearer ${getCookie(TOKEN)}`;

export default function Whiteboard({ profile }: { profile: any }) {
  const [userPreferences, setUserPreferences] = useState<TLUserPreferences>({
    id: profile.username,
    name: profile.username,
  });

  const roomIdParam = useSearchParams().get("roomId");

  const roomId = roomIdParam ?? profile._id;

  console.log("roomId", roomId);
  console.log("username", profile.username);

  const user = useTldrawUser({ userPreferences, setUserPreferences });

  const store = useSync({
    uri: `${WORKER_URL}/whiteboard/${roomId}`,
    assets: multiplayerAssets,
    userInfo: userPreferences,
  });

  const components: TLComponents = {
    SharePanel: (props) => <CustomShareZone roomId={roomId} {...props} />,
  };

  return (
    <div className="h-[100dvh]">
      <Tldraw
        store={store}
        onMount={(editor) => {
          editor.registerExternalAssetHandler("url", unfurlBookmarkUrl);
          editor.updateInstanceState({ isDebugMode: false });
        }}
        user={user}
        components={components}
      />
    </div>
  );
}

////////////////////////////////////////////////////////////////////////////////////////////

function CustomShareZone({ roomId }: { roomId: string }) {
  const [_, copy] = useCopyToClipboard();

  const handleCopy = (text: string) => () => {
    copy(text)
      .then(() => {
        console.log("Copied!", { text });
        toast.success("Share link copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy!", error);
        toast.error("Failed to copy share link to clipboard!");
      });
  };

  return (
    <div>
      <DefaultSharePanel />
      <TldrawUiButton
        title="Share the whiteboard link to collaborate with others"
        style={{ border: "1px solid black" }}
        className="!bg-primary !rounded-[8px] !mr-2 !mt-2"
        type="normal"
        onClick={handleCopy(`${window.origin}/whiteboard?roomId=${roomId}`)}
      >
        Share
      </TldrawUiButton>
    </div>
  );
}

const multiplayerAssets: TLAssetStore = {
  async upload(_asset, file) {
    const id = uniqueId();

    const objectName = `${id}-${file.name}`;
    const url = `${WORKER_URL}/whiteboard/${encodeURIComponent(objectName)}`;

    const response = await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        Authorization: AUTH_HEADER,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to upload asset: ${response.statusText}`);
    }

    return url;
  },
  resolve(asset) {
    return asset.props.src;
  },
};

async function unfurlBookmarkUrl({
  url,
}: {
  url: string;
}): Promise<TLBookmarkAsset> {
  const asset: TLBookmarkAsset = {
    id: AssetRecordType.createId(getHashForString(url)),
    typeName: "asset",
    type: "bookmark",
    meta: {},
    props: {
      src: url,
      description: "",
      image: "",
      favicon: "",
      title: "",
    },
  };

  try {
    const response = await fetch(
      `${WORKER_URL}/whiteboard/unfurl?url=${encodeURIComponent(url)}`,
      {
        headers: {
          Authorization: AUTH_HEADER,
        },
      }
    );
    const data = await response.json();

    asset.props.description = data?.description ?? "";
    asset.props.image = data?.image ?? "";
    asset.props.favicon = data?.favicon ?? "";
    asset.props.title = data?.title ?? "";
  } catch (e) {
    console.error(e);
  }

  return asset;
}
