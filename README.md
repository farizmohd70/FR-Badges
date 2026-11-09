# FR-Badges

Modern badge pack for media tags: **source, resolution, HDR, codec, bit depth and audio**. 31 badges in 10 styles, all transparent PNGs, with ready-to-use filter manifests.

![FR-Badges Glass preview](Previews/preview-glass.png)

## How to add in Nuvio

1. Open Nuvio and go to **Profile**.
2. Tap **Layout**.
3. Open **Streams**.
4. Find **Fusion badge URLs** and paste the manifest link of the style you want. Copy it from the [Usage](#usage) section below.
5. Go back to your streams list. The new badges show on your stream tags.

To switch styles, replace the link with another style's link. If the old badges still show, restart the app or clear its cache.

## Styles

| Style | Look | Folder | Manifest |
|---|---|---|---|
| **Glass** | Dark tinted glass pills | `Badges` | `badges.json` |
| **Neon** | Glowing gradient text, no background (dark UIs) | `Badges-Neon` | `badges-neon.json` |
| **Solid** | Vivid gradient fills | `Badges-Solid` | `badges-solid.json` |
| **Icon Dark** | Gradient icon tiles on dark glass | `Badges-Icon-Dark` | `badges-icon-dark.json` |
| **Split** | Colored icon segment joined to a dark label | `Badges-Split` | `badges-split.json` |
| **Frost** | Translucent frosted glass for posters and backdrops | `Badges-Frost` | `badges-frost.json` |
| **Neon Icon** | Glowing gradient icons and text, no background (dark UIs) | `Badges-Neon-Icon` | `badges-neon-icon.json` |
| **Minimal** | Flat dark pills with a colored dot | `Badges-Minimal` | `badges-minimal.json` |
| **Light** | Soft pastel pills (light UIs) | `Badges-Light` | `badges-light.json` |
| **Icon Light** | Gradient icon tiles on pastel | `Badges-Icon-Light` | `badges-icon-light.json` |

## What's included

| Group | Badges |
|---|---|
| Source | REMUX, Blu-ray, WEB-DL, WEBRip, HDTV, DVD Rip |
| Resolution | 4K, 1080p, 720p, 480p |
| Video Tech | Dolby Vision, HDR10+, HDR10, HDR, SDR, IMAX Enhanced, IMAX |
| Video Codec | HEVC, AVC |
| Bit Depth | 10-bit, 8-bit |
| Audio Tech | Atmos, TrueHD, Dolby Digital+, Dolby Digital, DTS:X, DTS-HD MA, DTS-HD, DTS |
| Audio Channels | 7.1, 5.1 |

## Usage

Copy the link for the style you want and use **one** style at a time. The guide above shows where to paste it.

### Glass

[![glass preview](Previews/preview-glass.png)](Previews/preview-glass.png)

```
https://raw.githubusercontent.com/farizmohd70/FR-Badges/main/badges.json
```

### Neon

[![neon preview](Previews/preview-neon.png)](Previews/preview-neon.png)

```
https://raw.githubusercontent.com/farizmohd70/FR-Badges/main/badges-neon.json
```

### Solid

[![solid preview](Previews/preview-solid.png)](Previews/preview-solid.png)

```
https://raw.githubusercontent.com/farizmohd70/FR-Badges/main/badges-solid.json
```

### Icon Dark

[![icon-dark preview](Previews/preview-icon-dark.png)](Previews/preview-icon-dark.png)

```
https://raw.githubusercontent.com/farizmohd70/FR-Badges/main/badges-icon-dark.json
```

### Split

[![split preview](Previews/preview-split.png)](Previews/preview-split.png)

```
https://raw.githubusercontent.com/farizmohd70/FR-Badges/main/badges-split.json
```

### Frost

[![frost preview](Previews/preview-frost.png)](Previews/preview-frost.png)

```
https://raw.githubusercontent.com/farizmohd70/FR-Badges/main/badges-frost.json
```

### Neon Icon

[![neon-icon preview](Previews/preview-neon-icon.png)](Previews/preview-neon-icon.png)

```
https://raw.githubusercontent.com/farizmohd70/FR-Badges/main/badges-neon-icon.json
```

### Minimal

[![minimal preview](Previews/preview-minimal.png)](Previews/preview-minimal.png)

```
https://raw.githubusercontent.com/farizmohd70/FR-Badges/main/badges-minimal.json
```

### Light

[![light preview](Previews/preview-light.png)](Previews/preview-light.png)

```
https://raw.githubusercontent.com/farizmohd70/FR-Badges/main/badges-light.json
```

### Icon Light

[![icon-light preview](Previews/preview-icon-light.png)](Previews/preview-icon-light.png)

```
https://raw.githubusercontent.com/farizmohd70/FR-Badges/main/badges-icon-light.json
```

If the app caches images, clear its cache after switching styles.

## Notes

- Badges are original designs with plain-text labels. They are not the official logos of Dolby, DTS, IMAX, Blu-ray Disc or others.
- Every badge has a transparent margin, so rounded edges don't get clipped when an app crops to the image bounds.
- Based on the original [Elite-Badges](https://github.com/leonevz/Elite-Badges) manifest structure.
