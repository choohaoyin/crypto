# CRYPTO//TERMINAL

A distinctive, production-grade cryptocurrency market dashboard with a **Neo-Brutalist Terminal** aesthetic.

## 🎨 Design Philosophy

### Aesthetic Direction: Neo-Brutalist Financial Terminal

This interface breaks away from generic "AI slop" aesthetics by embracing a bold, industrial cyberpunk terminal design:

- **Raw & Utilitarian**: Stripped-down UI with high contrast and sharp edges
- **Terminal-Inspired**: Monospace typography, scan lines, and glitch effects
- **Industrial Palette**: Stark black background with electric lime green (#00ff41) accents
- **Atmospheric Effects**: CRT scanlines, noise texture, and subtle animations

### Typography

- **Display Font**: [Outfit](https://fonts.google.com/specimen/Outfit) - Bold, geometric sans-serif for headers
- **Monospace Font**: [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) - Technical, readable for data

*Avoiding generic fonts like Inter, Roboto, Space Grotesk, and system fonts.*

### Color Scheme

```css
--color-bg: #0a0a0a          /* Pure black background */
--color-surface: #1a1a1a      /* Card surfaces */
--color-border: #2a2a2a       /* Subtle borders */
--color-primary: #00ff41      /* Electric lime green */
--color-danger: #ff0055       /* Hot pink for losses */
--color-text: #ffffff         /* Pure white text */
--color-text-dim: #888888     /* Dimmed text */
```

### Key Visual Features

1. **CRT Scanline Effect** - Animated horizontal lines simulating old terminal displays
2. **Noise Texture Overlay** - Subtle grain for depth and character
3. **Glitch Animation** - Header text with chromatic aberration effects
4. **Card Hover States** - Elevated cards with glowing borders
5. **Staggered Entry Animation** - Cards fade in sequentially
6. **Live Status Indicator** - Pulsing green dot for real-time feed
7. **Custom Scrollbars** - Styled to match the terminal aesthetic

## 🚀 Tech Stack

### Modern & Optimal

- **Vue 3.4.21** - Latest Vue with Composition API support
- **Chart.js 4.4.2** - Modern, responsive charting library
- **Vanilla CSS** - No framework dependencies, custom design system
- **Native Fetch API** - Modern HTTP requests
- **LocalStorage API** - Client-side favorites persistence
- **CoinGecko API** - Real-time cryptocurrency market data

### Removed Outdated Dependencies

- ❌ Vue 2 (replaced with Vue 3)
- ❌ Tailwind CSS v1 (replaced with custom CSS)
- ❌ Chart.js 2.8 (upgraded to 4.4.2)
- ❌ Axios (replaced with native fetch)
- ❌ Module imports (simplified to single app.js)

## 🎯 Features

### Core Functionality

- **Real-time Market Data** - Top 20 cryptocurrencies by market cap
- **Multi-Currency Support** - Convert prices to 50+ fiat currencies
- **Favorites/Watchlist** - Persistent favorites using localStorage
- **Detailed Coin Modal** - 7-day price chart and comprehensive stats
- **Live Updates** - Auto-refresh market data every 60 seconds
- **Responsive Design** - Mobile-first, adapts to all screen sizes

### Distinctive UX Details

- **Terminal Clock** - Live timestamp in 24-hour format
- **Bracketed Navigation** - `[ALL MARKETS]` and `[WATCHLIST]` tabs
- **Price Change Badges** - Bordered indicators for gains/losses
- **Sparkline Charts** - Inline 7-day price trends with gradients
- **Volume Abbreviation** - Compact notation (1.2B, 345M, 67K)
- **Escape Key Support** - Close modal with keyboard
- **Smooth Animations** - 60fps CSS transitions

## 📁 Project Structure

```
crypto/
├── index.html              # Main HTML structure
├── assets/
│   ├── css/
│   │   └── style.css       # Complete design system (764 lines)
│   └── js/
│       └── app.js          # Vue 3 application (350 lines)
└── README.md               # Documentation
```

## 🛠️ Installation & Usage

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/choohaoyin/crypto.git
cd crypto
```

2. Serve with any static file server:
```bash
# Python 3
python3 -m http.server 8000

# Node.js (npx)
npx serve

# PHP
php -S localhost:8000
```

3. Open in browser:
```
http://localhost:8000
```

### Production Deployment

Deploy to any static hosting service:

- **GitHub Pages**: Enable in repository settings
- **Netlify**: Drag-and-drop the folder
- **Vercel**: Import repository
- **Cloudflare Pages**: Connect Git repository

No build step required - it's pure HTML, CSS, and JavaScript.

## 🎭 Design Decisions

### Why Neo-Brutalism?

Cryptocurrency is about disruption, transparency, and breaking from traditional systems. The neo-brutalist terminal aesthetic reflects these values:

- **Honesty**: Raw, unpolished UI reflects the volatile nature of crypto markets
- **Clarity**: High contrast ensures data is immediately readable
- **Authority**: Terminal aesthetic conveys technical sophistication
- **Memorability**: Distinctive visual identity stands out from generic dashboards

### Why These Fonts?

- **Outfit**: Modern, geometric, bold - perfect for crypto branding
- **IBM Plex Mono**: Designed by IBM for code - ideal for financial data
- Both are **free and open-source** Google Fonts

### Why No Framework CSS?

- **Performance**: Zero CSS framework overhead (~900KB+ saved)
- **Control**: Every pixel is intentional, no utility class soup
- **Distinctiveness**: Custom design system, not Tailwind patterns
- **Maintainability**: Clear, semantic CSS is easier to understand

### Why Vue 3?

- **Reactive**: Perfect for real-time market data updates
- **Lightweight**: Only 33KB gzipped
- **Modern**: Composition API for better code organization
- **No Build Step**: CDN version works instantly

## 🎨 Customization

### Change Color Scheme

Edit CSS variables in `assets/css/style.css`:

```css
:root {
    --color-primary: #00ff41;  /* Change accent color */
    --color-bg: #0a0a0a;       /* Change background */
    /* ... */
}
```

### Adjust Animation Speed

```css
:root {
    --scan-speed: 8s;           /* Scanline animation duration */
    --glitch-intensity: 2px;    /* Glitch effect strength */
}
```

### Modify Data Refresh Rate

In `assets/js/app.js`:

```javascript
// Refresh market data every X milliseconds
setInterval(() => {
    this.fetchMarketData();
}, 60000); // Change this value
```

## 🔒 Security & Privacy

- **No Authentication**: Public API, no user accounts
- **No Tracking**: No analytics or third-party scripts
- **Client-Side Storage**: Favorites stored locally in browser
- **HTTPS API**: All API calls use secure connections
- **No Secrets**: No API keys required for CoinGecko

## 📊 API Usage

### CoinGecko Free Tier

- **Rate Limit**: 10-30 requests/minute
- **Data**: Market prices, volumes, charts
- **Cost**: Free (no API key required)

To upgrade or use alternative APIs, modify the fetch calls in `assets/js/app.js`.

## 🐛 Known Limitations

- **Rate Limiting**: CoinGecko may rate-limit frequent refreshes
- **Market Cap**: Shows top 20 coins only (adjustable in API call)
- **Historical Data**: 7-day sparklines only
- **Browser Support**: Modern browsers only (ES6+, CSS Grid)

## 📝 License

This project is open source and available for personal and commercial use.

## 🙌 Credits

- **CoinGecko API**: Market data provider
- **Chart.js**: Charting library
- **Google Fonts**: Typography (Outfit, IBM Plex Mono)
- **Vue.js**: Frontend framework

---

**Built with attention to aesthetic details and a commitment to distinctive design.**

*Avoiding generic AI aesthetics since 2026.* ⚡
