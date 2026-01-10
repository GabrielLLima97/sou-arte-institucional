from sqlalchemy.orm import Session

from .config import get_settings
from .models import PortalLink, User
from .auth import hash_password

settings = get_settings()

DEFAULT_LINKS = [
    {
        "slug": "plantao",
        "title": "Pega plantão",
        "description": "Acesse rapidamente o sistema de plantão disponível para novos atendimentos.",
        "body": "Clique no link para consultar oportunidades e registrar seu interesse em novos plantões.",
        "link_url": "https://pegaplantao.com.br/",
    },
    {
        "slug": "antecipacao",
        "title": "Antecipação",
        "description": "Orientações para antecipação de pagamentos e fluxos financeiros.",
        "body": "Siga as instruções oficiais e valide seus dados antes de solicitar a antecipação.",
        "link_url": "https://souarte.tci-br.com/",
    },
    {
        "slug": "plano-saude",
        "title": "Plano de saúde",
        "description": "Informações sobre credenciamento e cobertura do plano de saúde.",
        "body": "Confira os requisitos e acesse o portal para solicitar credenciamento.",
        "link_url": "https://wa.me/5569999220012",
    },
]


def seed_admin(db: Session) -> None:
    existing = db.query(User).filter(User.email == settings.admin_email).first()
    if existing:
        return

    admin = User(
        name=settings.admin_name,
        email=settings.admin_email,
        password_hash=hash_password(settings.admin_password),
        role="admin",
        active=True,
    )
    db.add(admin)
    db.commit()


def seed_links(db: Session) -> None:
    for link in DEFAULT_LINKS:
        exists = db.query(PortalLink).filter(PortalLink.slug == link["slug"]).first()
        if exists:
            updated = False
            for key, value in link.items():
                if getattr(exists, key) != value:
                    setattr(exists, key, value)
                    updated = True
            if updated:
                db.add(exists)
            continue
        item = PortalLink(**link, is_active=True)
        db.add(item)
    db.commit()


def seed_all(db: Session) -> None:
    seed_admin(db)
    seed_links(db)
