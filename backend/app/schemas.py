from datetime import date, datetime
import json
from typing import Literal, Optional
from pydantic import BaseModel, EmailStr, field_validator

UserRole = Literal["admin", "socio"]


def parse_target_values(value: object) -> list[str]:
    if value is None:
        return []

    items: list[object]
    if isinstance(value, str):
        text_value = value.strip()
        if not text_value:
            return []
        try:
            parsed = json.loads(text_value)
            if isinstance(parsed, list):
                items = parsed
            else:
                items = [parsed]
        except json.JSONDecodeError:
            items = [part for part in text_value.split(",")]
    elif isinstance(value, (list, tuple, set)):
        items = list(value)
    else:
        items = [value]

    normalized: list[str] = []
    seen: set[str] = set()
    for item in items:
        text_item = str(item).strip()
        if not text_item:
            continue
        key = text_item.lower()
        if key in seen:
            continue
        seen.add(key)
        normalized.append(text_item)
    return normalized


class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole
    city: Optional[str] = None
    uf: Optional[str] = None
    admission_date: Optional[date] = None
    profession: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    active: Optional[bool] = None
    role: Optional[UserRole] = None
    city: Optional[str] = None
    uf: Optional[str] = None
    admission_date: Optional[date] = None
    profession: Optional[str] = None


class UserPasswordUpdate(BaseModel):
    password: str


class UserPublic(UserBase):
    id: str
    active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AnnouncementBase(BaseModel):
    title: str
    body: str
    published_at: date
    expires_at: date
    target_cities: list[str] = []
    target_professions: list[str] = []

    @field_validator("target_cities", "target_professions", mode="before")
    @classmethod
    def normalize_targets(cls, value: object) -> list[str]:
        return parse_target_values(value)


class AnnouncementCreate(AnnouncementBase):
    pass


class AnnouncementUpdate(AnnouncementBase):
    pass


class AnnouncementPublic(BaseModel):
    id: str
    title: str
    body: str
    published_at: datetime
    expires_at: Optional[datetime] = None
    target_cities: list[str] = []
    target_professions: list[str] = []
    author_name: Optional[str] = None
    created_at: datetime

    @field_validator("target_cities", "target_professions", mode="before")
    @classmethod
    def normalize_targets(cls, value: object) -> list[str]:
        return parse_target_values(value)

    class Config:
        from_attributes = True


class CourseBase(BaseModel):
    title: str
    description: str
    image_url: Optional[str] = None
    access_url: str
    target_cities: list[str] = []
    target_professions: list[str] = []

    @field_validator("target_cities", "target_professions", mode="before")
    @classmethod
    def normalize_targets(cls, value: object) -> list[str]:
        return parse_target_values(value)


class CourseCreate(CourseBase):
    pass


class CourseUpdate(CourseBase):
    pass


class CoursePublic(BaseModel):
    id: str
    title: str
    description: str
    image_url: Optional[str]
    access_url: str
    target_cities: list[str] = []
    target_professions: list[str] = []
    created_at: datetime

    @field_validator("target_cities", "target_professions", mode="before")
    @classmethod
    def normalize_targets(cls, value: object) -> list[str]:
        return parse_target_values(value)

    class Config:
        from_attributes = True


class PortalLinkPublic(BaseModel):
    id: str
    slug: str
    title: str
    description: str
    body: str
    link_url: str

    class Config:
        from_attributes = True


class PartnerBase(BaseModel):
    name: str
    description: str
    link_url: str
    logo_url: Optional[str] = None
    target_cities: list[str] = []
    target_professions: list[str] = []

    @field_validator("target_cities", "target_professions", mode="before")
    @classmethod
    def normalize_targets(cls, value: object) -> list[str]:
        return parse_target_values(value)


class PartnerCreate(PartnerBase):
    pass


class PartnerUpdate(PartnerBase):
    pass


class PartnerPublic(PartnerBase):
    id: str

    class Config:
        from_attributes = True


class BulkUserError(BaseModel):
    row: int
    message: str


class BulkUserResult(BaseModel):
    processed: int
    created: Optional[int] = None
    deleted: Optional[int] = None
    skipped: int
    errors: list[BulkUserError] = []


class UserImportRow(BaseModel):
    row: int
    name: str
    email: EmailStr
    city: Optional[str] = None
    uf: Optional[str] = None
    admission_date: Optional[date] = None
    profession: Optional[str] = None
    exists: bool
    needs_completion: bool = False
    missing_fields: list[str] = []


class UserImportPreview(BaseModel):
    processed: int
    valid_rows: int
    new_rows: list[UserImportRow] = []
    existing_rows: list[UserImportRow] = []
    completion_rows: list[UserImportRow] = []
    missing_in_file: list[UserPublic] = []
    errors: list[BulkUserError] = []


class UserImportApplyResult(BaseModel):
    processed: int
    created: int
    updated: int
    deleted: int
    skipped: int
    errors: list[BulkUserError] = []
