require("dotenv").config();

const { addDays } = require("date-fns");

const express = require("express");
const { ShareServiceClient, StorageSharedKeyCredential, FileSASPermissions } = require("@azure/storage-file-share");

const path = require("path");
const open = require('open');

const app = express();
const port = "8080";

app.get("/", async (req, res, next) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/client.js", async (req, res, next) => {
  res.sendFile(path.join(__dirname, "client.js"));
});

app.get("/getSignedURL", async (req, res, next) => {
  const shareURL = new URL(process.env.AZURE_SHARE_URL);
  const storageOrigin = shareURL.origin;
  const shareName = path.basename(shareURL.pathname);
  const shareServiceClient = new ShareServiceClient(
    storageOrigin,
    new StorageSharedKeyCredential(process.env.STORAGE_ACCOUNT_NAME, process.env.STORAGE_ACCOUNT_KEY)
  );
  const shareClient = shareServiceClient.getShareClient(shareName);

  const fileClient = shareClient.rootDirectoryClient.getFileClient("test_file.txt");

  const permissions = new FileSASPermissions();
  permissions.read = true;
  permissions.create = true;
  permissions.delete = true;
  permissions.write = true;

  res.send(fileClient.generateSasUrl({
    permissions,
    expiresOn: addDays(new Date(), 10)
  }));
});

app.listen(port, function () {
  console.log("Listening on Port " + port + "...");
  open("http://localhost:" + port);
});