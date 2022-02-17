function attemptFileUpload() {
  if (!document.getElementById("fileInput").files.length) {
    alert("Please select a file first.");
    return;
  }

  var file = document.getElementById("fileInput").files[0];

  fetch("getSignedURL").then(function (res) {
    return res.text();
  }).then(function (file_upload_url) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });

    xhr.open("PUT", file_upload_url);
    xhr.setRequestHeader("Content-Length", "0");
    xhr.setRequestHeader("x-ms-type", "file");
    xhr.setRequestHeader("x-ms-file-permission", "inherit");
    xhr.setRequestHeader("x-ms-file-attributes", "None");
    xhr.setRequestHeader("x-ms-file-creation-time", "now");
    xhr.setRequestHeader("x-ms-file-last-write-time", "now");
    xhr.setRequestHeader("x-ms-content-length", droppedFile.size);
    xhr.setRequestHeader("Content-Type", droppedFile.type);
    xhr.send(fileData);
  });
}