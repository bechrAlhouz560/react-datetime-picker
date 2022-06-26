import React from 'react'
import { DayType } from '../../helpers'
import { useDatePicker } from '../../date-picker'

interface DayProps {
    data: DayType
    selected?: DayType
    handleSelectDay: (day: DayType) => any
}

export function Day({ data, selected, handleSelectDay }: DayProps) {
    
    const { minDate } = useDatePicker()

    if (minDate && data.date.getTime() < minDate?.getTime()) {
        return (
            <td 
                className='rdp calendar-day disabled'>
                {data.date.getDate()}
            </td>
        )
    }

    return (
        <td 
            onClick={e => handleSelectDay(data)} 
            className={
                `rdp calendar-day 
                ${data.date.getTime() == selected?.date.getTime() ? 'selected' : ''}
                ${data.currentMonth ? '' : 'different-month'}
            `}>
            {data.date.getDate()}
        </td>
    )
}
