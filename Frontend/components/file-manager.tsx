"use client";

import {
  FileManagerComponent,
  Inject,
  NavigationPane,
  DetailsView,
  Toolbar,
} from "@syncfusion/ej2-react-filemanager";

import { registerLicense } from "@syncfusion/ej2-base";

import "@/node_modules/@syncfusion/ej2-icons/styles/tailwind.css";
import "@/node_modules/@syncfusion/ej2-base/styles/tailwind.css";
import "@/node_modules/@syncfusion/ej2-inputs/styles/tailwind.css";
import "@/node_modules/@syncfusion/ej2-popups/styles/tailwind.css";
import "@/node_modules/@syncfusion/ej2-buttons/styles/tailwind.css";
import "@/node_modules/@syncfusion/ej2-splitbuttons/styles/tailwind.css";
import "@/node_modules/@syncfusion/ej2-navigations/styles/tailwind.css";
import "@/node_modules/@syncfusion/ej2-layouts/styles/tailwind.css";
import "@/node_modules/@syncfusion/ej2-grids/styles/tailwind.css";
import "@/node_modules/@syncfusion/ej2-react-filemanager/styles/tailwind.css";
import "@/node_modules/@syncfusion/ej2-react-popups/styles/tailwind.css";

import { FILEMANAGER_HOST, FILEMANAGER_LISCENCE_KEY } from "@/constants";

interface FileManagerProps {
  serverId: string;
  role: "admin" | "member";
}

registerLicense(FILEMANAGER_LISCENCE_KEY as string);

export default function FileManager({ serverId, role }: FileManagerProps) {
  const host_URL = FILEMANAGER_HOST;
  const rootPath = "/servers/" + serverId;

  return (
    <FileManagerComponent
      ajaxSettings={{
        url: host_URL + `?rootPath=${rootPath}&role=${role}`,
        downloadUrl: host_URL + "/Download",
        uploadUrl: host_URL + "/Upload",
        getImageUrl: host_URL + "/GetImage",
        // getImageUrl = "http://localhost:{port}/GetImage",
      }}
    >
      <Inject services={[NavigationPane, DetailsView, Toolbar]} />
    </FileManagerComponent>
  );
}
