/* @refresh reload */
import { render } from "solid-js/web";
import App from "./app/components/main";
import { Router } from "@solidjs/router";

render(() => <Router><App/></Router>, document.getElementById("root") as HTMLElement);
