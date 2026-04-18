import boto3
from botocore.exceptions import NoCredentialsError
import os

MINIO_ENDPOINT = "minio:9000"
ACCESS_KEY = "admin"
SECRET_KEY = "password"
BUCKET_NAME = "livros"

s3_client = boto3.client(
    "s3",
    endpoint_url=f"http://{MINIO_ENDPOINT}",
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,
)

def upload_to_minio(file):
    try:
        buckets = s3_client.list_buckets()
        if BUCKET_NAME not in [b['Name'] for b in buckets['Buckets']]:
            s3_client.create_bucket(Bucket=BUCKET_NAME)
            
        s3_client.upload_fileobj(file.file, BUCKET_NAME, file.filename)
        return f"/{BUCKET_NAME}/{file.filename}"
    except Exception as e:
        print(f"Erro MinIO: {e}")
        return None