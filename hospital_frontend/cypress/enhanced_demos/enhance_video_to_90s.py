import cv2
import os

# Input: the original Cypress test video (≈6 s)
input_video_path = os.path.abspath(os.path.join(__file__, '..', '..', 'videos', 'hospital_flow.cy.ts.mp4'))
# Output directory (create if missing)
output_dir = os.path.abspath(os.path.join(__file__, '..', '..', '..', 'zoom_demo_video'))
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, 'final_zoom_enhanced_cypress_demo_90s_from_6s.mp4')

# Open input video
cap = cv2.VideoCapture(input_video_path)
if not cap.isOpened():
    raise RuntimeError(f"Cannot open video: {input_video_path}")

fps = cap.get(cv2.CAP_PROP_FPS)
frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

# Desired output duration = 90 seconds
target_duration = 90.0
# Compute target fps so that all original frames are spread over 90 s
target_fps = max(1, frame_count / target_duration)
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(output_path, fourcc, target_fps, (width, height))

while True:
    ret, frame = cap.read()
    if not ret:
        break
    out.write(frame)

cap.release()
out.release()
print(f"90‑second slowed video saved to {output_path}")
