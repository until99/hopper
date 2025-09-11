try:
    from .auth import router as auth_router
    from .category import router as category_router
except ImportError:
    from routes.auth import router as auth_router
    from routes.category import router as category_router

__all__ = ["auth_router", "category_router"]
