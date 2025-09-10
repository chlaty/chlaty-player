# Chlaty-Player

<div>
    <a href="https://github.com/chlaty/chlaty-player/releases">
        <img src="https://img.shields.io/github/v/release/chlaty/chlaty-player" />
    </a>
    <a href="https://github.com/chlaty/chlaty-player/releases">
        <img src="https://img.shields.io/github/downloads/chlaty/chlaty-player/total?color=green" />
    </a>
</div>

# What's Chlaty-Player?
**Chlaty-Player** is a lightweight media player designed for direct customization and feature extensibility.

# Installation & Usage

<a href="https://github.com/chlaty/chlaty-player/releases">
    <img src="https://img.shields.io/github/v/release/chlaty/chlaty-player?style=for-the-badge&color=red" />
</a>

### Run command
```bash
./chlaty-player --manifest="path/to/manifest.json"
```

### Manifest Configurations (Example)
```json
{
  "data": {
    "intro": {
      "start": 20,
      "end": 109
    },
    "outro": {
      "start": 1330,
      "end": 1420
    },
    "sources": [
      {
        "file": "https://example.com/master.m3u8",
        "type": "hls"
      }
    ],
    "tracks": [
      {
        "file": "https://example.com/eng-2.vtt",
        "label": "English",
        "kind": "captions"
      },
      {
        "file": "https://example.com/thumbnails.vtt",
        "label": null,
        "kind": "thumbnails"
      }
    ]
  },
  "config": {
    "host": "host.example || empty",
    "origin": "https://origin.example || empty",
    "referer": "https://referer.example/ || empty",
    "playlist_base_url": "https://playlistbase.example || empty",
    "segment_base_url": "https://segbase.example || empty"
  }
}
```


