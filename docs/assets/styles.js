// Display order (STYLE_ORDER) is separate from this list, so reordering it never breaks old links.
// One line per style. To add a style: upload its folder, then add a line at the END of this list.
// The website and the Worker both read this file. Never reorder or delete lines, old links depend on the order.
window.STYLES_DATA=[
{"id": "glass", "name": "Glass", "folder": "Badges", "note": "Dark tinted glass pills", "bg": "dark"},
{"id": "neon", "name": "Neon", "folder": "Badges-Neon", "note": "Glowing gradient text, no background", "bg": "dark"},
{"id": "solid", "name": "Solid", "folder": "Badges-Solid", "note": "Flat single-colour pills, white text", "bg": "dark"},
{"id": "light", "name": "Light", "folder": "Badges-Light", "note": "Soft pastel pills for light screens", "bg": "light"},
{"id": "icon-dark", "name": "Icon Dark", "folder": "Badges-Icon-Dark", "note": "Gradient icon tiles on dark glass", "bg": "dark"},
{"id": "split", "name": "Split", "folder": "Badges-Split", "note": "Colored icon joined to a dark label", "bg": "dark"},
{"id": "frost", "name": "Frost", "folder": "Badges-Frost", "note": "Frosted glass that suits posters", "bg": "dark"},
{"id": "neon-icon", "name": "Neon Icon", "folder": "Badges-Neon-Icon", "note": "Glowing icons and text, no background", "bg": "dark"},
{"id": "minimal", "name": "Minimal", "folder": "Badges-Minimal", "note": "Flat dark pills with a colored dot", "bg": "dark"},
{"id": "icon-light", "name": "Icon Light", "folder": "Badges-Icon-Light", "note": "Gradient icon tiles on pastel", "bg": "light"},
{"id": "black-white", "name": "Black & White", "folder": "Badges-Black-White", "note": "Black glass pills, white text", "bg": "dark"},
{"id": "white-black", "name": "White & Black", "folder": "Badges-White-Black", "note": "White glass pills, black text", "bg": "light"},
{"id": "text-white", "name": "Text White", "folder": "Badges-Text-White", "note": "White text only", "bg": "dark"},
{"id": "text-black", "name": "Text Black", "folder": "Badges-Text-Black", "note": "Black text only", "bg": "light"},
{"id": "pastel", "name": "Pastel", "folder": "Badges-Pastel", "note": "Each category in its own soft colour, flags on languages", "bg": "dark", "same1l": true},
{"id": "glass-vibrant", "name": "Glass Vibrant", "folder": "Badges-Glass-Vibrant", "note": "Glass pills in vivid candy colours, white text", "bg": "dark"},
{"id": "pixel", "name": "Pixel", "folder": "Badges-Pixel", "note": "Pixel-art blocks with chunky retro text", "bg": "dark"},
{"id": "glow-bar", "name": "Glow Bar", "folder": "Badges-Glow-Bar", "note": "Bold text, no background, with a glowing accent line", "bg": "dark"}
];
window.STYLE_ORDER=["glass", "glass-vibrant", "pixel", "glow-bar", "solid", "light", "pastel", "frost", "black-white", "white-black", "text-white", "text-black", "neon", "neon-icon", "icon-dark", "icon-light", "split", "minimal"];
window.STYLES_SHOW=window.STYLE_ORDER.map(i=>window.STYLES_DATA.find(s=>s.id===i)).filter(Boolean).concat(window.STYLES_DATA.filter(s=>!window.STYLE_ORDER.includes(s.id)));
