import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function Home() {
    const [tramites, setTramites] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/tramites')
            .then(res => res.json())
            .then(data => setTramites(data));
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold">Calendario de Trámites</h1>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={tramites.map(t => ({
                    title: t.nombre,
                    start: t.fecha_inicio,
                    end: t.fecha_vencimiento,
                }))}
            />
        </div>
    );
}
