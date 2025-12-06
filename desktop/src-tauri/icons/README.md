# Icon Placeholder

This folder should contain your application icons in the following formats:

- `32x32.png` - 32x32 pixels
- `128x128.png` - 128x128 pixels
- `128x128@2x.png` - 256x256 pixels (for retina displays)
- `icon.icns` - macOS icon file
- `icon.ico` - Windows icon file

## How to Generate Icons

You can use tools like:
- https://icon.kitchen/ (online)
- https://github.com/tauri-apps/tauricon (CLI tool)

Or manually create them using design software.

## Quick Setup

1. Create a 512x512 PNG of your logo
2. Use `cargo install tauri-icon` 
3. Run `cargo tauri icon path/to/your-icon.png`
4. Icons will be generated automatically

For now, Tauri will use default placeholder icons.
