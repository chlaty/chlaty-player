import { fetch } from '@tauri-apps/plugin-http';

type TrackItem = {
    file: string;
    label?: string;
    kind:
        | "alternative"
        | "descriptions"
        | "main"
        | "main-desc"
        | "translation"
        | "commentary"
        | "subtitles"
        | "captions"
        | "chapters"
        | "metadata"
        | "thumbnails"
        | undefined;
};

async function fetch_track(tracks: TrackItem[]): Promise<TrackItem[]> {
    const updatedTracks = await Promise.all(
        tracks.map(async (track) => {
            try {
                const response = await fetch(track.file);
                const vttText = await response.text();

                // Get MIME type from response headers
                const contentType = response.headers.get("Content-Type") || "text/vtt";

                const blob = new Blob([vttText], { type: contentType });
                const blobUrl = URL.createObjectURL(blob);

                return {
                ...track,
                file: blobUrl,
                };
            } catch (error) {
                console.error(`Error loading Track for ${track.label || 'unknown'}:`, error);
                return track;
            }
        })
    );

    return updatedTracks;
}

export default fetch_track;