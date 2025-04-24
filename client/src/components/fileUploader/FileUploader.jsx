import React, { useState, useRef, useEffect } from "react";
import "./fileUploader.scss"; // Stylizacja komponentu

const FileUploader = ({ label, onFileSelect }) => {
    const [files, setFiles] = useState([]); // Przechowywanie wielu plików
    const [fileUrls, setFileUrls] = useState([]); // Przechowywanie URL dla podglądu
    const fileInputRef = useRef(null);

    // Funkcja do obsługi zmiany pliku
    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);

        const newFiles = [...files, ...selectedFiles]; // Dodaj nowe pliki do istniejących
        setFiles(newFiles);
        onFileSelect(newFiles);

        // Tworzenie nowych URL-ów do podglądu
        const newUrls = selectedFiles.map((file) => URL.createObjectURL(file));
        setFileUrls((prevUrls) => [...prevUrls, ...newUrls]);
    };

    // Zwalnianie pamięci po usunięciu komponentu lub zmiany pliku
    useEffect(() => {
        return () => {
            fileUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [fileUrls]);

    // Funkcja do obsługi kliknięcia przycisku (otwiera okno wyboru pliku)
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    // Funkcja do usuwania wybranego pliku
    const handleRemoveFile = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        const updatedUrls = fileUrls.filter((_, i) => i !== index);

        setFiles(updatedFiles); // Aktualizacja stanu plików
        setFileUrls(updatedUrls); // Aktualizacja URL-ów dla podglądu

        onFileSelect(updatedFiles); // Przekazywanie zaktualizowanej listy plików do rodzica
    };

    return (
        <div className="file-uploader">
            <button className="upload-button lato-regular" onClick={handleButtonClick}>
                {label}
            </button>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="image/*"
                multiple // Umożliwia wybór wielu plików
            />
            <div className="file-preview-container">
                {fileUrls.map((url, index) => (
                    <div key={index} className="file-preview">
                        <img src={url} alt="preview" className="file-thumbnail" />
                        <button className="remove-button" onClick={() => handleRemoveFile(index)}>
                            x
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileUploader;