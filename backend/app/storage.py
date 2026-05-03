import boto3
from .env import MINIO_ENDPOINT, ACCESS_KEY, SECRET_KEY,BUCKET_NAME


s3_client = boto3.client(
    "s3",
    endpoint_url=f"http://{MINIO_ENDPOINT}",
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,
)

def upload_to_minio(file):
    try:
        s3_client.upload_fileobj(file.file, BUCKET_NAME, file.filename)
        return f"/{BUCKET_NAME}/{file.filename}"
    except Exception as e:
        print(f"Erro MinIO: {e}")
        return None