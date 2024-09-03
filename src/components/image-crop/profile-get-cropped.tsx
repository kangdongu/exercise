
export default function getCroppedImg(imageSrc: string, croppedAreaPixels: { x: number; y: number; width: number; height: number }): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.crossOrigin = 'anonymous';
      
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        if (!ctx) {
          return reject(new Error('Failed to get canvas context'));
        }
  
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
  
        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );
  
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/jpeg');
      };
  
      image.onerror = () => reject(new Error('Failed to load image'));
    });
  }
  