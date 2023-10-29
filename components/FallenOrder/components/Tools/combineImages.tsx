export async function combineImages(img1Url: any, img2Url: any) {
    return new Promise((resolve, reject) => {
        const img1 = new Image();
        const img2 = new Image();
        img1.crossOrigin = "Anonymous";
        img2.crossOrigin = "Anonymous";
        img1.src = img1Url;
        img2.src = img2Url;

        img1.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject('Canvas context is not available');
                return;
            }
            canvas.width = 2000;
            canvas.height = 2000;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img2, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(img1, 0, 0, canvas.width, canvas.height);

            const finalImageDataURL = canvas.toDataURL('image/png');
            resolve(finalImageDataURL);
        };

        img1.onerror = () => {
            reject('Failed to load img1');
        };

        img2.onerror = () => {
            reject('Failed to load img2');
        };
    });
}
