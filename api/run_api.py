#!/usr/bin/env python3
"""
Script para iniciar a API Hopper
"""
import sys
from pathlib import Path

# Adiciona o diretório src ao Python path
src_path = Path(__file__).parent / "src"
sys.path.insert(0, str(src_path))

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=[str(src_path)]
    )
