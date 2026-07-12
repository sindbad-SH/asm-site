#!/usr/bin/env bash
# make-meme-loop.sh — turn the operator's MEME animatic master into the
# web ambient loop for /venture/meme.astro: a SEAMLESS crossfade loop,
# native 1280x720 H.264 (already under the 1080p long-edge ceiling — this is
# a small ambient card in an article, not a hero, so no upscale), muted,
# faststart, plus the matching poster stills (avif + webp).
#
# Follows the same crossfade-loop technique as make-portal-loop.sh, scaled
# down for this clip: the 15.09s master doesn't loop cleanly (subtle
# background-texture shimmer drifts across the runtime), but a diff-scan
# against frame 0 found the content returns closest to the opening pose at
# ~9.9s (YAVG≈1.62, the scan minimum — see the DIFF SCAN block below), so we
# cut there and crossfade the seam.
#
# Usage:
#   ./make-meme-loop.sh "/path/to/hf_meme_master.mp4"
# Output (in public/media/venture/meme/): meme-loop.mp4, meme-poster.webp/.avif
#
# --- tuning for the 2026-07-12 master (hf_20260712_160325_...) ---
MATCH=9.9    # sec where the texture shimmer returns closest to frame 0 (diff-scan min)
XFADE=0.8    # crossfade seconds over the seam
# D (trim end) = MATCH + XFADE; the tail [MATCH:D] dissolves over head [0:XFADE]

set -euo pipefail
SRC="${1:?pass the raw MEME master mp4 path}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/media/venture/meme"
mkdir -p "$OUT"
D=$(awk "BEGIN{print $MATCH + $XFADE}")

# DIFF SCAN (uncomment to re-find MATCH for a new master): lower YAVG = closer
# to frame 0. Run from a directory whose path has no colon after the drive
# letter issue — cd into a plain path first (ffmpeg's metadata filter parses
# ':' as an option separator, so "file=C:/..." breaks; a relative filename
# from the cwd works fine). Scan the back half; the minimum is your MATCH.
#   ffmpeg -ss 0 -i "$SRC" -frames:v 1 -vf scale=160:90 ref.png -y
#   for t in $(seq 8 0.1 12); do
#     ffmpeg -ss $t -i "$SRC" -frames:v 1 -vf scale=160:90 c.png -y 2>/dev/null
#     ffmpeg -i ref.png -i c.png -filter_complex \
#       "[0][1]blend=all_mode=difference,signalstats,metadata=print:file=d.txt" \
#       -frames:v 1 -f null - -y 2>/dev/null
#     echo "t=$t $(grep -o 'YAVG=[0-9.]*' d.txt | head -1)"
#   done

echo "Building seamless 720p loop (match=${MATCH}s, xfade=${XFADE}s, out=${MATCH}s)…"
ffmpeg -hide_banner -loglevel error -i "$SRC" -filter_complex "
[0:v]scale=1280:720:flags=lanczos,format=yuv420p,trim=0:${D},setpts=PTS-STARTPTS,split=3[c1][c2][c3];
[c1]trim=0:${XFADE},setpts=PTS-STARTPTS[head];
[c2]trim=${XFADE}:${MATCH},setpts=PTS-STARTPTS[mid];
[c3]trim=${MATCH}:${D},setpts=PTS-STARTPTS,format=yuva420p,fade=t=out:st=0:d=${XFADE}:alpha=1[tail];
[head][tail]overlay=format=auto,format=yuv420p[xf];
[xf][mid]concat=n=2:v=1[out]
" -map "[out]" -c:v libx264 -profile:v high -level 4.1 -pix_fmt yuv420p -crf 22 -preset slow \
  -movflags +faststart -an "$OUT/meme-loop.mp4" -y

echo "Regenerating matching poster stills (frame 0 of the loop)…"
ffmpeg -hide_banner -loglevel error -i "$OUT/meme-loop.mp4" -frames:v 1 /tmp/meme-poster.png -y
ffmpeg -hide_banner -loglevel error -i /tmp/meme-poster.png -c:v libwebp -quality 82 "$OUT/meme-poster.webp" -y
ffmpeg -hide_banner -loglevel error -i /tmp/meme-poster.png -c:v libaom-av1 -still-picture 1 -crf 30 -b:v 0 "$OUT/meme-poster.avif" -y

echo "Done. File sizes:"
du -h "$OUT/meme-loop.mp4" "$OUT/meme-poster.webp" "$OUT/meme-poster.avif"

echo "Verify the loop seam (should be low, near the diff-scan minimum above):"
# NOTE: ffmpeg's metadata filter parses "file=" as a colon-delimited filter
# option, and MSYS/git-bash only auto-translates /tmp/... paths that appear
# as STANDALONE arguments — not when embedded inside a filter string like
# "file=/tmp/x.txt". So we cd into a plain-path scratch dir and use bare
# relative filenames here (same workaround as the DIFF SCAN block above).
SCRATCH=$(mktemp -d)
( cd "$SCRATCH"
  ffmpeg -hide_banner -loglevel error -i "$OUT/meme-loop.mp4" -vf "select=eq(n\,0),scale=160:90" -frames:v 1 f.png -y
  ffmpeg -hide_banner -loglevel error -sseof -0.1 -i "$OUT/meme-loop.mp4" -vf scale=160:90 -frames:v 1 l.png -y
  ffmpeg -hide_banner -loglevel error -i f.png -i l.png -filter_complex \
    "[0][1]blend=all_mode=difference,signalstats,metadata=print:file=seam.txt" -frames:v 1 -f null - -y 2>/dev/null
  grep -o 'YAVG=[0-9.]*' seam.txt | head -1
)
rm -rf "$SCRATCH"
