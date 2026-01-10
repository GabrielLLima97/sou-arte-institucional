from datetime import date, datetime
from typing import Literal, Optional
from pydantic import BaseModel, EmailStr

UserRole = Literal["admin", "socio"]


class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    active: Optional[bool] = None
    role: Optional[UserRole] = None


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
    author_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class CourseBase(BaseModel):
    title: str
    description: str
    image_url: Optional[str] = None
    access_url: str


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
    created_at: datetime

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
