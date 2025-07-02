// frontend/src/api/producto.api.ts
import api from './axios';
// La interfaz debe coincidir con la que ya tienes
interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: 'cafetería' | 'restaurante' | 'minimarket';
  estado: string;
  stock: number;
}

// Omitimos el id al crear, la BD lo genera
/* type CreateProductoDTO = Omit<Producto, 'id_producto' | 'estado' | 'createdAt' | 'updatedAt'>;
type UpdateProductoDTO = Partial<Omit<Producto, 'id_producto'>>;

// Ya no necesitamos pasar el token en cada función, el interceptor lo hace
export const getProductosRequest = () => api.get('/v1/productos');

export const createProductoRequest = (producto: CreateProductoDTO) => api.post('/v1/productos', producto);
// --- FUNCIÓN AÑADIDA ---
export const updateProductoRequest = (id: number, data: UpdateProductoDTO) => api.put(`/v1/productos/${id}`, data); */
type CreateProductoDTO = Omit<Producto, 'id_producto' | 'estado' | 'createdAt' | 'updatedAt'>;
// Para actualizar, cualquier campo de Producto (excepto id) es opcional
type UpdateProductoDTO = Partial<Omit<Producto, 'id_producto'>>;

export const getProductosRequest = () => api.get('/v1/productos');
export const createProductoRequest = (producto: CreateProductoDTO) => api.post('/v1/productos', producto);
// --- FUNCIÓN AÑADIDA ---
export const updateProductoRequest = (id: number, data: UpdateProductoDTO) => api.put(`/v1/productos/${id}`, data);