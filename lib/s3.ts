import "server-only"

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

function getS3Config() {
  // Keep compatibility with the env var names already present in this repo.
  const accessKeyId = process.env.AWS_ACCESS_KEY || process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_KEY || process.env.AWS_SECRET_ACCESS_KEY
  const region = process.env.AWS_REGION
  const bucket = process.env.AWS_S3_BUCKET || process.env.AWS_S3_BUCKET_NAME

  if (!accessKeyId) throw new Error("Missing required env var: AWS_ACCESS_KEY (or AWS_ACCESS_KEY_ID)")
  if (!secretAccessKey) throw new Error("Missing required env var: AWS_SECRET_KEY (or AWS_SECRET_ACCESS_KEY)")
  if (!region) throw new Error("Missing required env var: AWS_REGION")
  if (!bucket) throw new Error("Missing required env var: AWS_S3_BUCKET (or AWS_S3_BUCKET_NAME)")

  return { accessKeyId, secretAccessKey, region, bucket }
}

function getPublicObjectUrl(params: { bucket: string; region: string; key: string }) {
  const { bucket, region, key } = params
  const encodedKey = key.split("/").map(encodeURIComponent).join("/")

  // https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html
  if (region === "us-east-1") {
    return `https://${bucket}.s3.amazonaws.com/${encodedKey}`
  }
  return `https://${bucket}.s3.${region}.amazonaws.com/${encodedKey}`
}

export async function uploadPdfToS3(params: { key: string; body: Buffer; contentType: string }) {
  const { accessKeyId, secretAccessKey, region, bucket } = getS3Config()

  const s3 = new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
  })

  const forcePublicRead =
    process.env.AWS_S3_FORCE_PUBLIC_READ === "1" ||
    process.env.AWS_S3_FORCE_PUBLIC_READ === "true"

  const putBase = {
    Bucket: bucket,
    Key: params.key,
    Body: params.body,
    ContentType: params.contentType,
  } as const

  // Note: Many modern buckets have "Object Ownership = Bucket owner enforced", which disables ACLs.
  // In that case, requesting `ACL: public-read` will fail. We retry without ACL so uploads still work.
  if (forcePublicRead) {
    try {
      await s3.send(
        new PutObjectCommand({
          ...putBase,
          ACL: "public-read",
        }),
      )
    } catch (error: any) {
      const message = String(error?.name || error?.Code || error?.message || "")
      const aclNotSupported =
        message.includes("AccessControlListNotSupported") || message.includes("NotImplemented")
      if (!aclNotSupported) throw error
      await s3.send(new PutObjectCommand(putBase))
    }
  } else {
    await s3.send(new PutObjectCommand(putBase))
  }

  const publicUrl = process.env.AWS_S3_PUBLIC_BASE_URL
    ? `${requireEnv("AWS_S3_PUBLIC_BASE_URL").replace(/\/+$/, "")}/${params.key
        .split("/")
        .map(encodeURIComponent)
        .join("/")}`
    : getPublicObjectUrl({ bucket, region, key: params.key })

  return { bucket, key: params.key, url: publicUrl }
}
