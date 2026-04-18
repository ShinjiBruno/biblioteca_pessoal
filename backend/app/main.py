from fastapi import FastAPI, Depends, UploadFile, File
from sqlmodel import select
from .database import init_db, get_session, Livro
from .storage import upload_to_minio
from typing import List, Optional

app = FastAPI(title="Biblioteca API")

@app.on_event("startup")
async def on_startup():
    await init_db()

@app.get("/livros", response_model=List[Livro])
async def listar_livros(session=Depends(get_session)):
    statement = select(Livro)
    results = await session.execute(statement)
    return results.scalars().all()

@app.post("/livros")
async def criar_livro(
    titulo: str,
    autor: str,
    arquivo: Optional[UploadFile] = File(default=None),
    session=Depends(get_session)
):
    file_url = None
    if arquivo is not None:
        file_url = upload_to_minio(arquivo)

    novo_livro = Livro(titulo=titulo, autor=autor, pdf_url=file_url)
    session.add(novo_livro)
    await session.commit()
    await session.refresh(novo_livro)

    return novo_livro

@app.delete("/livros/{livro_id}")
async def deletar_livro(livro_id: int, session=Depends(get_session)):
    statement = select(Livro).where(Livro.id == livro_id)
    result = await session.execute(statement)
    livro = result.scalar_one_or_none()

    if livro is None:
        return {"error": "Livro não encontrado"}

    await session.delete(livro)
    await session.commit()
    return {"message": "Livro deletado com sucesso"}

@app.put("/livros/{livro_id}")
async def atualizar_livro(
    livro_id: int,
    titulo: Optional[str] = None,
    autor: Optional[str] = None,
    arquivo: Optional[UploadFile] = File(default=None),
    session=Depends(get_session)
):
    statement = select(Livro).where(Livro.id == livro_id)
    result = await session.execute(statement)
    livro = result.scalar_one_or_none()

    if livro is None:
        return {"error": "Livro não encontrado"}

    if titulo is not None:
        livro.titulo = titulo
    if autor is not None:
        livro.autor = autor
    if arquivo is not None:
        file_url = upload_to_minio(arquivo)
        livro.pdf_url = file_url

    session.add(livro)
    await session.commit()
    await session.refresh(livro)

    return livro