"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import styles from "./styles.module.css";

export default function UploadBase64Page() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dosya seçildiğinde çalışan fonksiyon
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setUploadResult(null);
    
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Dosya boyut ve tip kontrolü
    if (!selectedFile.type.startsWith("image/")) {
      setError("Lütfen sadece resim dosyaları yükleyin.");
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      setError("Dosya boyutu 10MB'dan küçük olmalıdır.");
      return;
    }

    // Dosyayı önizleme için hazırla
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
    
    setFile(selectedFile);
  };

  // Dosya yükleme fonksiyonu
  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError("Lütfen bir resim dosyası seçin.");
      return;
    }

    setIsUploading(true);
    setError(null);
    
    try {
      // Dosyayı Base64'e çevir
      const reader = new FileReader();
      
      const readFileAsBase64 = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          // Base64 veriyi al - data:image/jpeg;base64, kısmını çıkar
          const base64Data = (reader.result as string).split(",")[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      const base64Data = await readFileAsBase64;
      
      // API'ye gönder
      const response = await fetch("/api/test/upload-base64", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileData: base64Data,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Yükleme başarısız oldu");
      }
      
      setUploadResult(result);
    } catch (err: any) {
      console.error("Yükleme hatası:", err);
      setError(err.message || "Dosya yükleme sırasında bir hata oluştu");
    } finally {
      setIsUploading(false);
    }
  };

  // URL'yi panoya kopyala
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert("URL panoya kopyalandı!");
      })
      .catch((err) => {
        console.error("Kopyalama hatası:", err);
      });
  };

  // Formu sıfırla
  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Base64 Resim Yükleme</h1>
      
      <div className={styles.uploadSection}>
        <form onSubmit={handleUpload}>
          <div className={styles.dropzone}>
            <input
              type="file"
              accept="image/*"
              className={styles.fileInput}
              id="fileInput"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <label htmlFor="fileInput" className={styles.fileLabel}>
              {preview ? (
                <img src={preview} alt="Önizleme" className={styles.preview} />
              ) : (
                <div className={styles.placeholder}>
                  <span>Resim seçmek için tıklayın</span>
                  <small className={styles.subtext}>veya dosyayı buraya sürükleyin</small>
                </div>
              )}
            </label>
          </div>
          
          {error && (
            <div className={styles.error}>
              <p>{error}</p>
            </div>
          )}
          
          <div className={styles.controls}>
            <button
              type="submit"
              className={`${styles.button} ${styles.uploadButton}`}
              disabled={!file || isUploading}
            >
              {isUploading ? "Yükleniyor..." : "Yükle"}
            </button>
            
            <button
              type="button"
              className={`${styles.button} ${styles.resetButton}`}
              onClick={resetForm}
            >
              Sıfırla
            </button>
          </div>
        </form>
      </div>
      
      {uploadResult && (
        <div className={styles.result}>
          <h2>Yükleme Başarılı!</h2>
          
          <h3>Ana URL</h3>
          <div className={styles.urlBox}>
            <div className={styles.urlContainer}>
              <input
                type="text"
                value={uploadResult.url}
                readOnly
                className={styles.urlInput}
              />
              <button
                className={styles.copyButton}
                onClick={() => copyToClipboard(uploadResult.url)}
              >
                Kopyala
              </button>
            </div>
          </div>
          
          <div className={styles.imagePreview}>
            <img
              src={uploadResult.url}
              alt="Yüklenen resim"
              className={styles.resultImage}
            />
          </div>
          
          <div className={styles.metaData}>
            <h3>Dosya Bilgileri</h3>
            <ul>
              <li><strong>Dosya Adı:</strong> {uploadResult.metadata.fileName}</li>
              <li><strong>Dosya Boyutu:</strong> {uploadResult.metadata.fileSize} bytes</li>
              <li><strong>MIME Tipi:</strong> {uploadResult.metadata.contentType}</li>
              <li><strong>Yükleme Zamanı:</strong> {new Date(uploadResult.metadata.timestamp).toLocaleString()}</li>
            </ul>
          </div>
          
          <div className={styles.alternativeUrls}>
            <h3>Alternatif URL'ler</h3>
            <ul>
              {uploadResult.alternativeUrls.map((item: any, index: number) => (
                <li key={index} className={styles.alternativeUrl}>
                  <div className={styles.urlContainer}>
                    <input
                      type="text"
                      value={item.url}
                      readOnly
                      className={styles.urlInput}
                    />
                    <button
                      className={styles.copyButton}
                      onClick={() => copyToClipboard(item.url)}
                    >
                      Kopyala
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 