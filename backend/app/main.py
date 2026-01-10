from datetime import datetime
from io import BytesIO
import time
from fastapi import Depends, FastAPI, File, HTTPException, Response, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from openpyxl import Workbook, load_workbook
from sqlalchemy import inspect, text
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError

from .auth import create_access_token, get_current_user, hash_password, require_admin, verify_password
from .config import get_settings
from .crud import (
    create_announcement,
    create_course,
    create_partner,
    create_user,
    delete_announcement,
    delete_course,
    delete_partner,
    get_portal_link,
    get_user_by_email,
    list_announcements,
    list_courses,
    list_partners,
    list_portal_links,
    list_users,
    update_announcement,
    update_course,
    update_partner,
    update_user,
)
from .database import Base, SessionLocal, engine, get_db
from . import models
from .models import Announcement, Course
from .schemas import (
    AnnouncementCreate,
    AnnouncementPublic,
    AnnouncementUpdate,
    CourseCreate,
    CoursePublic,
    CourseUpdate,
    LoginRequest,
    BulkUserResult,
    PartnerCreate,
    PartnerPublic,
    PartnerUpdate,
    PortalLinkPublic,
    UserCreate,
    UserPasswordUpdate,
    UserPublic,
    UserUpdate,
)
from .seed import seed_all

settings = get_settings()

app = FastAPI(title="Sou Arte em Cuidados API")

origins = [origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    for _ in range(10):
        try:
            Base.metadata.create_all(bind=engine)
            with engine.begin() as connection:
                inspector = inspect(connection)
                columns = {column["name"] for column in inspector.get_columns("announcements")}
                if "expires_at" not in columns:
                    connection.execute(text("ALTER TABLE announcements ADD COLUMN expires_at DATETIME NULL"))
            with SessionLocal() as db:
                seed_all(db)
            return
        except OperationalError:
            time.sleep(2)
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_all(db)


CREATE_HEADERS = {
    "name": ["nome", "name"],
    "email": ["email", "e-mail", "e mail"],
    "password": ["senha", "password"],
    "role": ["perfil", "role", "tipo", "papel"],
}

DELETE_HEADERS = {
    "email": ["email", "e-mail", "e mail"],
}

ROLE_ALIASES = {
    "admin": "admin",
    "administrador": "admin",
    "adm": "admin",
    "socio": "socio",
    "sócio": "socio",
    "associado": "socio",
}


def normalize_value(value: object) -> str:
    if value is None:
        return ""
    return str(value).strip()


def normalize_header(value: object) -> str:
    return normalize_value(value).lower()


def get_header_index(ws, required_headers: dict[str, list[str]]) -> dict[str, int]:
    header_row = next(ws.iter_rows(min_row=1, max_row=1, values_only=True), None)
    if not header_row:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Arquivo inválido. Cabeçalho não encontrado.")

    index_map: dict[str, int] = {}
    for idx, cell_value in enumerate(header_row):
        header = normalize_header(cell_value)
        for field, aliases in required_headers.items():
            if header in aliases and field not in index_map:
                index_map[field] = idx

    missing = [field for field in required_headers.keys() if field not in index_map]
    if missing:
        missing_label = ", ".join(missing)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Arquivo inválido. Colunas obrigatórias ausentes: {missing_label}.",
        )
    return index_map


@app.post("/auth/login", response_model=UserPublic)
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = get_user_by_email(db, payload.email)
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas.")
    if not user.active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Usuário inativo.")

    token = create_access_token(user.id)
    response.set_cookie(
        key=settings.cookie_name,
        value=token,
        httponly=True,
        secure=settings.cookie_secure,
        samesite="lax",
        max_age=settings.access_token_expire_minutes * 60,
    )
    user.last_login_at = datetime.utcnow()
    db.commit()
    return user


@app.post("/auth/logout")
def logout(response: Response):
    response.delete_cookie(settings.cookie_name)
    return {"message": "Logout efetuado."}


@app.get("/auth/me", response_model=UserPublic)
def me(current_user=Depends(get_current_user)):
    return current_user


@app.get("/admin/users", response_model=list[UserPublic])
def admin_list_users(_: str = Depends(require_admin), db: Session = Depends(get_db)):
    return list_users(db)


@app.post("/admin/users", response_model=UserPublic)
def admin_create_user(payload: UserCreate, _: str = Depends(require_admin), db: Session = Depends(get_db)):
    if get_user_by_email(db, payload.email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="E-mail já cadastrado.")
    return create_user(db, payload.name, payload.email, payload.password, payload.role)


@app.patch("/admin/users/{user_id}", response_model=UserPublic)
def admin_update_user(user_id: str, payload: UserUpdate, _: str = Depends(require_admin), db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.id == user_id).first()
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado.")
    if payload.email and payload.email != existing.email and get_user_by_email(db, payload.email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="E-mail já cadastrado.")
    return update_user(db, existing, payload.name, payload.email, payload.role, payload.active)


@app.patch("/admin/users/{user_id}/password", response_model=UserPublic)
def admin_update_user_password(
    user_id: str,
    payload: UserPasswordUpdate,
    _: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado.")
    if not payload.password.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Senha inválida.")
    user.password_hash = hash_password(payload.password.strip())
    db.commit()
    db.refresh(user)
    return user


@app.delete("/admin/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_user(
    user_id: str,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado.")
    if user.id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Não é possível excluir o usuário logado.")
    try:
        db.query(Announcement).filter(Announcement.created_by == user.id).update(
            {Announcement.created_by: None},
            synchronize_session=False,
        )
        db.query(Course).filter(Course.created_by == user.id).update(
            {Course.created_by: None},
            synchronize_session=False,
        )
        db.delete(user)
        db.commit()
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro ao excluir usuário.") from exc
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.get("/admin/users/templates/create")
def admin_users_template_create(_: str = Depends(require_admin)):
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "usuarios"
    sheet.append(["nome", "email", "senha", "perfil"])
    stream = BytesIO()
    workbook.save(stream)
    stream.seek(0)
    return Response(
        content=stream.getvalue(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": 'attachment; filename="modelo-usuarios-criacao.xlsx"'},
    )


@app.get("/admin/users/templates/delete")
def admin_users_template_delete(_: str = Depends(require_admin)):
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "usuarios"
    sheet.append(["email"])
    stream = BytesIO()
    workbook.save(stream)
    stream.seek(0)
    return Response(
        content=stream.getvalue(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": 'attachment; filename="modelo-usuarios-exclusao.xlsx"'},
    )


@app.post("/admin/users/bulk-create", response_model=BulkUserResult)
def admin_bulk_create_users(
    file: UploadFile = File(...),
    _: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    if not file.filename or not file.filename.endswith(".xlsx"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Envie um arquivo .xlsx.")

    file.file.seek(0)
    workbook = load_workbook(file.file, data_only=True)
    sheet = workbook.active
    header_index = get_header_index(sheet, CREATE_HEADERS)

    processed = 0
    created = 0
    skipped = 0
    errors: list[dict[str, object]] = []
    seen_emails: set[str] = set()

    for row_number, row in enumerate(sheet.iter_rows(min_row=2, values_only=True), start=2):
        values = {field: row[index] if index < len(row) else None for field, index in header_index.items()}
        if all(normalize_value(value) == "" for value in values.values()):
            continue

        processed += 1
        name = normalize_value(values["name"])
        email = normalize_value(values["email"]).lower()
        password = normalize_value(values["password"])
        role_raw = normalize_value(values["role"]).lower()
        role = ROLE_ALIASES.get(role_raw)

        if not name or not email or not password or not role:
            errors.append({"row": row_number, "message": "Campos obrigatórios ausentes ou perfil inválido."})
            skipped += 1
            continue

        if email in seen_emails:
            errors.append({"row": row_number, "message": "E-mail duplicado no arquivo."})
            skipped += 1
            continue

        seen_emails.add(email)

        if get_user_by_email(db, email):
            errors.append({"row": row_number, "message": "E-mail já cadastrado."})
            skipped += 1
            continue

        try:
            create_user(db, name, email, password, role)
            created += 1
        except Exception:
            db.rollback()
            errors.append({"row": row_number, "message": "Erro ao criar usuário."})
            skipped += 1

    return BulkUserResult(processed=processed, created=created, skipped=skipped, errors=errors)


@app.post("/admin/users/bulk-delete", response_model=BulkUserResult)
def admin_bulk_delete_users(
    file: UploadFile = File(...),
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
):
    if not file.filename or not file.filename.endswith(".xlsx"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Envie um arquivo .xlsx.")

    file.file.seek(0)
    workbook = load_workbook(file.file, data_only=True)
    sheet = workbook.active
    header_index = get_header_index(sheet, DELETE_HEADERS)

    processed = 0
    deleted = 0
    skipped = 0
    errors: list[dict[str, object]] = []

    for row_number, row in enumerate(sheet.iter_rows(min_row=2, values_only=True), start=2):
        email_value = row[header_index["email"]] if header_index["email"] < len(row) else None
        email = normalize_value(email_value).lower()
        if not email:
            continue

        processed += 1
        user = get_user_by_email(db, email)
        if not user:
            errors.append({"row": row_number, "message": "Usuário não encontrado."})
            skipped += 1
            continue

        if user.id == current_user.id:
            errors.append({"row": row_number, "message": "Não é possível excluir o usuário logado."})
            skipped += 1
            continue

        try:
            db.query(Announcement).filter(Announcement.created_by == user.id).update(
                {Announcement.created_by: None},
                synchronize_session=False,
            )
            db.query(Course).filter(Course.created_by == user.id).update(
                {Course.created_by: None},
                synchronize_session=False,
            )
            db.delete(user)
            db.commit()
            deleted += 1
        except Exception:
            db.rollback()
            errors.append({"row": row_number, "message": "Erro ao excluir usuário."})
            skipped += 1

    return BulkUserResult(processed=processed, deleted=deleted, skipped=skipped, errors=errors)


@app.get("/admin/announcements", response_model=list[AnnouncementPublic])
def admin_list_announcements(_: str = Depends(require_admin), db: Session = Depends(get_db)):
    return list_announcements(db, only_active=False)


@app.post("/admin/announcements", response_model=AnnouncementPublic)
def admin_create_announcement(
    payload: AnnouncementCreate,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
):
    return create_announcement(
        db,
        payload.title,
        payload.body,
        payload.published_at,
        payload.expires_at,
        current_user.id,
    )


@app.put("/admin/announcements/{announcement_id}", response_model=AnnouncementPublic)
def admin_update_announcement(
    announcement_id: str,
    payload: AnnouncementUpdate,
    _: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comunicado não encontrado.")
    return update_announcement(
        db,
        announcement,
        payload.title,
        payload.body,
        payload.published_at,
        payload.expires_at,
    )


@app.delete("/admin/announcements/{announcement_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_announcement(announcement_id: str, _: str = Depends(require_admin), db: Session = Depends(get_db)):
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comunicado não encontrado.")
    delete_announcement(db, announcement)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.get("/admin/courses", response_model=list[CoursePublic])
def admin_list_courses(_: str = Depends(require_admin), db: Session = Depends(get_db)):
    return list_courses(db, only_active=False)


@app.post("/admin/courses", response_model=CoursePublic)
def admin_create_course(
    payload: CourseCreate,
    current_user=Depends(require_admin),
    db: Session = Depends(get_db),
):
    return create_course(db, payload.title, payload.description, payload.image_url, payload.access_url, current_user.id)


@app.put("/admin/courses/{course_id}", response_model=CoursePublic)
def admin_update_course(
    course_id: str,
    payload: CourseUpdate,
    _: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Curso não encontrado.")
    return update_course(db, course, payload.title, payload.description, payload.image_url, payload.access_url)


@app.delete("/admin/courses/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_course(course_id: str, _: str = Depends(require_admin), db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Curso não encontrado.")
    delete_course(db, course)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.get("/admin/partners", response_model=list[PartnerPublic])
def admin_list_partners(_: str = Depends(require_admin), db: Session = Depends(get_db)):
    return list_partners(db, only_active=False)


@app.post("/admin/partners", response_model=PartnerPublic)
def admin_create_partner(payload: PartnerCreate, _: str = Depends(require_admin), db: Session = Depends(get_db)):
    return create_partner(db, payload.name, payload.description, payload.link_url, payload.logo_url)


@app.put("/admin/partners/{partner_id}", response_model=PartnerPublic)
def admin_update_partner(
    partner_id: str,
    payload: PartnerUpdate,
    _: str = Depends(require_admin),
    db: Session = Depends(get_db),
):
    partner = db.query(models.Partner).filter(models.Partner.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Parceiro não encontrado.")
    return update_partner(db, partner, payload.name, payload.description, payload.link_url, payload.logo_url)


@app.delete("/admin/partners/{partner_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_partner(partner_id: str, _: str = Depends(require_admin), db: Session = Depends(get_db)):
    partner = db.query(models.Partner).filter(models.Partner.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Parceiro não encontrado.")
    delete_partner(db, partner)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.get("/portal/announcements", response_model=list[AnnouncementPublic])
def portal_announcements(_: str = Depends(get_current_user), db: Session = Depends(get_db)):
    return list_announcements(db, only_active=True, only_visible=True)


@app.get("/portal/courses", response_model=list[CoursePublic])
def portal_courses(_: str = Depends(get_current_user), db: Session = Depends(get_db)):
    return list_courses(db, only_active=True)


@app.get("/portal/links", response_model=list[PortalLinkPublic])
def portal_links(_: str = Depends(get_current_user), db: Session = Depends(get_db)):
    return list_portal_links(db)


@app.get("/portal/links/{slug}", response_model=PortalLinkPublic)
def portal_link(slug: str, _: str = Depends(get_current_user), db: Session = Depends(get_db)):
    link = get_portal_link(db, slug)
    if not link:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Link não encontrado.")
    return link


@app.get("/portal/partners", response_model=list[PartnerPublic])
def portal_partners(_: str = Depends(get_current_user), db: Session = Depends(get_db)):
    return list_partners(db, only_active=True)
