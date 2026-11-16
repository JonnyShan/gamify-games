#!/usr/bin/env bash
# Cut a phone screen recording into a library hover clip: crop off the status bar and browser bar,
# trim, scale to 540 wide, no audio.
# Usage: tools/cut-phone-clip.sh <in.mp4> <out.mp4> <start_s> <length_s> <crop_top_px> <crop_bottom_px>
set -euo pipefail
in=$1 out=$2 ss=$3 len=$4 top=$5 bot=$6
h=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$in")
w=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$in")
ch=$(( (h - top - bot) / 2 * 2 ))
ffmpeg -loglevel error -y -ss "$ss" -i "$in" -t "$len" -an \
  -vf "crop=${w}:${ch}:0:${top},scale=540:-2:flags=lanczos,fps=30" \
  -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart "$out"
echo "wrote $out ($(du -h "$out" | cut -f1))"
