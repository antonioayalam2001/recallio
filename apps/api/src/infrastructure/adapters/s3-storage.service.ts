import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

/**
 * Service to interact with AWS S3 for file storage.
 *
 * SECURITY & IAM POLICY REQUIREMENTS:
 * To enforce the Principle of Least Privilege, the IAM Role assigned to this API
 * MUST NOT have full S3 access. The bucket MUST block public access (BlockPublicAcls, IgnorePublicAcls).
 * The required IAM policy should strictly allow:
 * - `s3:PutObject` on `arn:aws:s3:::<BUCKET_NAME>/*`
 *
 * Example Policy:
 * {
 *   "Version": "2012-10-17",
 *   "Statement": [{
 *     "Effect": "Allow",
 *     "Action": "s3:PutObject",
 *     "Resource": "arn:aws:s3:::user-avatars/*"
 *   }]
 * }
 */
@Injectable()
export class S3StorageService {
  private readonly s3Client: S3Client;
  private readonly logger = new Logger(S3StorageService.name);
  private readonly bucketName: string;
  private readonly endpoint: string;

  constructor() {
    this.endpoint = process.env.AWS_S3_ENDPOINT || 'http://localhost:4566';
    this.bucketName = process.env.AWS_S3_AVATAR_BUCKET || 'user-avatars';

    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint: this.endpoint,
      forcePathStyle: true, // Importante para emuladores locales como Floci/LocalStack
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
      },
    });
  }

  async uploadAvatar(fileBuffer: Buffer, mimetype: string, userId: string): Promise<string> {
    const fileExtension = mimetype.split('/')[1] || 'jpg';
    const timestamp = Date.now();
    const fileName = `avatar_${userId}_${timestamp}.${fileExtension}`;

    try {
      this.logger.log(
        `Subiendo avatar para usuario ${userId} a Floci S3 (Bucket: ${this.bucketName})`,
      );
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimetype,
      });

      await this.s3Client.send(command);

      const publicUrl = `${this.endpoint}/${this.bucketName}/${fileName}`;
      this.logger.log(`Avatar subido exitosamente: ${publicUrl}`);

      return publicUrl;
    } catch (error) {
      this.logger.error(`Error subiendo avatar a S3: ${error}`);
      throw new Error('No se pudo subir la imagen del avatar');
    }
  }
}
