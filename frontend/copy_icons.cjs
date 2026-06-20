const fs = require('fs');
const path = require('path');

const sourceIcon = path.join(__dirname, 'public', 'icon-512.png');
const resDir = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');

if (!fs.existsSync(sourceIcon)) {
  console.error("Source icon not found:", sourceIcon);
  process.exit(1);
}

const targetFiles = [
  'drawable/splash.png',
  'drawable-land-hdpi/splash.png',
  'drawable-land-mdpi/splash.png',
  'drawable-land-xhdpi/splash.png',
  'drawable-land-xxhdpi/splash.png',
  'drawable-land-xxxhdpi/splash.png',
  'drawable-port-hdpi/splash.png',
  'drawable-port-mdpi/splash.png',
  'drawable-port-xhdpi/splash.png',
  'drawable-port-xxhdpi/splash.png',
  'drawable-port-xxxhdpi/splash.png',
  'mipmap-hdpi/ic_launcher.png',
  'mipmap-hdpi/ic_launcher_foreground.png',
  'mipmap-hdpi/ic_launcher_round.png',
  'mipmap-mdpi/ic_launcher.png',
  'mipmap-mdpi/ic_launcher_foreground.png',
  'mipmap-mdpi/ic_launcher_round.png',
  'mipmap-xhdpi/ic_launcher.png',
  'mipmap-xhdpi/ic_launcher_foreground.png',
  'mipmap-xhdpi/ic_launcher_round.png',
  'mipmap-xxhdpi/ic_launcher.png',
  'mipmap-xxhdpi/ic_launcher_foreground.png',
  'mipmap-xxhdpi/ic_launcher_round.png',
  'mipmap-xxxhdpi/ic_launcher.png',
  'mipmap-xxxhdpi/ic_launcher_foreground.png',
  'mipmap-xxxhdpi/ic_launcher_round.png'
];

targetFiles.forEach(file => {
  const destPath = path.join(resDir, file);
  if (fs.existsSync(path.dirname(destPath))) {
    fs.copyFileSync(sourceIcon, destPath);
    console.log(`Copied to ${destPath}`);
  }
});
