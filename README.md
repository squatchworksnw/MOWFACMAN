# MOW Facilities Hub

This is an installable MOW Facilities Tracker app. It stores your project data in the browser on the device you use.

It also includes a Facilities Management expansion for importing the Meals on Wheels Master Calendar workbook. Use **Load Backup / Excel** to load either a JSON backup or an `.xlsx` / `.xlsm` workbook. Facilities data is saved into the same local browser storage and included in backups.

Facilities views include:

- Facilities Dashboard
- Maintenance Calendar
- Recurring Maintenance
- Fleet
- Equipment
- Mileage Log
- Repair Log
- Walkthrough Checklist

The app can print the standard remodel report plus facilities summary, and the Facilities Dashboard includes quick print buttons for monthly, open issues, fleet, and walkthrough reports.

Contractor bids and Document Intake can store Google Drive PDF links. Upload each bid PDF to Drive, copy the sharing link, and paste it into the app. If the PDF text can be copied, paste that text into Document Intake and click **Extract & Review** to fill common fields such as contractor, contact info, license, insurance, amount, labor, materials, tax, warranty, timeline, and scope before saving.

## Google Sync

This version includes a Google backend URL field plus **Save to Google** and **Load from Google** buttons. The current backend URL is prefilled in the app. Use **Save to Google** after important changes, then use **Load from Google** on another device to pull the same tracker data.

You can also turn on **Auto-save changes to Google** and **Auto-load latest Google save when opening** inside Settings. The app waits briefly after each local change, then sends the latest data to Google automatically. When auto-load is on, each device pulls the latest Google save shortly after the app opens.

Settings now has its own tab for Google sync and local file backup/import. Reports also has its own tab with a custom report builder where you can choose a date range and select which sections to include before printing.

Keep using **Save Backup** for extra safety before major imports or edits.

If Google sync reports an error or your backend URL changes, paste the included `google-apps-script-backend.gs` code into Apps Script, deploy a new Web App version, and put the new `/exec` URL into Settings.

## Use It On This Computer

Open `index.html` in a browser. This works offline as a local file.

## Install On iPhone Or iPad

Apple devices need the app to be served from a website address before they can install it cleanly and cache it offline.

1. Put this folder on a static host such as GitHub Pages, Netlify, Vercel, or another HTTPS website.
2. Open the website in Safari on the iPhone or iPad.
3. Tap Share.
4. Tap Add to Home Screen.
5. Open it from the Home Screen once while online so the offline cache is saved.

After that, the app can open offline from the Home Screen.

The app includes `manifest.json`, iPhone home screen meta tags, Apple touch icon support, root `icon-192.png` and `icon-512.png` files, mobile hamburger navigation, and `service-worker.js` for offline caching when hosted over HTTPS.

## Install On Mac

Open the hosted website in Safari, then use File > Add to Dock when available. Chrome and Edge can also install it from their app/install menu.

## Important

Data is saved in the browser on that device. Use Export JSON before switching devices, clearing browser data, or making a backup.
