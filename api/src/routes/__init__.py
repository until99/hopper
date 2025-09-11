try:
    from .auth import router as auth_router
except ImportError:
    from routes.auth import router as auth_router

__all__ = ["auth_router"]
