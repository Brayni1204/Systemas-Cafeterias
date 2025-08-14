// frontend/src/pages/admin/GestionProductosPage.tsx

import { useState, useEffect, useMemo } from 'react';
import { getProductosRequest, createProductoRequest, updateProductoRequest } from '../../api/producto.api';
import { ProductEditModal } from '../../components/ProductEditModal';
import io from 'socket.io-client';

// Definición de la interfaz del producto
interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: 'cafetería' | 'restaurante' | 'minimarket';
  estado: string;
  stock: number;
}

interface StockUpdatePayload {
  id_producto: number;
  stock: number;
}

// Tipo para el formulario de creación
type CreateProductoDTO = Omit<Producto, 'id_producto' | 'estado' | 'createdAt' | 'updatedAt'>;

const socket = io('http://localhost:4000');

function GestionProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  // El producto que se está editando o creando en el modal
  const [currentTargetProduct, setCurrentTargetProduct] = useState<Partial<Producto> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Hook para cargar datos y conectar a WebSockets
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProductosRequest();
        setProductos(res.data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };
    fetchProducts();

    const subdomain = window.location.host.split('.')[0];
    const tenantRoom = `tenant_${subdomain}`;
    socket.emit('join_tenant_room', tenantRoom);

    // Listeners de WebSocket para actualizaciones en tiempo real
    const handleNewProduct = (newProduct: Producto) => setProductos(prev => [newProduct, ...prev]);
    const handleUpdatedProduct = (updatedProduct: Producto) => {
      setProductos(prev => prev.map(p => p.id_producto === updatedProduct.id_producto ? updatedProduct : p));
    };

     // --- LISTENER NUEVO PARA EL STOCK ---
    const handleStockUpdate = (productosActualizados: StockUpdatePayload[]) => {
      setProductos(currentProducts => 
        currentProducts.map(p => {
          // Buscamos si este producto está en la lista de actualizados
          const updatedInfo = productosActualizados.find(up => up.id_producto === p.id_producto);
          // Si lo encontramos, devolvemos el producto con el nuevo stock. Si no, lo dejamos como está.
          return updatedInfo ? { ...p, stock: updatedInfo.stock } : p;
        })
      );
    };
    
    socket.on('nuevo_producto', handleNewProduct);
    socket.on('producto_actualizado', handleUpdatedProduct);

    socket.on('stock_actualizado', handleStockUpdate);
    // Función de limpieza para evitar fugas de memoria
    return () => {
      socket.off('nuevo_producto', handleNewProduct);
      socket.off('producto_actualizado', handleUpdatedProduct);
      socket.off('stock_actualizado', handleStockUpdate);
    };
  }, []);

  // Hook para filtrar los productos de forma eficiente
  const filteredProductos = useMemo(() => {
    return productos
      .filter(p => categoryFilter === 'all' || p.categoria === categoryFilter)
      .filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [productos, categoryFilter, searchTerm]);

  // Manejadores de acciones CRUD
  const handleOpenCreateModal = () => {
    setCurrentTargetProduct({ nombre: '', descripcion: '', precio: 0, stock: 0, categoria: 'cafetería' });
    setModalOpen(true);
  };

  const handleEditClick = (product: Producto) => {
    setCurrentTargetProduct(product);
    setModalOpen(true);
  };

  const handleToggleStatus = async (product: Producto) => {
    const newStatus = product.estado === 'activo' ? 'inactivo' : 'activo';
    await updateProductoRequest(product.id_producto, { estado: newStatus });
  };

  const handleSave = async (productToSave: Partial<Producto>) => {
    if ('id_producto' in productToSave && productToSave.id_producto) {
      await updateProductoRequest(productToSave.id_producto, productToSave);
    } else {
      // CORRECCIÓN: Usamos un type assertion más seguro que 'any'
      await createProductoRequest(productToSave as CreateProductoDTO);
    }
    setModalOpen(false);
  };

  return (
    <>
      <ProductEditModal 
        isOpen={isModalOpen} 
        product={currentTargetProduct}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Productos</h1>
          <button onClick={handleOpenCreateModal} className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-md w-full md:w-auto">
            Agregar Nuevo Producto
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4 p-4 bg-gray-50 rounded-lg border">
          <input 
            type="text" 
            placeholder="Buscar por nombre..."
            className="p-2 border border-gray-300 rounded-lg w-full md:w-1/3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-2 flex-wrap">
            {['all', 'cafetería', 'restaurante', 'minimarket'].map(cat => (
              <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${categoryFilter === cat ? 'bg-indigo-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead className="bg-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Producto</th>
                <th className="p-4 font-semibold text-gray-600 hidden md:table-cell">Categoría</th>
                <th className="p-4 font-semibold text-gray-600">Precio</th>
                <th className="p-4 font-semibold text-gray-600">Stock</th>
                <th className="p-4 font-semibold text-gray-600">Estado</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProductos.map((p) => (
                <tr key={p.id_producto} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{p.nombre}</td>
                  <td className="p-4 capitalize text-gray-600 hidden md:table-cell">{p.categoria}</td>
                  <td className="p-4 text-gray-600">S/ {p.precio.toFixed(2)}</td>
                  <td className={`p-4 font-bold ${p.stock < 10 ? 'text-red-500' : 'text-gray-600'}`}>{p.stock}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${p.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {p.estado}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <button onClick={() => handleEditClick(p)} className="px-4 py-1.5 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium">Editar</button>
                    <button onClick={() => handleToggleStatus(p)} className={`px-4 py-1.5 text-white rounded-md font-medium transition-colors ${p.estado === 'activo' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'}`}>
                      {p.estado === 'activo' ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default GestionProductosPage;
