import '../styles/WeekCalendar.css';
import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/mass.css';

/*
const WeekCalendar = () => {

    return (
        <div style={{ height: '80vh' }}>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin]}
                initialView="timeGridWeek"
                events={[
                    {title : 'Sample1'},
                    {title : 'Sample2'},
                ]}
            editable={true}
            droppable={true}
            eventColor="#378006"
        />
        </div>
    );
}; */

export default WeekCalendar;


