from datetime import date, datetime
import json
from typing import Optional
import unicodedata
from sqlalchemy.orm import Session

from . import models
from .auth import hash_password


def _encode_target_values(values: Optional[list[str]]) -> Optional[str]:
    if not values:
        return None
    normalized: list[str] = []
    seen: set[str] = set()
    for value in values:
        text_value = str(value).strip()
        if not text_value:
            continue
        key = text_value.lower()
        if key in seen:
            continue
        seen.add(key)
        normalized.append(text_value)
    if not normalized:
        return None
    return json.dumps(normalized, ensure_ascii=False)


def _decode_target_values(raw_value: Optional[str]) -> list[str]:
    if not raw_value:
        return []
    try:
        parsed = json.loads(raw_value)
        if isinstance(parsed, list):
            return [str(item).strip() for item in parsed if str(item).strip()]
    except json.JSONDecodeError:
        pass
    return [part.strip() for part in raw_value.split(",") if part.strip()]


def _normalize_for_match(value: Optional[str]) -> str:
    text_value = (value or "").strip().lower()
    if not text_value:
        return ""
    normalized = unicodedata.normalize("NFKD", text_value)
    return "".join(char for char in normalized if not unicodedata.combining(char))


def _matches_targeting(
    user: Optional[models.User],
    target_cities_raw: Optional[str],
    target_professions_raw: Optional[str],
) -> bool:
    if user is None:
        return True

    target_cities = {_normalize_for_match(item) for item in _decode_target_values(target_cities_raw)}
    target_professions = {_normalize_for_match(item) for item in _decode_target_values(target_professions_raw)}

    user_city = _normalize_for_match(user.city)
    user_profession = _normalize_for_match(user.profession)

    matches_city = not target_cities or user_city in target_cities
    matches_profession = not target_professions or user_profession in target_professions
    return matches_city and matches_profession


def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()


def list_users(db: Session) -> list[models.User]:
    return db.query(models.User).order_by(models.User.created_at.desc()).all()


def create_user(
    db: Session,
    name: str,
    email: str,
    password: str,
    role: str,
    city: Optional[str] = None,
    uf: Optional[str] = None,
    admission_date: Optional[date] = None,
    profession: Optional[str] = None,
) -> models.User:
    user = models.User(
        name=name,
        email=email,
        password_hash=hash_password(password),
        role=role,
        city=city,
        uf=uf,
        admission_date=admission_date,
        profession=profession,
        active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(
    db: Session,
    user: models.User,
    name: Optional[str],
    email: Optional[str],
    role: Optional[str],
    active: Optional[bool],
    city: Optional[str],
    uf: Optional[str],
    admission_date: Optional[date],
    profession: Optional[str],
) -> models.User:
    if name is not None:
        user.name = name
    if email is not None:
        user.email = email
    if active is not None:
        user.active = active
    if role is not None:
        user.role = role
    if city is not None:
        user.city = city
    if uf is not None:
        user.uf = uf
    if admission_date is not None:
        user.admission_date = admission_date
    if profession is not None:
        user.profession = profession
    db.commit()
    db.refresh(user)
    return user


def list_announcements(
    db: Session,
    only_active: bool,
    only_visible: bool = False,
    user: Optional[models.User] = None,
) -> list[models.Announcement]:
    query = db.query(models.Announcement)
    if only_active:
        query = query.filter(models.Announcement.is_active.is_(True))
    if only_visible:
        now = datetime.now()
        query = query.filter(
            (models.Announcement.expires_at.is_(None)) | (models.Announcement.expires_at >= now)
        )
    items = query.order_by(models.Announcement.published_at.desc()).all()
    if user is None:
        return items
    return [
        item
        for item in items
        if _matches_targeting(user, item.target_cities, item.target_professions)
    ]


def create_announcement(
    db: Session,
    title: str,
    body: str,
    published_at: date,
    expires_at: date,
    target_cities: Optional[list[str]],
    target_professions: Optional[list[str]],
    created_by: Optional[str],
) -> models.Announcement:
    published_dt = datetime.combine(published_at, datetime.min.time())
    expires_dt = datetime.combine(expires_at, datetime.max.time())
    item = models.Announcement(
        title=title,
        body=body,
        published_at=published_dt,
        expires_at=expires_dt,
        target_cities=_encode_target_values(target_cities),
        target_professions=_encode_target_values(target_professions),
        created_by=created_by,
        is_active=True,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_announcement(
    db: Session,
    announcement: models.Announcement,
    title: str,
    body: str,
    published_at: date,
    expires_at: date,
    target_cities: Optional[list[str]],
    target_professions: Optional[list[str]],
) -> models.Announcement:
    announcement.title = title
    announcement.body = body
    announcement.published_at = datetime.combine(published_at, datetime.min.time())
    announcement.expires_at = datetime.combine(expires_at, datetime.max.time())
    announcement.target_cities = _encode_target_values(target_cities)
    announcement.target_professions = _encode_target_values(target_professions)
    db.commit()
    db.refresh(announcement)
    return announcement


def delete_announcement(db: Session, announcement: models.Announcement) -> None:
    db.delete(announcement)
    db.commit()


def list_courses(db: Session, only_active: bool, user: Optional[models.User] = None) -> list[models.Course]:
    query = db.query(models.Course)
    if only_active:
        query = query.filter(models.Course.is_active.is_(True))
    items = query.order_by(models.Course.created_at.desc()).all()
    if user is None:
        return items
    return [
        item
        for item in items
        if _matches_targeting(user, item.target_cities, item.target_professions)
    ]


def create_course(
    db: Session,
    title: str,
    description: str,
    image_url: Optional[str],
    access_url: str,
    target_cities: Optional[list[str]],
    target_professions: Optional[list[str]],
    created_by: Optional[str],
) -> models.Course:
    item = models.Course(
        title=title,
        description=description,
        image_url=image_url,
        access_url=access_url,
        target_cities=_encode_target_values(target_cities),
        target_professions=_encode_target_values(target_professions),
        created_by=created_by,
        is_active=True,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_course(
    db: Session,
    course: models.Course,
    title: str,
    description: str,
    image_url: Optional[str],
    access_url: str,
    target_cities: Optional[list[str]],
    target_professions: Optional[list[str]],
) -> models.Course:
    course.title = title
    course.description = description
    course.image_url = image_url
    course.access_url = access_url
    course.target_cities = _encode_target_values(target_cities)
    course.target_professions = _encode_target_values(target_professions)
    db.commit()
    db.refresh(course)
    return course


def delete_course(db: Session, course: models.Course) -> None:
    db.delete(course)
    db.commit()


def list_portal_links(db: Session) -> list[models.PortalLink]:
    return db.query(models.PortalLink).filter(models.PortalLink.is_active.is_(True)).all()


def get_portal_link(db: Session, slug: str) -> Optional[models.PortalLink]:
    return db.query(models.PortalLink).filter(models.PortalLink.slug == slug, models.PortalLink.is_active.is_(True)).first()


def list_partners(db: Session, only_active: bool = True, user: Optional[models.User] = None) -> list[models.Partner]:
    query = db.query(models.Partner)
    if only_active:
        query = query.filter(models.Partner.is_active.is_(True))
    items = query.order_by(models.Partner.name.asc()).all()
    if user is None:
        return items
    return [
        item
        for item in items
        if _matches_targeting(user, item.target_cities, item.target_professions)
    ]


def create_partner(
    db: Session,
    name: str,
    description: str,
    link_url: str,
    logo_url: Optional[str],
    target_cities: Optional[list[str]],
    target_professions: Optional[list[str]],
) -> models.Partner:
    item = models.Partner(
        name=name,
        description=description,
        link_url=link_url,
        logo_url=logo_url,
        target_cities=_encode_target_values(target_cities),
        target_professions=_encode_target_values(target_professions),
        is_active=True,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_partner(
    db: Session,
    partner: models.Partner,
    name: str,
    description: str,
    link_url: str,
    logo_url: Optional[str],
    target_cities: Optional[list[str]],
    target_professions: Optional[list[str]],
) -> models.Partner:
    partner.name = name
    partner.description = description
    partner.link_url = link_url
    partner.logo_url = logo_url
    partner.target_cities = _encode_target_values(target_cities)
    partner.target_professions = _encode_target_values(target_professions)
    db.commit()
    db.refresh(partner)
    return partner


def delete_partner(db: Session, partner: models.Partner) -> None:
    db.delete(partner)
    db.commit()
