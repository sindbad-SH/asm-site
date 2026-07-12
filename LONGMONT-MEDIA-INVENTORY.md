# Longmont Media Inventory — Colorado Medieval Festival + Knights of Mayhem

Read-only inventory. No files were moved, renamed, deleted, or copied. Compiled 2026-07-12.

Scope:
1. `E:\Old Projects\Colorado Medieval Festival`
2. `E:\Old Projects\Knights of Mayhem`

---

## 1. Top-line summary

| Folder | Files | Total size | File types | Photos | Finished exports found |
|---|---|---|---|---|---|
| Colorado Medieval Festival | 91 | 86.66 GB | `.mp4` only (91) | **0** | 1 possible rough cut (`Test medevil fair.mp4`) |
| Knights of Mayhem | 14 | 0.71 GB | `.mp4`(6), `.wfp`(3), `.jpg`(2), `.png`(2), `.mp3`(1) | 0 real photos (2 auto-thumbnails + 2 screenshots only) | **Yes — finished video identified** |

**Neither folder contains a photo library.** Colorado Medieval Festival is 100% raw drone/gimbal 4K video (91 `.mp4` files, no stills at all). Knights of Mayhem's only image files are an auto-generated video thumbnail (`.jpg` x2, ~0.3-0.9 MB each) and two Windows screenshots — none are camera photography. So part (c) of the brief (best photo candidates) has no real candidates in either folder; this task is effectively a video inventory.

---

## 2. Colorado Medieval Festival — subfolder breakdown

| Subfolder | Files | Size | Content type | Sample filenames |
|---|---|---|---|---|
| `2024\` (root) | 1 | 0.10 GB | 1080p/24fps test edit | `Test medevil fair.mp4` (105.5s, 1920x1080) |
| `2024\Drone\` | 60 | 26.01 GB | Raw drone footage, sequential DJI clips | `DJI_0001.MP4` … `DJI_0061.MP4` |
| `2024\High angle Camera\` | 30 | 60.54 GB | Raw high-angle/gimbal 4K footage, large single takes | `DJI_20240609105535_0199_D.MP4` … `DJI_20240609175722_0228_D.MP4` |

**Raw vs. edited:** Every file in `Drone\` and `High angle Camera\` uses stock camera-generated naming (sequential `DJI_####.MP4` or `DJI_<timestamp>_####_D.MP4`), all shot on 2024-06-09, all sized in the hundreds of MB to multiple GB (largest is `DJI_20240609173332_0226_D.MP4` at 14.03 GB) — classic unedited camera-original footage, not exports. There is no "final," "edit," "export," or "master" naming anywhere in this folder.

The one exception is `2024\Test medevil fair.mp4` — 102 MB, 1080p, 24fps, 105.5s, named "Test." This reads as a rough/test compilation rather than a finished piece (the word "Test" plus the fact it sits loose in the year-root folder rather than in either camera-source subfolder). Not a strong finished-video candidate, but flagged since it's the only edited-looking artifact in this folder.

**No finished/graded highlight reel and no photos exist anywhere in this folder** — it is pure raw aerial/high-angle B-roll source material.

---

## 3. Knights of Mayhem — full contents

| File | Size | Type | Notes |
|---|---|---|---|
| `Knights of Mayhem CO Med Fair Main updated.mp4` | 291.28 MB | Finished export | 3840x2160, 59.94fps, **60.94s**, dated 2025-02-09 |
| `Knights of Mayhem CO Med Fair Main updated-Thumbnail.jpg` | 0.38 MB | Auto thumbnail | Companion to the file above, same date |
| `Knights of Mayhem CO Med Fair Main updated.mp3` | 0.99 MB | Audio track | Companion audio, same date — likely the music/mix used in the export |
| `Knights of Mayhem CO Med Fair Main .mp4.wfp` | 1.50 MB | Filmora project | Zip/Wondershare Filmora project file; internal timestamp Jun 2024, file-system mtime Aug 2025 (project reopened after export) |
| `Knights of Mayhem CO Med Fair Demo Sindbad.mp4` | 291.38 MB | Finished export (earlier) | 3840x2160, 59.94fps, **60.94s**, dated 2024-06-11 |
| `Knights of Mayhem CO Med Fair Demo Sindbad-Thumbnail.jpg` | 0.38 MB | Auto thumbnail | Companion to the file above |
| `KoM Drone clips short.mp4` | 29.80 MB | Raw/B-roll clip | 3840x2160, 6.14s |
| `KoM Drone clips short-1.mp4` | 36.55 MB | Raw/B-roll clip | 3840x2160, 7.62s |
| `KoM Drone clips short-2.mp4` | 43.64 MB | Raw/B-roll clip | 3840x2160, 9.03s |
| `Santa Clip.mp4` | 26.16 MB | Unrelated raw clip | 3840x2160, 5.42s — likely a different/seasonal shoot, not KoM coverage |
| `Screenshot 2025-02-09 164624.png` | 0.26 MB | Desktop screenshot | Same date as the "Main updated" export — probably a QC/upload screenshot |
| `Screenshot 2025-02-09 165837.png` | 0.89 MB | Desktop screenshot | Same date, same likely purpose |
| `Untitled.wfp` | 1.34 MB | Filmora project | Earlier/generic-named project, Jun 2024 |
| `Untitled_backup01.wfp` | 1.34 MB | Filmora project backup | Auto-backup of the above, Jun 2024 |

---

## 4. Ranked candidates for THE finished Knights of Mayhem video

Only two files are full finished-length productions (everything else is a sub-10-second raw clip). Both were probed with `ffprobe`:

| Rank | File | Duration | Resolution | FPS | Date | Codec | Why |
|---|---|---|---|---|---|---|---|
| **1** | `Knights of Mayhem CO Med Fair Main updated.mp4` | 60.94s | 3840x2160 (4K) | 59.94 | 2025-02-09 | h264 | "Main **updated**" naming — reads as the final/current version. Has a matching Filmora project (`Main .mp4.wfp`), a paired audio track (`Main updated.mp3`), and an auto thumbnail — a complete production stack (project + audio + export + thumbnail) that no other file has. 1-min length fits a web/social sizzle reel exactly. **Top candidate — this is almost certainly the video that was on the previous website.** |
| **2** | `Knights of Mayhem CO Med Fair Demo Sindbad.mp4` | 60.94s | 3840x2160 (4K) | 59.94 | 2024-06-11 | h264 | Essentially frame-identical duration and matching size (291.38 MB vs 291.28 MB) to #1 — this is very likely the earlier export of the *same edit* before it was revised into "Main updated" in Feb 2025. Keep as a backup/earlier-cut reference, not the primary pick. |
| 3 | `KoM Drone clips short-2.mp4` | 9.03s | 3840x2160 | 59.94 | 2024-06-11 | h264 | Raw B-roll snippet, far too short to be "the finished video." |
| 4 | `KoM Drone clips short-1.mp4` | 7.62s | 3840x2160 | 59.94 | 2024-06-11 | h264 | Same — raw clip. |
| 5 | `KoM Drone clips short.mp4` | 6.14s | 3840x2160 | 59.94 | 2024-06-11 | h264 | Same — raw clip. |
| — | `Santa Clip.mp4` | 5.42s | 3840x2160 | 59.94 | 2024-06-11 | h264 | Excluded — content is unrelated (Santa-themed), likely misfiled from another shoot. |

**Bottom line: `E:\Old Projects\Knights of Mayhem\Knights of Mayhem CO Med Fair Main updated.mp4`** (60.9s, 4K, Feb 2025) is the strongest match for "the finished video." `Demo Sindbad.mp4` is the runner-up and appears to be the same edit's prior export.

---

## 5. Photo candidates (proxy signals only)

No genuine photography exists in either folder. For completeness, the only image files present:

| File | Folder | Size | Nature |
|---|---|---|---|
| `Knights of Mayhem CO Med Fair Main updated-Thumbnail.jpg` | Knights of Mayhem | 0.38 MB | Auto-generated video thumbnail (frame grab), not a standalone photo |
| `Knights of Mayhem CO Med Fair Demo Sindbad-Thumbnail.jpg` | Knights of Mayhem | 0.38 MB | Auto-generated video thumbnail, not a standalone photo |
| `Screenshot 2025-02-09 164624.png` | Knights of Mayhem | 0.26 MB | Desktop screenshot |
| `Screenshot 2025-02-09 165837.png` | Knights of Mayhem | 0.89 MB | Desktop screenshot |

None of these are usable as stock/gallery photo assets. If a photo set from either event exists, it is not in these two folders — worth checking elsewhere (e.g., a phone backup, a separate stills card dump, or the website photo index at `E:\_WEBSITE PHOTO INDEX\INDEX.md`).

---

## 6. Existing tiering / organization observed

- **Colorado Medieval Festival**: minimal organization — just two camera-source subfolders (`Drone`, `High angle Camera`) under a `2024` year folder, both holding sequential camera-original files in shooting order. No "selects," "best of," "final," or graded/exported subfolder exists. No tiering present.
- **Knights of Mayhem**: no subfolders at all — flat folder. Loose but informative naming does double as an ad-hoc "tiering" signal: `Main updated` > `Demo Sindbad` (superseded draft) > `KoM Drone clips short*` (raw B-roll) > `Santa Clip` (unrelated). Filmora project files (`.wfp`) confirm an edit pipeline was used, and the paired thumbnail/audio/screenshot files show a full "ready to publish" export cycle happened around 2025-02-09 for the "Main updated" file specifically.

---

## Appendix A — Full tree: Colorado Medieval Festival (91 files, 86.66 GB)

```
2024\
  Test medevil fair.mp4                                        102.37 MB   2024-08-07
  Drone\  (60 files, 26.01 GB — sequential DJI_####.MP4, 2024-06-09)
    DJI_0001.MP4   189.11 MB      DJI_0021.MP4   284.10 MB      DJI_0041.MP4   597.52 MB
    DJI_0002.MP4  1284.37 MB      DJI_0022.MP4    14.15 MB      DJI_0042.MP4   690.01 MB
    DJI_0003.MP4   239.98 MB      DJI_0023.MP4   242.21 MB      DJI_0043.MP4   484.91 MB
    DJI_0004.MP4   239.85 MB      DJI_0024.MP4   355.93 MB      DJI_0044.MP4   827.03 MB
    DJI_0005.MP4   227.71 MB      DJI_0025.MP4   142.85 MB      DJI_0045.MP4  1745.36 MB
    DJI_0006.MP4   313.82 MB      DJI_0026.MP4   757.94 MB      DJI_0046.MP4   699.78 MB
    DJI_0007.MP4   989.58 MB      DJI_0027.MP4   211.20 MB      DJI_0047.MP4   118.60 MB
    DJI_0008.MP4   170.51 MB      DJI_0028.MP4   619.38 MB      DJI_0048.MP4   195.81 MB
    DJI_0009.MP4   168.86 MB      DJI_0029.MP4   629.35 MB      DJI_0049.MP4   219.31 MB
    DJI_0010.MP4   221.78 MB      DJI_0030.MP4   155.47 MB      DJI_0050.MP4   249.65 MB
    DJI_0011.MP4   168.95 MB      DJI_0031.MP4   190.73 MB      DJI_0051.MP4   442.52 MB
    DJI_0012.MP4   220.92 MB      DJI_0032.MP4   509.21 MB      DJI_0052.MP4   426.51 MB
    DJI_0013.MP4    66.20 MB      DJI_0033.MP4   112.59 MB      DJI_0053.MP4   218.24 MB
    DJI_0014.MP4   166.67 MB      DJI_0034.MP4   980.10 MB      DJI_0054.MP4   441.42 MB
    DJI_0015.MP4   211.75 MB      DJI_0035.MP4   250.83 MB      DJI_0055.MP4   615.65 MB
    DJI_0016.MP4  1070.14 MB      DJI_0036.MP4   264.15 MB      DJI_0056.MP4   292.76 MB
    DJI_0017.MP4   278.46 MB      DJI_0037.MP4   328.31 MB      DJI_0057.MP4  1014.33 MB
    DJI_0018.MP4   667.74 MB      DJI_0038.MP4   380.29 MB      DJI_0059.MP4   647.37 MB
    DJI_0019.MP4   443.84 MB      DJI_0039.MP4   321.93 MB      DJI_0060.MP4    13.46 MB
    DJI_0020.MP4   428.54 MB      DJI_0040.MP4  1649.94 MB      DJI_0061.MP4   528.73 MB
  High angle Camera\  (30 files, 60.54 GB — DJI_<timestamp>_####_D.MP4, 2024-06-09)
    DJI_20240609105535_0199_D.MP4    121.18 MB    DJI_20240609135721_0215_D.MP4   1154.98 MB
    DJI_20240609105554_0200_D.MP4   2162.84 MB    DJI_20240609135847_0216_D.MP4    730.75 MB
    DJI_20240609105848_0201_D.MP4    802.01 MB    DJI_20240609140658_0217_D.MP4   1518.64 MB
    DJI_20240609110609_0202_D.MP4    122.11 MB    DJI_20240609140937_0218_D.MP4   2656.23 MB
    DJI_20240609111531_0203_D.MP4   1614.22 MB    DJI_20240609141903_0219_D.MP4   1271.04 MB
    DJI_20240609111741_0204_D.MP4    725.98 MB    DJI_20240609153550_0220_D.MP4    979.35 MB
    DJI_20240609111841_0205_D.MP4    473.60 MB    DJI_20240609153718_0221_D.MP4   1019.75 MB
    DJI_20240609111920_0206_D.MP4    124.88 MB    DJI_20240609153851_0222_D.MP4   1834.25 MB
    DJI_20240609111955_0207_D.MP4   1559.10 MB    DJI_20240609154141_0223_D.MP4   1097.43 MB
    DJI_20240609112242_0208_D.MP4    621.03 MB    DJI_20240609154608_0224_D.MP4   2729.90 MB
    DJI_20240609112335_0209_D.MP4    351.42 MB    DJI_20240609154929_0225_D.MP4   1761.99 MB
    DJI_20240609133458_0210_D.MP4   6752.34 MB    DJI_20240609173332_0226_D.MP4  14028.32 MB  (largest file, 14 GB)
    DJI_20240609135331_0211_D.MP4    515.35 MB    DJI_20240609175050_0227_D.MP4   3897.15 MB
    DJI_20240609135414_0212_D.MP4    852.21 MB    DJI_20240609175722_0228_D.MP4   9298.13 MB
    DJI_20240609135531_0213_D.MP4    626.30 MB
    DJI_20240609135622_0214_D.MP4    595.53 MB
```

## Appendix B — Full tree: Knights of Mayhem (14 files, 0.71 GB, flat folder)

```
Knights of Mayhem CO Med Fair Main updated.mp4                 291.28 MB   2025-02-09   [FINISHED — top candidate]
Knights of Mayhem CO Med Fair Main updated-Thumbnail.jpg          0.38 MB  2025-02-09
Knights of Mayhem CO Med Fair Main updated.mp3                    0.99 MB  2025-02-09
Knights of Mayhem CO Med Fair Main .mp4.wfp                       1.50 MB  2025-08-23   (Filmora project)
Knights of Mayhem CO Med Fair Demo Sindbad.mp4                  291.38 MB  2024-06-11   [FINISHED — earlier export]
Knights of Mayhem CO Med Fair Demo Sindbad-Thumbnail.jpg           0.38 MB 2024-06-11
KoM Drone clips short.mp4                                         29.80 MB 2024-06-11   (raw, 6.14s)
KoM Drone clips short-1.mp4                                       36.55 MB 2024-06-11   (raw, 7.62s)
KoM Drone clips short-2.mp4                                       43.64 MB 2024-06-11   (raw, 9.03s)
Santa Clip.mp4                                                    26.16 MB 2024-06-11   (raw, 5.42s, unrelated content)
Screenshot 2025-02-09 164624.png                                   0.26 MB 2025-02-09
Screenshot 2025-02-09 165837.png                                   0.89 MB 2025-02-09
Untitled.wfp                                                       1.34 MB 2024-06-11   (Filmora project)
Untitled_backup01.wfp                                              1.34 MB 2024-06-11   (Filmora project backup)
```
