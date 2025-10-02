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


def verify_password(password: str, hashed: str) -> bool:
    """
    Verifica se uma senha corresponde ao hash armazenado.

    Args:
        password (str): Senha em texto plano
        hashed (str): Hash armazenado

    Returns:
        bool: True se a senha for válida, False caso contrário
    """
    return pwd_context.verify(password, hashed)
