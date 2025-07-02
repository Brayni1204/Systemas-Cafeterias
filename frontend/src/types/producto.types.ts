// Define la estructura de un objeto Producto
export interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: 'cafetería' | 'restaurante' | 'minimarket'; // Usando los enums definidos 
  estado: string;
  stock: number;
}