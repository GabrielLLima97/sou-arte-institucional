from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "mysql+pymysql://souarte:souarte@db:3306/souarte"
    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 480
    cookie_name: str = "sou_arte_access"
    cookie_secure: bool = False
    cors_origins: str = "http://localhost:3000"
    admin_email: str = "admin@souarte.com"
    admin_password: str = "admin123"
    admin_name: str = "Administrador"


@lru_cache
def get_settings() -> Settings:
    return Settings()
