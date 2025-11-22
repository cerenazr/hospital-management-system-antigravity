import cv2
import os
import numpy as np

# Paths
input_video_path = os.path.abspath(os.path.join(__file__, '..', 'zoom_demo_video', 'final_zoom_cypress_demo.mp4'))
output_dir = os.path.abspath(os.path.join(__file__, '..', 'zoom_demo_video'))
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, 'final_zoom_cypress_demo_30s.mp4')

# Desired duration (seconds)
target_duration = 30.0

# Open input video
cap = cv2.VideoCapture(input_video_path)
if not cap.isOpened():
    raise RuntimeError(f"Cannot open video: {input_video_path}")

fps = cap.get(cv2.CAP_PROP_FPS)
frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

original_duration = frame_count / fps
repeat_factor = target_duration / original_duration  # >1 means slower
int_repeat = int(repeat_factor)
frac = repeat_factor - int_repeat

fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

while True:
    ret, frame = cap.read()
    if not ret:
        break
    # Write each frame multiple times
    for _ in range(int_repeat):
        out.write(frame)
    # Occasionally write an extra frame to account for fractional part
    if frac > 0 and np.random.rand() < frac:
        out.write(frame)

cap.release()
out.release()
print(f"30‑second slowed video saved to {output_path}")
