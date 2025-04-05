import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isToday, isSameDay } from 'date-fns';

export function Calendar({ selected, onSelect }) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });
  
  const startDay = getDay(startOfMonth(currentMonth));
  
  const monthName = format(currentMonth, 'MMMM yyyy');
  
  const handleDateClick = (day) => {
    onSelect(day);
  };
  
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
          &lt;
        </button>
        <h2 className="font-semibold">{monthName}</h2>
        <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
          &gt;
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="font-medium p-2">
            {day}
          </div>
        ))}
        
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-${index}`} className="p-2" />
        ))}
        
        {daysInMonth.map((day) => {
          const isSelectedDay = selected && isSameDay(day, selected);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isCurrentDay = isToday(day);
          
          return (
            <button
              key={day.toISOString()}
              onClick={() => handleDateClick(day)}
              className={`p-2 rounded-full ${isSelectedDay ? 'bg-blue-600 text-white' : ''} ${isCurrentDay && !isSelectedDay ? 'bg-blue-100' : ''} ${!isCurrentMonth ? 'text-gray-400' : ''}`}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}