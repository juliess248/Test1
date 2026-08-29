# Palabra di Kòrsou — MP4 export

The project keeps the original Vite storyboard for editing, and adds a separate Remotion composition that renders only the 15-second advertisement.

## Install

```bash
npm install
```

## Optional: Preview the video composition

```bash
npm run remotion:studio
```

## Render the TikTok MP4

```bash
npm run render:tiktok
```

The finished file is created at:

```text
out/palabra-di-korsou-tiktok.mp4
```

Video settings: 1080×1920, 9:16, 30 fps, 450 frames / 15 seconds, H.264 + AAC.

The Remotion render excludes the storyboard shell and the fake TikTok phone/likes/comments UI. It uses only the five animated ad scenes.
