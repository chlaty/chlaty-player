// SolidJS Imports
import { onMount, createSignal } from "solid-js";


// Plyr Imports
import * as PlyrModule from 'plyr';
const Plyr = PlyrModule.default;
import 'plyr/dist/plyr.css';
import '../styles/modify_player.css';
// HLS Imports
import Hls from 'hls.js/dist/hls.min.js';

// Styles Imports
import styles from "../styles/main.module.css";

// Scripts Imports
import MODIFY_FLOADER from '../scripts/modify_floader';
import MODIFY_PLOADER from "../scripts/modify_ploader";


const Player = () => {
    let PLAYER!: HTMLVideoElement;

    const src = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

    onMount(() => {
        new Plyr(PLAYER);
        if (Hls.isSupported()) {
            const hls = new Hls({
                // Apply loader for loading fragments/segments.
                fLoader: MODIFY_FLOADER,
                // Apply loader for loading playlists.
                pLoader: MODIFY_PLOADER
            });
            hls.loadSource(src);
            hls.attachMedia(PLAYER);
        } else {
            
        }
    })

    return (<div class={styles.container}>
        {Hls.isSupported()
            ?
                <video id="player" controls ref={PLAYER}>
                    <source type="video/mp4" />
                </video>
            : <span class={styles.error}>
                Your system doesn't support HLS stream
            </span>
        }
    </div>)
}

export default Player;