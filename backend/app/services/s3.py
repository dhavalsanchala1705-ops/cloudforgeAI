import boto3
import json
from app.config import get_settings
import logging

logger = logging.getLogger(__name__)
settings = get_settings()


def get_s3_client():
    return boto3.client("s3", region_name=settings.aws_region)


async def upload_architecture_report(
    project_id: str, owner_id: str, data: dict
) -> str:
    """Upload architecture JSON report to S3. Returns the S3 key."""
    try:
        s3 = get_s3_client()
        key = f"reports/{owner_id}/{project_id}/architecture.json"
        s3.put_object(
            Bucket=settings.aws_s3_bucket_name,
            Key=key,
            Body=json.dumps(data, indent=2),
            ContentType="application/json",
            ServerSideEncryption="AES256",
        )
        return key
    except Exception as e:
        logger.warning(f"S3 upload failed (non-fatal): {e}")
        return ""
