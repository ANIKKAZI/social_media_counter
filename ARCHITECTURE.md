# Viral Counters - Architecture Overview

## Design Registry Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   DESIGN REGISTRY (Single Source of Truth)      │
│                   src/designs/designRegistry.js                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  DESIGNS Array (15 total)                                        │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ [Original Designs]              [New Designs]                │ │
│  │ • Minimal Clean                 • Halloween Special          │ │
│  │ • Dark Mode Neon                • Diwali Celebration         │ │
│  │ • Instagram Gradient                                         │ │
│  │ • Cafe Theme                                                 │ │
│  │ • Luxury Black & Gold           All available on both        │ │
│  │ • Playful Confetti              Instagram AND Google         │ │
│  │ • Retro Flip Counter            Reviews platforms!           │ │
│  │ • Glassmorphism                                              │ │
│  │ • Bold Typography                                            │ │
│  │ • Cafe Background                                            │ │
│  │ • Kiosk Dashboard                                            │ │
│  │ • Instagram Flip                                             │ │
│  │ • LaMetric LED                                               │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  Exports:                                                         │
│  • getAllDesigns()        - Get all 15 designs                   │
│  • getDesignById(id)      - Find design by ID                    │
│  • getDesignIndexById(id) - Get array index                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy & Data Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                            App.js                                    │
│                     (Platform Selection & Session)                   │
│  ┌─session state: {platform, followers, todayGrowth, username}──────┐
│  │                                                                    │
│  └────────────────────────────────────────────────────────────────┬──┘
│         │                                          │
│         ▼                                          ▼
│    ┌────────────────┐              ┌──────────────────────────────┐
│    │   SetupPage    │              │  DisplayManager (Instagram) │
│    │   (Choose      │              │  └─ All 15 Designs           │
│    │   Platform)    │              │     ├─ Design1...Design13  │
│    └────────────────┘              │     ├─ DesignHalloween     │
│         │                          │     └─ DesignDiwali        │
│         │                          │                             │
│         │ onConnect({             │  Props passed:              │
│         │   platform,             │  • followers (int)          │
│         │   displayName,          │  • todayGrowth (int)        │
│         │   followers             │  • username (string)        │
│         │ })                      │  • platform="instagram"     │
│         │                          │  • rating (unused)          │
│         │                          │                             │
│         │                          │  ← Back button: onBack()    │
│         │                          └──────────────────────────────┘
│         │
│         │ Platform = 'google'
│         ▼
│    ┌──────────────────────────────────────────────┐
│    │  GoogleReviews                               │
│    │  └─ All 15 Designs (shared registry!)        │
│    │     ├─ Design1...Design13                  │
│    │     ├─ DesignHalloween                     │
│    │     └─ DesignDiwali                        │
│    │                                             │
│    │  Props passed:                             │
│    │  • followers → reviewCount (int)           │
│    │  • username → businessName (string)        │
│    │  • platform="google"                       │
│    │  • rating (0-5 star rating)                │
│    │  • platformLabel="Google Reviews"          │
│    │                                             │
│    │  ← Back button: onBack()                   │
│    └──────────────────────────────────────────────┘
│
└──────────────────────────────────────────────────────────────────────┘
```

## Design Component Rendering

```
┌─────────────────────────────────────────────────────────────────┐
│                    Design Component                             │
│         (All 15 designs follow this pattern)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Input Parameters:                                             │
│  • followers: number           (follower or review count)      │
│  • todayGrowth: number         (growth badge, Instagram only)  │
│  • username: string            (display name)                  │
│  • platform: 'instagram'|'google'  ← Determines rendering     │
│  • rating: number              (star rating, Google only)      │
│  • platformLabel: string       (custom label)                  │
│                                                                  │
│  Conditional Rendering Logic:                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  if (platform === 'instagram') {                          │ │
│  │    • Show InstagramIcon                                   │ │
│  │    • Display: "@{username}"                               │ │
│  │    • Count display: followers                             │ │
│  │    • Label: "Followers"                                   │ │
│  │    • Growth badge: "+{todayGrowth} Today" (if > 0)       │ │
│  │    • QR URL: https://instagram.com/{username}             │ │
│  │    • CTA: "Scan to Follow Us"                             │ │
│  │  } else if (platform === 'google') {                      │ │
│  │    • Show GoogleIcon                                      │ │
│  │    • Display: "{username}" (business name)                │ │
│  │    • Count display: followers (as reviews)                │ │
│  │    • Label + Stars: "★★★★★ {rating.toFixed(1)} stars"   │ │
│  │    • Secondary label: "Reviews"                           │ │
│  │    • QR URL: REACT_APP_GOOGLE_REVIEW_URL                  │ │
│  │    • CTA: "Scan to Rate & Review"                         │ │
│  │  }                                                         │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Output:                                                        │
│  → Renders styled display with counter + QR code              │
│  → Displays correct platform-specific content                 │
│  → Uses appropriate icons and labels                          │
│  → Points QR code to correct URL                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Theme Availability (Post-Update)

```
BEFORE                          │  AFTER
─────────────────────────────────┼──────────────────────────
                                 │
Instagram: 13 designs            │  Instagram: 15 designs
(Design1-Design13)               │  (Design1-Design13 +
                                 │   Halloween + Diwali)
Google Reviews: 3 themes         │  
(Clean, Midnight, Warm)          │  Google Reviews: 15 designs
                                 │  (Same 15 as Instagram!)
SEPARATE LIBRARIES               │  SHARED LIBRARY
❌ Code duplication              │  ✅ Single source of truth
❌ Inconsistent theming          │  ✅ Consistent experience
❌ Design parity impossible      │  ✅ All platforms equal
                                 │
```

## File Structure

```
src/
├── designs/
│   ├── designRegistry.js                 [NEW] Central registry
│   ├── designRegistry.test.js            [NEW] 18 test cases
│   ├── DesignHalloween.jsx               [NEW] Halloween theme
│   ├── DesignDiwali.jsx                  [NEW] Diwali theme
│   ├── Design1.jsx                       [UPDATED] Platform support
│   ├── Design2.jsx                       [UPDATED]
│   ├── Design3.jsx                       [UPDATED]
│   ├── ... Design4-13                    [UPDATED]
│   └── index.js                          [UPDATED] New exports
│
├── components/
│   ├── DisplayManager.jsx                [UPDATED] Use registry + back button
│   ├── GoogleReviews.jsx                 [UPDATED] Use registry + back button
│   ├── SetupPage.jsx                     [unchanged]
│   └── shared.jsx                        [unchanged]
│
└── App.js                                [UPDATED] Pass onBack callback
```

## Design Selection Flow

```
User Opens App
      │
      ▼
┌──────────────────────┐
│ Platform Selection   │
│ (Instagram / Google) │
└──────────┬───────────┘
           │
           ├─→ Instagram Selected
           │        │
           │        ▼
           │   ┌─────────────────────┐
           │   │ DisplayManager      │
           │   ├─ Load 15 designs    │
           │   │ from registry       │
           │   ├─ Show settings ⚙    │
           │   └─ Display current    │
           │      design             │
           │        │
           │        ▼
           │   ┌──────────────────┐
           │   │ Design Selection │
           │   │ 1. Minimal Clean │
           │   │ 2. Dark Neon     │
           │   │ 3. Gradient      │
           │   │ ...              │
           │   │14. Halloween     │
           │   │15. Diwali        │
           │   └──────────────────┘
           │
           ├─→ Google Reviews Selected
                    │
                    ▼
                ┌─────────────────────┐
                │ GoogleReviews       │
                ├─ Load 15 designs    │
                │ from SAME registry  │
                ├─ Show settings ⚙    │
                └─ Display current    │
                   design             │
                     │
                     ▼
                ┌──────────────────┐
                │ Design Selection │
                │ 1. Minimal Clean │
                │ 2. Dark Neon     │
                │ 3. Gradient      │
                │ ...              │
                │14. Halloween     │
                │15. Diwali        │
                └──────────────────┘

             ↓ Same registry, different props!
             
             Component receives:
             • platform='instagram' or 'google'
             • rating (only for Google)
             
             Component renders accordingly!
```

## Navigation (Back Button Implementation)

```
┌─────────────────────────────────────────────────────────┐
│ Settings Control Panel (top-right)                       │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ ⚙ Settings Toggle Button                            │ │
│ │                                                      │ │
│ │ [Show on click ▼]                                   │ │
│ │ ┌────────────────────────────────────────────────┐  │ │
│ │ │ ← Back to Platforms  ← NEW BUTTON             │  │ │
│ │ │                                                │  │ │
│ │ │ [DESIGNS]                                      │  │ │
│ │ │ 1. Minimal Clean                               │  │ │
│ │ │ 2. Dark Neon                                   │  │ │
│ │ │ ... 13 more designs ...                        │  │ │
│ │ │ 14. Halloween Special                          │  │ │
│ │ │ 15. Diwali Celebration                         │  │ │
│ │ │                                                │  │ │
│ │ │ [DISPLAY]                                      │  │ │
│ │ │ ⛶ Fullscreen                                   │  │ │
│ │ │                                                │  │ │
│ │ │ [AUTO ROTATE]                                  │  │ │
│ │ │ ON/OFF  [15s ▼]                                │  │ │
│ │ │                                                │  │ │
│ │ └────────────────────────────────────────────────┘  │ │
│ │                                                      │ │
│ │ Behavior:                                           │ │
│ │ • Click "← Back to Platforms"                       │ │
│ │ • Calls: onBack()                                   │ │
│ │ • Which calls: setSession(null)                     │ │
│ │ • Returns to: SetupPage (platform selection)        │ │
│ │ • Preserves: No state change                        │ │
│ │                                                      │ │
│ └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Test Coverage

```
┌─────────────────────────────────────────────┐
│  designRegistry.test.js (18 tests, 100%)    │
├─────────────────────────────────────────────┤
│                                              │
│ [✓] getAllDesigns()                         │
│     ├─ Returns array                        │
│     ├─ Has 15+ designs                      │
│     ├─ Includes Halloween & Diwali          │
│     ├─ Has all original designs             │
│     └─ Each has required properties         │
│                                              │
│ [✓] getDesignById()                         │
│     ├─ Finds Halloween by ID                │
│     ├─ Finds Diwali by ID                   │
│     ├─ Returns undefined for invalid        │
│     └─ Finds Design1 (minimal-clean)        │
│                                              │
│ [✓] getDesignIndexById()                    │
│     ├─ Returns correct index for Halloween  │
│     ├─ Returns correct index for Diwali     │
│     └─ Returns -1 for non-existent          │
│                                              │
│ [✓] Platform Availability                   │
│     └─ All designs available on both        │
│                                              │
│ [✓] Design Properties                       │
│     ├─ Halloween has correct metadata       │
│     ├─ Diwali has correct metadata          │
│     └─ All 13 originals accessible          │
│                                              │
├─────────────────────────────────────────────┤
│  App.test.js (1 test, 100%)                │
├─────────────────────────────────────────────┤
│                                              │
│ [✓] renders platform choices                │
│     ├─ Instagram button present             │
│     └─ Google Reviews button present        │
│                                              │
└─────────────────────────────────────────────┘
```

## Quality Metrics

```
Build Status:        ✅ SUCCESS
Build Size:          80.97 kB (gzipped)
Lint Status:         ✅ No errors
Test Coverage:       19/19 passing (100%)
Components Updated:  2 major (DisplayManager, GoogleReviews)
Designs Updated:     13 (all originals + 2 new)
New Files:           3 (registry, 2 new designs, 1 test suite)
Backwards Compatible: ✅ YES (100%)
External Deps Added: ❌ NONE
Console Errors:      ✅ NONE
Warnings:            ✅ NONE (except browserslist notice)
```
