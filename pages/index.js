import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function Home() {
    const [tramites, setTramites] = useState([]);
    const [nombre, setNombre] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [diasHabiles, setDiasHabiles] = useState(1);

    // Cargar trámites al iniciar
    useEffect(() => {
        fetch('http://localhost:3001/tramites')
            .then(res => res.json())
            .then(data => setTramites(data));
    }, []);

    // Agregar un nuevo trámite
    const handleAgregarTramite = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:3001/tramites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, fecha_inicio: fechaInicio, dias_habiles: diasHabiles })
        });

        const newTramite = await response.json();
        setTramites([...tramites, newTramite]);
        setNombre('');
        setFechaInicio('');
        setDiasHabiles(1);
    };

    // Eliminar un trámite
    const handleEliminarTramite = async (id) => {
        await fetch(`http://localhost:3001/tramites/${id}`, { method: 'DELETE' });
        setTramites(tramites.filter(t => t.id !== id));
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Calendario de Trámites</h1>

            {/* Formulario de Agregar Trámite */}
            <form onSubmit={handleAgregarTramite} className="mb-4 flex gap-4">
                <input
                    type="text"
                    placeholder="Nombre del trámite"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    className="border p-2 rounded w-1/3"
                />
                <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    required
                    className="border p-2 rounded"
                />
                <input
                    type="number"
                    value={diasHabiles}
                    onChange={(e) => setDiasHabiles(parseInt(e.target.value))}
                    min="1"
                    required
                    className="border p-2 rounded w-20"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Agregar</button>
            </form>

            {/* Calendario */}
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={tramites.map(t => ({
                    id: t.id,
                    title: t.nombre,
                    start: t.fecha_inicio,
                    end: t.fecha_vencimiento
                }))}
                eventClick={(info) => {
                    if (confirm("¿Deseas eliminar este trámite?")) {
                        handleEliminarTramite(info.event.id);
                    }
                }}
            />
        </div>
    );
}
