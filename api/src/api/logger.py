import logging
import logging.config
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, Any


class CustomFormatter(logging.Formatter):
    """Formatador customizado que adiciona cores para diferentes níveis de log"""

    grey = "\x1b[38;20m"
    yellow = "\x1b[33;20m"
    red = "\x1b[31;20m"
    bold_red = "\x1b[31;1m"
    blue = "\x1b[34;20m"
    green = "\x1b[32;20m"
    reset = "\x1b[0m"

    COLORS = {
        logging.DEBUG: grey,
        logging.INFO: blue,
        logging.WARNING: yellow,
        logging.ERROR: red,
        logging.CRITICAL: bold_red,
    }

    def format(self, record):
        if hasattr(sys.stderr, "isatty") and sys.stderr.isatty():
            log_color = self.COLORS.get(record.levelno, self.reset)
            record.levelname = f"{log_color}{record.levelname}{self.reset}"

        return super().format(record)


def setup_logging(
    log_level: str = "INFO",
    log_file: str | None = None,
    enable_console: bool = True,
    log_format: str | None = None,
) -> None:
    """
    Configura o sistema de logging da aplicação

    Args:
        log_level: Nível de log (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_file: Caminho para o arquivo de log (opcional)
        enable_console: Se deve exibir logs no console
        log_format: Formato personalizado dos logs
    """

    if log_format is None:
        log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

    config: Dict[str, Any] = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "default": {"format": log_format, "datefmt": "%Y-%m-%d %H:%M:%S"},
            "colored": {
                "()": CustomFormatter,
                "format": log_format,
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
        },
        "handlers": {},
        "loggers": {
            "": {"level": log_level, "handlers": [], "propagate": False},
            "uvicorn": {"level": "INFO", "handlers": [], "propagate": False},
            "uvicorn.access": {"level": "INFO", "handlers": [], "propagate": False},
        },
    }

    if enable_console:
        config["handlers"]["console"] = {
            "class": "logging.StreamHandler",
            "formatter": "colored",
            "stream": "ext://sys.stdout",
        }
        config["loggers"][""]["handlers"].append("console")
        config["loggers"]["uvicorn"]["handlers"].append("console")
        config["loggers"]["uvicorn.access"]["handlers"].append("console")

    if log_file:
        log_path = Path(log_file)
        log_path.parent.mkdir(parents=True, exist_ok=True)

        config["handlers"]["file"] = {
            "class": "logging.handlers.RotatingFileHandler",
            "formatter": "default",
            "filename": log_file,
            "maxBytes": 10485760,  # 10MB
            "backupCount": 5,
            "encoding": "utf-8",
        }
        config["loggers"][""]["handlers"].append("file")
        config["loggers"]["uvicorn"]["handlers"].append("file")
        config["loggers"]["uvicorn.access"]["handlers"].append("file")

    logging.config.dictConfig(config)


def get_logger(name: str | None = None) -> logging.Logger:
    """
    Retorna um logger configurado

    Args:
        name: Nome do logger (geralmente __name__)

    Returns:
        Logger configurado
    """
    return logging.getLogger(name)


def configure_api_logging() -> None:
    """Configura o logging específico para a API"""

    log_level = os.getenv("LOG_LEVEL", "INFO").upper()
    log_file = os.getenv("LOG_FILE")

    if log_file is None:
        log_dir = Path("logs")
        log_dir.mkdir(exist_ok=True)
        log_file = log_dir / f"api_{datetime.now().strftime('%Y%m%d')}.log"

    setup_logging(
        log_level=log_level,
        log_file=str(log_file),
        enable_console=True,
        log_format="%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s",
    )

    logger = get_logger("hopper.api")
    logger.info("Sistema de logging configurado")
    logger.info(f"Nível de log: {log_level}")
    logger.info(f"Arquivo de log: {log_file}")


def configure_external_loggers():
    """Configura o nível de log para bibliotecas externas"""
    logging.getLogger("msal").setLevel(logging.WARNING)
    logging.getLogger("urllib3").setLevel(logging.WARNING)
    logging.getLogger("requests").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)
