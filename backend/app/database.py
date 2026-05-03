import asyncio
import os

from sqlalchemy.exc import OperationalError
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlmodel import Field, SQLModel
from .env import DATABASE_URL
# DATABASE_URL = os.getenv(
#     "DATABASE_URL",
#     "mysql+aiomysql://user:password@mysql:3307/biblioteca",
# )

engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    pool_pre_ping=True,
)

SessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Livro(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    titulo: str
    autor: str
    pdf_url: str | None = None


async def init_db(retries: int = 10, delay_seconds: float = 2.0):
    last_error = None

    for attempt in range(1, retries + 1):
        try:
            async with engine.begin() as conn:
                await conn.run_sync(SQLModel.metadata.create_all)
            return
        except OperationalError as exc:
            last_error = exc
            if attempt == retries:
                raise
            await asyncio.sleep(delay_seconds)

    if last_error is not None:
        raise last_error


async def get_session() -> AsyncSession:
    async with SessionLocal() as session:
        yield session