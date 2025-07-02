// frontend/src/components/ProductEditModal.tsx
import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';

// Copia la interfaz Producto aquí también
interface Producto {
    id_producto: number; nombre: string; descripcion: string; precio: number;
    categoria: 'cafetería' | 'restaurante' | 'minimarket'; estado: string; stock: number;
}

interface Props {
  product: Partial<Producto> | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (productToSave: Partial<Producto>) => void;
}

export const ProductEditModal = ({ product, isOpen, onClose, onSave }: Props) => {
  const [formData, setFormData] = useState(product);

  useEffect(() => { setFormData(product) }, [product]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: name === 'precio' || name === 'stock' ? parseFloat(value) || 0 : value } : null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if(formData) onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 z-40 flex justify-center items-center p-4" style={{ backgroundColor: '#000000b5' }}>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">{product?.id_producto ? 'Editar' : 'Crear'} Producto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="nombre" placeholder="Nombre" value={formData.nombre || ''} onChange={handleChange} className="w-full p-2 border rounded" required/>
          <textarea name="descripcion" placeholder="Descripción" value={formData.descripcion || ''} onChange={handleChange} className="w-full p-2 border rounded" />
          <div className="grid grid-cols-2 gap-4">
            <input type="number" step="0.01" name="precio" placeholder="Precio" value={formData.precio || ''} onChange={handleChange} className="w-full p-2 border rounded" required/>
            <input type="number" name="stock" placeholder="Stock" value={formData.stock || ''} onChange={handleChange} className="w-full p-2 border rounded" required/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <select name="categoria" value={formData.categoria || 'cafetería'} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="cafetería">Cafetería</option>
              <option value="restaurante">Restaurante</option>
              <option value="minimarket">Minimarket</option>
            </select>
            {product?.id_producto && (
              <select name="estado" value={formData.estado || 'activo'} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            )}
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};