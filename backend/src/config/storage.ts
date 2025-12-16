import * as Minio from 'minio';

export const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000'),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ROOT_USER || 'minioadmin',
    secretKey: process.env.MINIO_ROOT_PASSWORD || 'minioadmin',
});

export const bucketName = 'gifs';

export const ensureBucketExists = async () => {
    try {
        const exists = await minioClient.bucketExists(bucketName);
        if (!exists) {
            await minioClient.makeBucket(bucketName, 'us-east-1');
            console.log(`Bucket '${bucketName}' created successfully.`);

            // Set policy to public read (simplistic approach for demo)
            const policy = {
                Version: "2012-10-17",
                Statement: [
                    {
                        Effect: "Allow",
                        Principal: { AWS: ["*"] },
                        Action: ["s3:GetObject"],
                        Resource: [`arn:aws:s3:::${bucketName}/*`],
                    },
                ],
            };
            await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
        }
    } catch (err) {
        console.error('Error ensuring bucket exists:', err);
    }
};
import { randomBytes } from 'crypto';
import path from 'path';

// ... existing code

export const uploadFile = async (file: Express.Multer.File): Promise<string> => {
    const fileExt = path.extname(file.originalname);
    const fileName = `${randomBytes(16).toString('hex')}${fileExt}`;

    await minioClient.putObject(bucketName, fileName, file.buffer, file.size, {
        'Content-Type': file.mimetype
    });

    // Return relative path (to be handled by proxy or frontend base URL)
    return `/${bucketName}/${fileName}`;
};
