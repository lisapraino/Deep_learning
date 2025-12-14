import type { ChangeEvent } from 'react';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const ImageUploader = ({ onFileSelect, disabled }: ImageUploaderProps) => {
  
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div style={{ marginBottom: "20px", border: "2px dashed #ccc", padding: "20px", borderRadius: "10px" }}>
      <p>Tap below to take a picture or upload</p>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleChange} 
        disabled={disabled}
      />
    </div>
  );
};