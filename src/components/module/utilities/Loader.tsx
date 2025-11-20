import { Spinner } from "@/components/ui/spinner";
import React from "react";


export function Loader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center", // horizontal center
        alignItems: "center",     // vertical center
        height: "100vh",          // full viewport height
        width: "100%",            // full width
      }}
    >
      <Spinner   />
    </div>
  );
}
