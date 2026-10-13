# Android Tablet Deployment

This setup runs the React production build and Node backend locally on the Android tablet.

## What Runs On The Tablet

- Termux runs Node.js.
- PM2 keeps `server/server.js` alive.
- `server/server.js` serves both `/api/*` and the React `build/` folder.
- The kiosk browser opens `http://127.0.0.1:4000`.
- Local values are read from `.env` or from `SOCIAL_COUNTER_ENV_PATH`.

## Build On Your Computer

```sh
npm install
npm run build
```

Copy this project folder to the tablet after the build exists. The folder must include:

- `build/`
- `server/`
- `package.json`
- `package-lock.json`
- `.env`

Do not commit the real `.env`. Use `.env.example` as the template.

## Install Apps On The Tablet

Install:

- Termux
- Termux:Boot
- Fully Kiosk Browser, or another kiosk browser that can open a URL on boot

Disable Android battery optimization for Termux, Termux:Boot, and the kiosk browser.

## Prepare Termux

In Termux:

```sh
pkg update
pkg install nodejs
npm install -g pm2
```

Put the app somewhere stable, for example:

```sh
~/social-media-counter
```

Install production dependencies:

```sh
cd ~/social-media-counter
npm install --omit=dev
```

Create `.env`:

```sh
cp .env.example .env
nano .env
```

At minimum, set:

```sh
META_ACCESS_TOKEN=...
GOOGLE_PLACES_API_KEY=...
GOOGLE_PLACE_ID=...
GOOGLE_REVIEW_URL=...
PORT=4000
```

## Start The App With PM2

```sh
cd ~/social-media-counter
pm2 start server/server.js --name social-counter
pm2 save
```

Test in the tablet browser:

```text
http://127.0.0.1:4000
```

## Start Automatically After Reboot

Open Termux:Boot once so Android grants it boot access.

Create the boot script:

```sh
mkdir -p ~/.termux/boot
nano ~/.termux/boot/start-social-counter.sh
```

Paste:

```sh
#!/data/data/com.termux/files/usr/bin/sh
termux-wake-lock
cd "$HOME/social-media-counter"
pm2 resurrect
```

Make it executable:

```sh
chmod +x ~/.termux/boot/start-social-counter.sh
```

Reboot the tablet and open:

```text
http://127.0.0.1:4000
```

## Kiosk Browser

Set the kiosk browser start URL to:

```text
http://127.0.0.1:4000
```

Enable:

- launch on boot
- fullscreen/kiosk mode
- keep screen on
- reload on network/server error, if available

## Updating Client Values

Edit:

```sh
cd ~/social-media-counter
nano .env
```

Then restart:

```sh
pm2 restart social-counter
```

Use this for client-specific values:

```sh
GOOGLE_REVIEW_URL=...
GOOGLE_REVIEW_COUNT=...
GOOGLE_RATING=...
GOOGLE_PLACE_ID=...
META_ACCESS_TOKEN=...
```
