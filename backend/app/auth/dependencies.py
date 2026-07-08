from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.auth.cognito import verify_cognito_token
from dataclasses import dataclass

bearer_scheme = HTTPBearer()


@dataclass
class CurrentUser:
    sub: str
    email: str
    username: str


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> CurrentUser:
    token = credentials.credentials
    payload = verify_cognito_token(token)
    sub = payload.get("sub")
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: missing sub",
        )
    email = payload.get("email", "")
    username = payload.get("cognito:username", payload.get("username", sub))
    return CurrentUser(sub=sub, email=email, username=username)
