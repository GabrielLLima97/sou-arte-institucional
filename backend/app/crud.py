from datetime import date, datetime
from typing import Optional
from sqlalchemy.orm import Session

from . import models
from .auth import hash_password


def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()


def list_users(db: Session) -> list[models.User]:
    return db.query(models.User).order_by(models.User.created_at.desc()).all()


def create_user(db: Session, name: str, email: str, password: str, role: str) -> models.User:
    user = models.User(
        name=name,
        email=email,
        password_hash=hash_password(password),
        role=role,
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
) -> models.User:
    if name is not None:
        user.name = name
    if email is not None:
        user.email = email
    if active is not None:
        user.active = active
    if role is not None:
        user.role = role
    db.commit()
    db.refresh(user)
    return user


def list_announcements(db: Session, only_active: bool, only_visible: bool = False) -> list[models.Announcement]:
    query = db.query(models.Announcement)
    if only_active:
        query = query.filter(models.Announcement.is_active.is_(True))
    if only_visible:
        now = datetime.now()
        query = query.filter(
            (models.Announcement.expires_at.is_(None)) | (models.Announcement.expires_at >= now)
        )
    return query.order_by(models.Announcement.published_at.desc()).all()


def create_announcement(
    db: Session,
    title: str,
    body: str,
    published_at: date,
    expires_at: date,
    created_by: Optional[str],
) -> models.Announcement:
    published_dt = datetime.combine(published_at, datetime.min.time())
    expires_dt = datetime.combine(expires_at, datetime.max.time())
    item = models.Announcement(
        title=title,
        body=body,
        published_at=published_dt,
        expires_at=expires_dt,
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
) -> models.Announcement:
    announcement.title = title
    announcement.body = body
    announcement.published_at = datetime.combine(published_at, datetime.min.time())
    announcement.expires_at = datetime.combine(expires_at, datetime.max.time())
    db.commit()
    db.refresh(announcement)
    return announcement


def delete_announcement(db: Session, announcement: models.Announcement) -> None:
    db.delete(announcement)
    db.commit()


def list_courses(db: Session, only_active: bool) -> list[models.Course]:
    query = db.query(models.Course)
    if only_active:
        query = query.filter(models.Course.is_active.is_(True))
    return query.order_by(models.Course.created_at.desc()).all()


def create_course(
    db: Session,
    title: str,
    description: str,
    image_url: Optional[str],
    access_url: str,
    created_by: Optional[str],
) -> models.Course:
    item = models.Course(
        title=title,
        description=description,
        image_url=image_url,
        access_url=access_url,
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
) -> models.Course:
    course.title = title
    course.description = description
    course.image_url = image_url
    course.access_url = access_url
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


def list_partners(db: Session, only_active: bool = True) -> list[models.Partner]:
    query = db.query(models.Partner)
    if only_active:
        query = query.filter(models.Partner.is_active.is_(True))
    return query.order_by(models.Partner.name.asc()).all()


def create_partner(
    db: Session,
    name: str,
    description: str,
    link_url: str,
    logo_url: Optional[str],
) -> models.Partner:
    item = models.Partner(
        name=name,
        description=description,
        link_url=link_url,
        logo_url=logo_url,
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
) -> models.Partner:
    partner.name = name
    partner.description = description
    partner.link_url = link_url
    partner.logo_url = logo_url
    db.commit()
    db.refresh(partner)
    return partner


def delete_partner(db: Session, partner: models.Partner) -> None:
    db.delete(partner)
    db.commit()
