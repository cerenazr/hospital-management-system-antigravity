import cv2
import numpy as np
import os

# Paths (relative to this script)
input_video_path = os.path.abspath(os.path.join(__file__, '..', '..', 'videos', 'hospital_flow.cy.ts.mp4'))
output_dir = os.path.abspath(os.path.join(__file__, '..', '..', '..', 'zoom_demo_video'))
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, 'final_zoom_enhanced_cypress_demo_20s_smooth.mp4')

# Parameters for ultra‑smooth tracking
zoom_factor_active = 1.3
zoom_factor_idle = 1.0
smoothing_alpha = 0.05  # strong smoothing

# Helper: detect red cursor (same as before)
def detect_red_cursor(frame):
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    lower_red1 = np.array([0, 70, 50])
    upper_red1 = np.array([10, 255, 255])
    lower_red2 = np.array([170, 70, 50])
    upper_red2 = np.array([180, 255, 255])
    mask1 = cv2.inRange(hsv, lower_red1, upper_red1)
    mask2 = cv2.inRange(hsv, lower_red2, upper_red2)
    mask = cv2.bitwise_or(mask1, mask2)
    kernel = np.ones((3, 3), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return None
    largest = max(contours, key=cv2.contourArea)
    if cv2.contourArea(largest) < 5:
        return None
    M = cv2.moments(largest)
    if M['m00'] == 0:
        return None
    cx = int(M['m10'] / M['m00'])
    cy = int(M['m01'] / M['m00'])
    return (cx, cy)

# Open video
cap = cv2.VideoCapture(input_video_path)
if not cap.isOpened():
    raise RuntimeError(f"Cannot open video: {input_video_path}")

fps = cap.get(cv2.CAP_PROP_FPS)
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

# Write at original fps but stop after 20 seconds
max_frames = int(fps * 20)
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

smoothed_pos = None
frame_idx = 0
while True:
    if frame_idx >= max_frames:
        break
    ret, frame = cap.read()
    if not ret:
        break
    cursor_pos = detect_red_cursor(frame)
    active = cursor_pos is not None
    if active:
        if smoothed_pos is None:
            smoothed_pos = np.array(cursor_pos, dtype=np.float32)
        else:
            smoothed_pos = (1 - smoothing_alpha) * smoothed_pos + smoothing_alpha * np.array(cursor_pos, dtype=np.float32)
    else:
        if smoothed_pos is None:
            smoothed_pos = np.array([width // 2, height // 2], dtype=np.float32)
    zoom = zoom_factor_active if active else zoom_factor_idle
    cx, cy = smoothed_pos
    tx = width / 2 - cx * zoom
    ty = height / 2 - cy * zoom
    M = np.array([[zoom, 0, tx], [0, zoom, ty]], dtype=np.float32)
    transformed = cv2.warpAffine(frame, M, (width, height), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    out.write(transformed)
    frame_idx += 1

cap.release()
out.release()
print(f"Final 20‑second smooth video saved to {output_path}")
