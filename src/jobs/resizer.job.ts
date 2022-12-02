import sharp from 'sharp';
import Queue from 'bull';
import path from 'path';

export default async (job: Queue.Job<any>) => {
  const { img, imgName } = job.data as { img: string; imgName: string };

  const dest = path.resolve(__dirname, '../../public/images', imgName);

  try {
    const buffer = await sharp(img)
      .resize(480, 480, {
        fit: sharp.fit.contain,
      })
      .png({ quality: 100 })
      .toBuffer();
    await sharp(buffer).toFile(dest);
    // Todo: delete file from public/uploads folder
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }

  return Promise.resolve(job.name);
};
