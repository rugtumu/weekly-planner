import React, { useState, useRef, useEffect } from 'react';
import { Download } from 'lucide-react';
import eventsData from './events.json';

export default function App() {
  const [events, setEvents] = useState([]);
  const plannerRef = useRef(null);

  useEffect(() => {
    setEvents(eventsData);
  }, []);

  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  const hours = Array.from({ length: 16 }, (_, i) => i + 8);

  const exportToPNG = async () => {
    const html2canvas = (await import('html2canvas')).default;
    const element = plannerRef.current;
    
    const canvas = await html2canvas(element, {
      backgroundColor: '#000000',
      scale: 2,
      logging: false,
    });
    
    const link = document.createElement('a');
    link.download = `haftalik-plan-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const timeToMinutes = (time) => {
    const [h, m] = time.split(':').map(Number);
    return (h - 8) * 60 + m;
  };

  const getEventPosition = (startTime, endTime) => {
    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);
    const top = (start / 60) * 60;
    const height = ((end - start) / 60) * 60;
    return { top, height };
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-light tracking-tight">Haftalık Planlayıcı</h1>
            <div className="flex gap-2">
              <button
                onClick={exportToPNG}
                className="bg-zinc-800 hover:bg-zinc-700 text-gray-100 px-4 py-2 rounded font-medium flex items-center gap-2 transition-colors border border-zinc-700"
              >
                <Download size={18} />
                PNG Olarak İndir
              </button>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-amber-500/50 via-amber-500/20 to-transparent"></div>
        </div>

        <div ref={plannerRef} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="grid grid-cols-8 border-b border-zinc-800">
            <div className="p-4 border-r border-zinc-800">
              <span className="text-xs text-gray-600 uppercase tracking-wider">Saat</span>
            </div>
            {days.map(day => (
              <div key={day} className="p-4 border-r border-zinc-800 last:border-r-0">
                <span className="text-sm font-medium">{day}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-8 relative">
            <div className="border-r border-zinc-800">
              {hours.map(hour => (
                <div key={hour} className="h-[60px] border-b border-zinc-800 px-3 py-2">
                  <span className="text-xs text-gray-600">{String(hour).padStart(2, '0')}:00</span>
                </div>
              ))}
            </div>

            {days.map((day) => (
              <div key={day} className="relative border-r border-zinc-800 last:border-r-0">
                {hours.map(hour => (
                  <div key={hour} className="h-[60px] border-b border-zinc-800"></div>
                ))}

                <div className="absolute inset-0 pointer-events-none">
                  {events
                    .filter(event => event.day === day)
                    .map(event => {
                      const { top, height } = getEventPosition(event.startTime, event.endTime);
                      return (
                        <div
                          key={event.id}
                          className="absolute left-1 right-1 rounded overflow-hidden pointer-events-auto group"
                          style={{
                            top: `${top}px`,
                            height: `${height}px`,
                            backgroundColor: event.color,
                            opacity: 0.9
                          }}
                        >
                          <div className="p-2 h-full flex flex-col justify-between text-black">
                            <div className="flex items-start justify-between gap-1">
                              <span className="text-xs font-medium leading-tight">{event.name}</span>
                            </div>
                            <span className="text-[10px] opacity-75">
                              {event.startTime} - {event.endTime}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
