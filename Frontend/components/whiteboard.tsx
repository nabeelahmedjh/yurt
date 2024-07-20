"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

export default function Whiteboard() {
  return (
    <div className="h-[100dvh]">
      <Tldraw />
    </div>
  );
}
