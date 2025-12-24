# PWA Setup for Expein

Your app is now configured as a Progressive Web App (PWA) with splash screen support! 🎉

## Features Enabled

✅ **Offline Support** - App works without internet connection  
✅ **Install to Home Screen** - Users can install the app like a native app  
✅ **Splash Screen** - Beautiful loading screen on app launch  
✅ **Service Worker** - Automatic caching and updates  
✅ **Responsive Icons** - Optimized for all devices  

## PWA Icons

Your app now includes comprehensive icon sets for all platforms! ✨

### Icon Structure

```
/public
├── android/           # Android launcher icons
│   ├── android-launchericon-48-48.png
│   ├── android-launchericon-72-72.png
│   ├── android-launchericon-96-96.png
│   ├── android-launchericon-144-144.png
│   ├── android-launchericon-192-192.png
│   └── android-launchericon-512-512.png
├── ios/               # iOS app icons (all sizes)
│   ├── 180.png        # Primary Apple touch icon
│   ├── 152.png
│   ├── 167.png
│   └── [additional sizes]
└── windows11/         # Windows 11 tiles
    ├── Square44x44Logo.*
    ├── Square150x150Logo.*
    ├── Wide310x150Logo.*
    └── [additional tiles]
```

### Supported Platforms

- ✅ **Android**: All launcher icon sizes (48px - 512px)
- ✅ **iOS**: Complete icon set including Apple touch icons
- ✅ **Windows 11**: Tiles and logos for all Windows contexts
- ✅ **Web**: Maskable icons for modern browsers

### Icon Guidelines

All icons follow PWA best practices:
- Square design (1:1 aspect ratio)
- Safe area padding from edges
- Works on both light and dark backgrounds
- Optimized file sizes

## How to Use

### Development

```bash
npm run dev
```

The app will run with PWA features enabled.

### Production Build

```bash
npm run build
npm run preview
```

After building, the following files will be auto-generated:
- `manifest.webmanifest` - PWA configuration
- `sw.js` - Service worker for offline support
- `workbox-*.js` - Caching strategies

### Testing PWA

1. **Chrome DevTools**:
   - Open DevTools → Application tab
   - Check "Manifest" and "Service Workers" sections
   - Use Lighthouse to audit PWA score

2. **Install Prompt**:
   - Visit your deployed app
   - Look for "Install App" icon in browser address bar
   - Click to install to home screen

3. **Offline Mode**:
   - Open DevTools → Network tab
   - Select "Offline" from throttling dropdown
   - Refresh page - app should still work!

## Splash Screen

The splash screen appears:
- ✅ On first visit to the app
- ✅ When app is launched from home screen
- ❌ Not on subsequent navigations within the same session

To customize the splash screen, edit:
```
src/components/SplashScreen.tsx
```

## Browser Support

| Browser | Install Support | Offline Support |
|---------|----------------|-----------------|
| Chrome | ✅ | ✅ |
| Edge | ✅ | ✅ |
| Safari (iOS 16.4+) | ✅ | ✅ |
| Firefox | ❌ | ✅ |
| Samsung Internet | ✅ | ✅ |

## Configuration

### Manifest (vite.config.ts)

```typescript
{
  name: 'Expein - Expense Tracker',
  short_name: 'Expein',
  theme_color: '#1a1a1a',
  background_color: '#1a1a1a',
  display: 'standalone'
}
```

### Service Worker

Configured with Workbox for:
- Static asset caching
- API request caching (Supabase)
- Background sync (future feature)
- Push notifications (future feature)

## Deployment

When deploying to production:

1. Ensure all icon files are in `/public`
2. Run `npm run build`
3. Deploy the `/dist` folder
4. Verify HTTPS is enabled (required for PWA)
5. Test with Chrome DevTools Lighthouse

## Troubleshooting

### Icons not showing?
- Check that all icon files exist in `/public`
- Clear browser cache
- Verify file names match exactly

### Service Worker not registering?
- Ensure you're using HTTPS (or localhost)
- Check browser console for errors
- Try clearing site data in DevTools

### Install prompt not appearing?
- App must meet PWA criteria (check Lighthouse)
- Must be served over HTTPS
- Icons must be present
- User hasn't previously dismissed the prompt

## Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Workbox Guide](https://developers.google.com/web/tools/workbox)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

---

**Note**: After generating icons, you can delete `generate-icons.html` if you wish.

