CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

CREATE TRIGGER IF NOT EXISTS update_users_updated_at 
    AFTER UPDATE ON users
    BEGIN
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT UNIQUE NOT NULL,
    color TEXT NOT NULL CHECK (color IN ('blue', 'green', 'emerald', 'violet', 'yellow', 'slate')),
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

CREATE TRIGGER IF NOT EXISTS update_categories_updated_at 
    AFTER UPDATE ON categories
    BEGIN
        UPDATE categories SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Tabela de dashboards (para associações futuras)
CREATE TABLE IF NOT EXISTS dashboards (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    dashboard_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    workspace_id TEXT NOT NULL,
    workspace TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dashboards_dashboard_id ON dashboards(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_dashboards_workspace_id ON dashboards(workspace_id);

CREATE TRIGGER IF NOT EXISTS update_dashboards_updated_at 
    AFTER UPDATE ON dashboards
    BEGIN
        UPDATE dashboards SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Tabela de relacionamento entre dashboards e categorias
CREATE TABLE IF NOT EXISTS dashboard_categories (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    dashboard_id TEXT NOT NULL,
    category_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dashboard_id) REFERENCES dashboards(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE(dashboard_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_dashboard_categories_dashboard_id ON dashboard_categories(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_categories_category_id ON dashboard_categories(category_id);

-- Inserir categorias padrão
INSERT INTO categories (name, color, description) 
SELECT 'Sales', 'blue', 'Dashboards relacionados a vendas'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Sales');

INSERT INTO categories (name, color, description) 
SELECT 'Marketing', 'green', 'Dashboards de marketing e campanhas'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Marketing');

INSERT INTO categories (name, color, description) 
SELECT 'Finance', 'emerald', 'Dashboards financeiros e contábeis'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Finance');

INSERT INTO categories (name, color, description) 
SELECT 'Operations', 'violet', 'Dashboards operacionais'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Operations');

INSERT INTO categories (name, color, description) 
SELECT 'HR', 'yellow', 'Dashboards de recursos humanos'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'HR');

INSERT INTO categories (name, color, description) 
SELECT 'General', 'slate', 'Dashboards gerais e diversos'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'General');
