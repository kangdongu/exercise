// 이미지를 로드하고 Image 객체를 반환하는 함수
function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = url;
      image.crossOrigin = 'anonymous'; // CORS 이슈 방지
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Failed to load image'));
    });
  }
  
  // 회전 각도를 라디안 값으로 변환하는 함수
  function getRadianAngle(degreeValue: number) {
    return (degreeValue * Math.PI) / 180;
  }
  
  // 회전된 이미지의 크기를 계산하는 함수
  function rotateSize(width: number, height: number, rotation: number) {
    const rotRad = getRadianAngle(rotation);
    return {
      width:
        Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
      height:
        Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
  }
  
  // 이미지를 자르고 결과를 Base64 형식으로 반환하는 함수
  export default async function getCroppedImg(
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number },
    rotation = 0,
    flip = { horizontal: false, vertical: false }
  ): Promise<string> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
  
    const rotRad = getRadianAngle(rotation); // 회전 각도를 라디안으로 변환
  
    // 회전된 이미지의 크기를 계산
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.width,
      image.height,
      rotation
    );
  
    // 캔버스 크기를 회전된 이미지의 크기로 설정
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;
  
    // 캔버스의 중심으로 이동하여 회전 및 뒤집기
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);
  
    // 회전된 이미지를 캔버스에 그리기
    ctx.drawImage(image, 0, 0);
  
    // 잘라낼 영역의 크기를 캔버스에 맞춰 설정
    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');
  
    if (!croppedCtx) {
      throw new Error('Could not get cropped canvas context');
    }
  
    croppedCanvas.width = pixelCrop.width;
    croppedCanvas.height = pixelCrop.height;
  
    // 캔버스의 지정된 영역을 잘라내어 새로운 캔버스에 그리기
    croppedCtx.drawImage(
      canvas,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );
  
    // Base64 형식으로 반환
    return croppedCanvas.toDataURL('image/png');
  }
  