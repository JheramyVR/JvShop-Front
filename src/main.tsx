import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { TesloShopApp } from "./TesloShopApp";

const rootHTML = document.getElementById("root") as HTMLElement;
const rootReact = createRoot(rootHTML);

rootReact.render(
    <StrictMode>
        <TesloShopApp />
    </StrictMode>
);
