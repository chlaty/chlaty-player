import { Route } from "@solidjs/router";

// Route Components
import Player from "../../player/components/main";

// Styles Imports
import '../styles/main.css';

const App = () => {

    return (<>
        <Route path="/" component={Player} />
    </>)
}

export default App;