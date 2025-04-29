import React, { useState } from "react";
import "./step8.scss";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { getRequestId } from "../../../pages/formPage/FormPage";   // <-- już masz


export default function Step8({
  nextStep,
  prevStep,
  data = {},
  setData,
  saveDraft,
}) {
  const [externalPhotos, setExternalPhotos] = useState(
    data.externalPhotos || []
  );
  const [floorPlans, setFloorPlans] = useState(data.floorPlans || []);
  const [certificates, setCertificates] = useState([]);

  /* NOWE – checkboxy “brak zdjęcia” */
  const [noExternal, setNoExternal] = useState(data.noExternal || false);
  const [noPlan, setNoPlan] = useState(data.noPlan || false);
  const [noCert, setNoCert] = useState(data.noCert || false);

  const handleFileChange = (e, setter) => {
    const newFiles = Array.from(e.target.files);
    // Optional: Validate file types and sizes here
    setter((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleDrop = (e, setter) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files);
    // Optional: Validate file types and sizes here
    setter((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = (fileToRemove, setter) => {
    setter((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };

  const storage = getStorage();
  async function uploadArray(arr, folder) {
    return Promise.all(
      arr.map(async (file) => {
        const path = `${getRequestId()}/${folder}/${file.name}`;
        await uploadBytes(ref(storage, path), file);
        return await getDownloadURL(ref(storage, path));
      })
    );
  }

  const handleNext = async () => {
    const photosUrls = await uploadArray(externalPhotos, 'external');
    const planUrls = await uploadArray(floorPlans, 'plans');
    const certUrls = await uploadArray(certificates, 'certs');

    const payload = { photosUrls, planUrls, certUrls, noExternal, noPlan, noCert };
    saveDraft(8, payload);
    setData(payload);
    nextStep();
  };

  return (
    <div className="step8">
      <h2 className="merriweather-light">Załaduj zdjęcia</h2>

      <div className="fileUploaders">

        {/* External Photos */}
        <div className="fileUploader_wrapper">
          <div
            className="fileUploader"
            onDrop={(e) => handleDrop(e, setExternalPhotos)}
            onDragOver={handleDragOver}
          >
            <label className="custom-file-upload lato-regular">
              <input
                type="file"
                multiple
                accept="image/*" // Restrict to image files
                onChange={(e) => handleFileChange(e, setExternalPhotos)}
              />
              {/* <span>Zdjęcia budynku z zewnątrz</span> */}
            </label>

            <div className="file-preview">
              {externalPhotos.map((file, index) => (
                <div key={index} className="file-item">
                  <p className="lato-regular">{file.name}</p>
                  <button onClick={() => removeFile(file, setExternalPhotos)}>
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={noExternal}
              onChange={(e) => setNoExternal(e.target.checked)}
            />
            nie mam zdjęcia
          </label>
        </div>


        {/* Floor Plans */}

        <div className="fileUploader_wrapper">
          <div
            className="fileUploader"
            onDrop={(e) => handleDrop(e, setFloorPlans)}
            onDragOver={handleDragOver}
          >
            <label className="custom-file-upload lato-regular">
              <input
                type="file"
                multiple
                accept="image/*" // Restrict to image files
                onChange={(e) => handleFileChange(e, setFloorPlans)}
              />
              {/* <span>Rzuty nieruchomości</span> */}
            </label>

            <div className="file-preview">
              {floorPlans.map((file, index) => (
                <div key={index} className="file-item">
                  <p className="lato-regular">{file.name}</p>
                  <button onClick={() => removeFile(file, setFloorPlans)}>
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>

          <label className="checkbox">
            <input
              type="checkbox"
              checked={noPlan}
              onChange={(e) => setNoPlan(e.target.checked)}
            />
            nie mam zdjęcia
          </label>
        </div>


        {/* Certificates */}
        <div className="fileUploader_wrapper">
          <div
            className="fileUploader"
            onDrop={(e) => handleDrop(e, setCertificates)}
            onDragOver={handleDragOver}
          >
            <label className="custom-file-upload lato-regular">
              <input
                type="file"
                multiple
                accept=".pdf,image/*" // Restrict to PDF and image files
                onChange={(e) => handleFileChange(e, setCertificates)}
              />
              {/* <span>Świadectwo budynku</span> */}
            </label>

            <div className="file-preview">
              {certificates.map((file, index) => (
                <div key={index} className="file-item">
                  <p className="lato-regular">{file.name}</p>
                  <button onClick={() => removeFile(file, setCertificates)}>
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={noCert}
              onChange={(e) => setNoCert(e.target.checked)}
            />
            nie mam zdjęcia
          </label>
        </div>

      </div>

      <button className="back" onClick={prevStep}>
        &#x2190;
      </button>
      <button onClick={handleNext}>Zakończ</button>
    </div>
  );
}
