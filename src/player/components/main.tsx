// Tauri Plugins
import { readTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';
import { invoke } from '@tauri-apps/api/core';

// SolidJS Imports
import { onMount, createSignal, For } from "solid-js";


// VidStack Imports
import 'vidstack/bundle';

import { MediaPlayerElement } from 'vidstack/elements';
import {
    isHLSProvider,
    type MediaProviderChangeEvent,
    TextTrack
} from 'vidstack';


// HLS Imports
import Hls from 'hls.js/dist/hls.min.js';

// Styles Imports
import styles from "../styles/main.module.css";
import "../styles/modify_player.css";


// Scripts Imports
import fetch_track from '../scripts/fetch_track';
import MODIFY_FLOADER from '../scripts/modify_floader';
import MODIFY_PLOADER from "../scripts/modify_ploader";

type TRACK_DATA = {
    file: string, label?: string, 
    kind: "alternative" | "descriptions" | "main" | "main-desc" | "translation" | "commentary" | "subtitles" | "captions" | "chapters" | "metadata" | undefined,
}[]

const Player = () => {

    const [is_error, set_is_error] = createSignal<{state: boolean, message: string}>({state:false, message:""});
    const [is_ready, set_is_ready] = createSignal<boolean>(false);

    const [SOURCE, SET_SOURCE] = createSignal<string>("");
    const [THUMNAILS, SET_THUMNAILS] = createSignal<string>("");
    const [TRACK_DATA, SET_TRACK_DATA] = createSignal<TRACK_DATA>([]);
    const [INTRO, SET_INTRO] = createSignal<{start: number, end: number}>({start: 0, end: 0});
    const [OUTRO, SET_OUTRO] = createSignal<{start: number, end: number}>({start: 0, end: 0});
    const [CONFIG, SET_CONFIG] = createSignal<{
        host: string, origin: string, referer: string
    }>({host: "", origin: "", referer: ""});
    

    onMount(()=>{
        set_is_ready(false);
        (async () => {
            const argsJson = await invoke<string>('get_args');
        const args = JSON.parse(argsJson);
        if (!args.manifest) {
            set_is_error({
                state: true,
                message: "Invalid manifest file"
            });
            return;
        }
        console.log(args);
        const manifest_raw = await readTextFile(args.manifest, {
            baseDir: BaseDirectory.AppConfig,
        });
        
        try {
            const manifest = JSON.parse(manifest_raw);
            console.log(manifest)
            SET_CONFIG(manifest.config);
            SET_INTRO(manifest.data.intro);
            SET_OUTRO(manifest.data.outro);

            let fetch_track_result = await fetch_track(manifest.data.tracks);
            SET_TRACK_DATA(fetch_track_result as TRACK_DATA);

            for (const track of fetch_track_result) {
                if (track.kind === "thumbnails") {
                    SET_THUMNAILS(track.file);
                }
            }
            
            const src = manifest?.data?.sources[0]?.file;
            if (!src) {
                set_is_error({
                    state: true,
                    message: "Invalid manifest file"
                });
                return;
            }
            SET_SOURCE(src);

            set_is_ready(true);
        } catch (error) {
            console.error(error);
            set_is_error({
                state: true,
                message: "Invalid manifest file"
            });
        }
        })()
    })
    
    const onProviderChange = (e: MediaProviderChangeEvent) => {
        let provider = e.target.provider;
        if (isHLSProvider(provider) && Hls.isSupported()) {
            provider.library = Hls;
            provider.config = {
                // Apply loader for loading fragments/segments.
                fLoader: MODIFY_FLOADER({
                    host: CONFIG().host,
                    origin: CONFIG().origin,
                    referer: CONFIG().referer
                }),
                // Apply loader for loading playlists.
                pLoader: MODIFY_PLOADER({
                    host: CONFIG().host,
                    origin: CONFIG().origin,
                    referer: CONFIG().referer
                })
            };
        }

        const player = e.currentTarget as MediaPlayerElement;
        if (player) {

            const track = new TextTrack({
                kind: 'chapters',
                label: 'Chapters',
                language: 'en',
                type: 'vtt',
            });

            track.mode = 'showing'; // or 'showing' if you want it visible

            track.addCue(new VTTCue(INTRO().start, INTRO().end, 'Intro'));
            track.addCue(new VTTCue(OUTRO().start, OUTRO().end, 'Outro'));

            player.textTracks.add(track);
        }
    };
    
    return (<div class={styles.container}>
        {is_error().state
            ? <span class={styles.error}>
                {is_error().message}
            </span>
            : <>{is_ready() &&
                <media-player
                    id="player"
                    playsInline crossOrigin
                    streamType='on-demand'
                    src={{src:SOURCE(), type:"application/x-mpegurl"}}
                    storage={"vidstack-storage"}
                    on:provider-change={onProviderChange}
                    style={{ 
                        "border-radius": '0',
                    }}
                >
                    <media-provider>
                        <For each={TRACK_DATA()}>{(item) => 
                            <track
                                src={item.file}
                                kind={item.kind}
                                label={item.label}
                                default
                            />
                        }</For>
                    </media-provider>
                    <media-video-layout
                        thumbnails={THUMNAILS()}
                    >
                        <media-time-slider></media-time-slider>
                    </media-video-layout>
                </media-player>
            }</>
        }
    </div>)
}

export default Player;