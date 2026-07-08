import httpx
import jwt
from jwt import PyJWKClient
from fastapi import HTTPException, status
from app.config import get_settings
from typing import Optional
import logging

logger = logging.getLogger(__name__)
settings = get_settings()

JWKS_URL = (
    f"https://cognito-idp.{settings.aws_cognito_region}.amazonaws.com/"
    f"{settings.aws_cognito_user_pool_id}/.well-known/jwks.json"
)
ISSUER = (
    f"https://cognito-idp.{settings.aws_cognito_region}.amazonaws.com/"
    f"{settings.aws_cognito_user_pool_id}"
)

_jwks_client: Optional[PyJWKClient] = None


def get_jwks_client() -> PyJWKClient:
    global _jwks_client
    if _jwks_client is None:
        _jwks_client = PyJWKClient(JWKS_URL, cache_jwk_set=True, lifespan=3600)
    return _jwks_client


def verify_cognito_token(token: str) -> dict:
    """Verify a Cognito-issued JWT. Returns the decoded payload."""
    try:
        if not settings.aws_cognito_user_pool_id:
            # Dev mode: skip verification if pool not configured
            logger.warning(
                "Cognito User Pool ID not set — skipping JWT verification (dev mode)"
            )
            import base64
            import json

            parts = token.split(".")
            if len(parts) == 3:
                payload_b64 = parts[1] + "==" * (4 - len(parts[1]) % 4)
                return json.loads(base64.urlsafe_b64decode(payload_b64))
            raise HTTPException(status_code=401, detail="Invalid token")

        client = get_jwks_client()
        signing_key = client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            audience=settings.aws_cognito_app_client_id,
            issuer=ISSUER,
            options={"verify_exp": True},
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired"
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {e}",
        )
    except Exception as e:
        logger.error(f"JWT verification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
