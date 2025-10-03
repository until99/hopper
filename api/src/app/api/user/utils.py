from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    Criptografa uma senha usando Argon2 através da passlib.

    Args:
        password (str): Senha em texto plano

    Returns:
        str: Senha criptografada
    """
    return pwd_context.hash(password)
