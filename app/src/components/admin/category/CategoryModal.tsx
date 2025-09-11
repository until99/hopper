import { useState, useEffect } from 'react';
import { XIcon } from '@phosphor-icons/react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/Input';
import type { Category, CategoryCreate, CategoryUpdate } from '../../../interfaces/category';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  onSave: (data: CategoryCreate | CategoryUpdate) => Promise<void>;
}

const COLOR_OPTIONS = [
  { value: 'blue', label: 'Azul', class: 'bg-blue-500' },
  { value: 'green', label: 'Verde', class: 'bg-green-500' },
  { value: 'emerald', label: 'Esmeralda', class: 'bg-emerald-500' },
  { value: 'violet', label: 'Violeta', class: 'bg-violet-500' },
  { value: 'yellow', label: 'Amarelo', class: 'bg-yellow-500' },
  { value: 'slate', label: 'Cinza', class: 'bg-slate-500' },
] as const;

export function CategoryModal({ isOpen, onClose, category, onSave }: CategoryModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState<'blue' | 'green' | 'emerald' | 'violet' | 'yellow' | 'slate'>('blue');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const isEditing = !!category;

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setName(category.name);
        setColor(category.color);
        setDescription(category.description || '');
      } else {
        setName('');
        setColor('blue');
        setDescription('');
      }
    }
  }, [isOpen, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }

    setSaving(true);
    try {
      const data = {
        name: name.trim(),
        color,
        description: description.trim() || undefined,
      };

      await onSave(data);
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
          </h2>
          <button
            onClick={handleClose}
            disabled={saving}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <XIcon size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nome */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nome *
            </label>
            <Input.Root>
              <Input.Field
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome da categoria"
                required
                disabled={saving}
              />
            </Input.Root>
          </div>

          {/* Cor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cor *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColor(option.value)}
                  disabled={saving}
                  className={`
                    flex items-center gap-2 p-2 rounded-md border transition-colors
                    ${color === option.value 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 hover:border-gray-400'
                    }
                    disabled:opacity-50
                  `}
                >
                  <div className={`w-4 h-4 rounded-full ${option.class}`} />
                  <span className="text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição opcional da categoria"
              disabled={saving}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button.Root
              type="button"
              onClick={handleClose}
              disabled={saving}
              bgColor="bg-gray-100"
              textColor="text-gray-700"
              hover
              hoverColor="bg-gray-200"
              className="flex-1"
            >
              Cancelar
            </Button.Root>
            <Button.Root
              type="submit"
              disabled={saving || !name.trim()}
              bgColor="bg-blue-600"
              textColor="text-white"
              hover
              hoverColor="bg-blue-700"
              className="flex-1"
            >
              {saving ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
            </Button.Root>
          </div>
        </form>
      </div>
    </div>
  );
}
