# Filepond-Dropbox Proof of Concept

Built for a project to upload user screenshots during a live performance.

To set up the dropbox side of it all in the base directory create a keys.js file.

To get your key start by creating an app at <a href="https://www.dropbox.com/lp/developers" target="_blank" rel="noreferrer">Dropbox Developer </a>. Create an app, change permissions so you can write files. That's extremely important since this permission is tied to the key being generated. Depending on use you may want to read files from an API integration but for my use case that wasn't the situtation. After that is done you can generate a token that doesn't expire. Copy that over to a keys.js and do a lovely export.

`module.exports = { DROPBOX: your key here}`

If you want a full walkthrough visit my <a href="https://dev.to/amsmo/filepond-in-react-to-a-dropbox-folder-with-an-express-backend-2j10" target="_blank" rel="noreferrer"> blog about it at</a>

To use please npm install in both the base directory and fp-db directory to ensure dependencies are available where you need them.
