#!/usr/bin/env bash
# make-portal-loop.sh — turn a raw Higgsfield "living painting" master into the
# web hero loop: a SEAMLESS crossfade loop, 1440p H.264 (universal browser
# support — the masters are HEVC 10-bit, which Chrome/Firefox won't play), plus
# the matching poster stills the WebGL scene fades in over.
#
# WHY 1440p (P1.3): a 1080p encode renders ~1:1 on wide desktop windows, so
# every codec artifact in the star field / aurora gradients shows raw — the
# operator read it as "pixely/stretched". At 1440p the browser/GL always
# DOWNSCALES, which melts compression artifacts; the engine's adaptive
# sharpener (fitSharp) backs off automatically on downscaled sources.
#
# The masters don't loop: the aurora expands then contracts, and the clip ENDS
# on the wide pose while it STARTS on the tight S-pose — a hard jump. But the
# content naturally returns to the start pose partway through, so we cut there
# and crossfade the seam. Run the DIFF SCAN first to find that return point for
# a NEW master (it moves per generation), then set MATCH below.
#
# Usage:
#   ./make-portal-loop.sh "/path/to/hf_master.mp4"
# Output (in public/media/home/): portal-loop.mp4, portal-scene.webp/.avif
#
# --- tuning for the 2026-07-07 master (hf_20260707_...) ---
MATCH=12.1   # sec where the aurora returns to the frame-0 S-pose (diff-scan min)
XFADE=1.2    # crossfade seconds over the seam
# D (trim end) = MATCH + XFADE; the tail [MATCH:D] dissolves over head [0:XFADE]

set -euo pipefail
SRC="${1:?pass the raw master mp4 path}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/media/home"
D=$(awk "BEGIN{print $MATCH + $XFADE}")

# DIFF SCAN (uncomment to re-find MATCH for a new master): lower YAVG = closer
# to frame 0. Scan the back half; the minimum is your MATCH.
#   ffmpeg -ss 0 -i "$SRC" -frames:v 1 -vf scale=160:90 /tmp/ref.png -y
#   for t in $(seq 10 0.3 15); do
#     ffmpeg -ss $t -i "$SRC" -frames:v 1 -vf scale=160:90 /tmp/c.png -y 2>/dev/null
#     ffmpeg -i /tmp/ref.png -i /tmp/c.png -filter_complex \
#       "[0][1]blend=all_mode=difference,signalstats,metadata=print:file=/tmp/d.txt" \
#       -frames:v 1 -f null - -y 2>/dev/null
#     echo "t=$t $(grep -o 'YAVG=[0-9.]*' /tmp/d.txt | head -1)"
#   done

echo "Building seamless 1440p loop (match=${MATCH}s, xfade=${XFADE}s, out=${D}s)…"
ffmpeg -hide_banner -loglevel error -i "$SRC" -filter_complex "
[0:v]scale=2560:1440:flags=lanczos,format=yuv420p,trim=0:${D},setpts=PTS-STARTPTS,split=3[c1][c2][c3];
[c1]trim=0:${XFADE},setpts=PTS-STARTPTS[head];
[c2]trim=${XFADE}:${MATCH},setpts=PTS-STARTPTS[mid];
[c3]trim=${MATCH}:${D},setpts=PTS-STARTPTS,format=yuva420p,fade=t=out:st=0:d=${XFADE}:alpha=1[tail];
[head][tail]overlay=format=auto,format=yuv420p[xf];
[xf][mid]concat=n=2:v=1[out]
" -map "[out]" -c:v libx264 -profile:v high -level 5.1 -pix_fmt yuv420p -crf 19 -preset slow \
  -movflags +faststart -an "$OUT/portal-loop.mp4" -y

echo "Regenerating matching poster stills (frame 0 of the loop, 1080p)…"
ffmpeg -hide_banner -loglevel error -i "$OUT/portal-loop.mp4" -frames:v 1 -vf scale=1920:1080 /tmp/poster.png -y
ffmpeg -hide_banner -loglevel error -i /tmp/poster.png -c:v libwebp -quality 80 "$OUT/portal-scene.webp" -y
ffmpeg -hide_banner -loglevel error -i /tmp/poster.png -c:v libaom-av1 -still-picture 1 -crf 32 -b:v 0 "$OUT/portal-scene.avif" -y

echo "Done. Verify the loop seam (should be ~0):"
ffmpeg -hide_banner -loglevel error -i "$OUT/portal-loop.mp4" -vf "select=eq(n\,0),scale=160:90" -frames:v 1 /tmp/f.png -y
ffmpeg -hide_banner -loglevel error -sseof -0.1 -i "$OUT/portal-loop.mp4" -vf scale=160:90 -frames:v 1 /tmp/l.png -y
ffmpeg -hide_banner -loglevel error -i /tmp/f.png -i /tmp/l.png -filter_complex \
  "[0][1]blend=all_mode=difference,signalstats,metadata=print:file=/tmp/seam.txt" -frames:v 1 -f null - -y 2>/dev/null
grep -o 'YAVG=[0-9.]*' /tmp/seam.txt | head -1
