interface ImagePreviewProps {
  imageSrc: string | null;
}

export const ImagePreview = ({ imageSrc }: ImagePreviewProps) => {
  if (!imageSrc) return null;

  return (
    <div style={{ marginBottom: "20px" }}>
      <img 
        src={imageSrc} 
        alt="Fridge Upload" 
        style={{ width: "100%", maxHeight: "300px", objectFit: "contain", borderRadius: "10px" }} 
      />
    </div>
  );
};