import React, { useState, useEffect } from "react";
import { openDB } from "idb";

const FileStorage = () => {
  const [db, setDb] = useState(null);
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState("");
  const [fileEntry, setFileEntry] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    // Open or create the database
    const initDB = async () => {
      const db = await openDB("fileStorageDB", 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("files")) {
            db.createObjectStore("files", {
              keyPath: "id",
              autoIncrement: true,
            });
          }
        },
      });
      setDb(db);
    };

    initDB();
  }, []);

  // Create file entry and save to IndexedDB
  const createFileEntry = async (file) => {
    const tx = db.transaction("files", "readwrite");
    const store = tx.objectStore("files");
    const fileEntry = {
      name: file.name,
      type: file.type,
      content: await file.arrayBuffer(), // Store the file content as an ArrayBuffer
    };
    const id = await store.add(fileEntry);
    console.log("File saved:", id);
  };

  // Retrieve file entry from IndexedDB
  const retrieveFileEntry = async (fileId) => {
    const tx = db.transaction("files", "readonly");
    const store = tx.objectStore("files");
    const fileEntry = await store.get(Number(fileId));
    setFileEntry(fileEntry);

    if (fileEntry && fileEntry.type.startsWith("image/")) {
      const blob = new Blob([fileEntry.content], { type: fileEntry.type });
      const imageUrl = URL.createObjectURL(blob);
      setImageUrl(imageUrl);
    } else {
      setImageUrl("");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSaveClick = () => {
    if (file) {
      createFileEntry(file);
    } else {
      alert("Please select a file to save.");
    }
  };

  const handleRetrieveClick = () => {
    if (fileId) {
      retrieveFileEntry(fileId);
    } else {
      alert("Please enter a valid file ID.");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSaveClick}>Save File</button>
      <br />
      <input
        type="number"
        value={fileId}
        onChange={(e) => setFileId(e.target.value)}
        placeholder="Enter File ID"
      />
      <button onClick={handleRetrieveClick}>Retrieve File</button>
      <div>
        {fileEntry && (
          <div>
            <p>File Name: {fileEntry.name}</p>
            <p>File Type: {fileEntry.type}</p>
            <a
              href={URL.createObjectURL(
                new Blob([fileEntry.content], { type: fileEntry.type })
              )}
              download={fileEntry.name}
            >
              Download File
            </a>
            {fileEntry.type.startsWith("image/") && (
              <div>
                <img
                  src={imageUrl}
                  alt={fileEntry.name}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileStorage;
