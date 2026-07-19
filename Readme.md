# AURUM — Luxury Watch Demo
## WebDone Co. Demo Showcase

### 📁 File Structure
```
/
├── index.html          ← Complete site (self-contained)
├── images/
│   ├── watch_001.jpg   ← Frame 1: Full watch face, spotlight emerging
│   ├── watch_002.jpg   ← Frame 2: Slight rotate / crown details
│   ├── watch_003.jpg   ← Frame 3: Close-up on dial
│   ├── watch_004.jpg   ← Frame 4: Side profile / case thickness
│   ├── watch_005.jpg   ← Frame 5: 3/4 angle / bracelet
│   ├── watch_006.jpg   ← Frame 6: Clasp macro (GENERATE)
│   ├── watch_007.jpg   ← Frame 7: Crown jewel extreme macro (GENERATE)
│   ├── watch_008.jpg   ← Frame 8: Full float / weightless (GENERATE)
│   └── watch_009.jpg   ← Frame 9: Final reveal / money shot (GENERATE)
└── README.md
```

### 🎬 How the Scroll Sequence Works
- Section height = 900vh (9 screens of scroll)
- Canvas is sticky, images advance as user scrolls
- Falls back gracefully to animated gradient if images not present
- Works with any number of images (update IMAGE_PATHS array)

### 🖼️ Adding Your Images
1. Export all 9 images as JPG (quality 85+)
2. Name them watch_001.jpg through watch_009.jpg
3. Place in /images/ folder
4. Push to GitHub → auto-deploys to Cloudflare Pages

### ⚙️ Customization
In index.html, update:
- `IMAGE_PATHS` array → point to your image files
- `TOTAL_FRAMES` → number of images (auto-calculated)
- `height: 900vh` on #sequence-section → adjust scroll distance per frame
- Brand name "AURUM" → client name
- Prices, copy, references → real content
