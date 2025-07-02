// frontend/src/pages/admin/DashboardPage.tsx

// Un componente de tarjeta reutilizable para el dashboard
const StatCard = ({ title, value }: { title: string, value: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-medium text-gray-500">{title}</h3>
    <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
  </div>
);


function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Estos son ejemplos basados en los requerimientos */}
        [cite_start]<StatCard title="Ventas del Día" value="S/ 1,250.00" /> [cite: 2]
        <StatCard title="Pedidos Pendientes" value="8" />
        [cite_start]<StatCard title="Productos con Bajo Stock" value="3" /> [cite: 6]
        <StatCard title="Nuevos Clientes Hoy" value="5" />
      </div>
      {/* Aquí podrías añadir gráficos y más reportes en el futuro */}
    </div>
  );
}

export default DashboardPage;