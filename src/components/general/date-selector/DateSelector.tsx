import { useEffect, useRef, useState } from 'react'
import * as f from '../../helpers'
import { Day } from './Day'
import { useDatePicker } from '../../date-picker'
import NumberFormat from 'react-number-format'
import arrowLeftIcon from '../../../assets/arrow-left.svg';
import arrowRightIcon from '../../../assets/arrow-right.svg';

interface DateSelectorProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    onChange?: (date: Date | undefined) => any
}






export function DateSelector({ open, setOpen, onChange }: DateSelectorProps) {

    const { selected, setSelected, submitOnChange } = useDatePicker()

    const calendarRef = useRef<any>()
    const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
    // const typeInputRef = useRef<any>()
    const regex = /^[0-1][0-2]\/[0-3][0-9]\/[0-9][0-9][0-9][0-9]$/
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const [currentMonth, setCurrentMonth] = useState<f.DayType[][]>(f.getSplittedMonthArray(f.getMonth(2022, new Date().getMonth())))
    const [inputOpened, setInputOpened] = useState<boolean>(false);
    const [dateValue,setDateValue] = useState<string>("");
    useEffect(() => {
        const trigger = document.querySelector('div.rdp.picker-trigger')
        document.addEventListener('click', (e: any) => {
            if (e.composedPath().includes(trigger)) {
                return
            }
            else if (!e.composedPath().includes(calendarRef.current)) {
                setOpen(false)
            }
        })
    }, [])

    function handleTypeInput(e: any) {

    
        setDateValue(e.currentTarget.value)

    
    }

    function handleSelectDay(day: f.DayType) {
        if (submitOnChange) {
            setSelected?.(day)
            onChange?.(day.date)
            setOpen(false)
        }
        else if (!selected) {
            setSelected?.(day)
        }
        else if (selected.date.getTime() == day.date.getTime()) {
            setSelected?.(undefined)
        }
        else {
            setSelected?.(day)
        }
    }

    function handleChangeMonth(type: 'next' | 'prev', amount: number) {
        let monthNumber = currentMonth[2][3].date.getMonth()
        let yearNumber = currentMonth[2][3].date.getFullYear()
        if (type == 'next') {
            for (let i = 0; i < amount; i++) {
                let nextData = f.getNextMonth(yearNumber, monthNumber)
                monthNumber = nextData.month
                yearNumber = nextData.year
            }
        }
        else if (type == 'prev') {
            for (let i = 0; i < amount; i++) {
                let prevData = f.getPreviousMonth(yearNumber, monthNumber)
                monthNumber = prevData.month
                yearNumber = prevData.year
            }
        }
        const newCurrentMonth = f.getSplittedMonthArray(f.getMonth(yearNumber, monthNumber))

        setCurrentMonth(newCurrentMonth)
    }

    function handleApllyChange() {
        onChange?.(selected?.date)
        setOpen(false)
    }

    function handleCancel() {
        setSelected?.(undefined)
        setOpen(false)
    }

    return (
        <div 
            className={`rdp date-picker-wrapper ${open ? 'open' : 'closed'}`}
            onClick={(e) => e.stopPropagation()}
            ref={calendarRef}
        >
            <div className="rdp date-picker-header">
                <div onClick={e => handleChangeMonth('prev', 1)} className="rdp scroll-arrow left">
                    <img src={arrowLeftIcon} alt="" />
                </div>
                {
                    !inputOpened ? <h3 className="rdp month-year" onClick={() => setInputOpened(true)}>
                        {monthNames[currentMonth[3][3].date.getMonth()]} {currentMonth[3][3].date.getFullYear()}
                    </h3> : <NumberFormat   value={dateValue} className='date-input' format={"##/##/####"} placeholder="MM/DD/YYYY" 
                    onChange={handleTypeInput} onKeyDown={

                        function (e: any) {

                            console.log(e.key)
                            if (e.key === "Enter")
                            {
                                let value = e.currentTarget.value;
                                let test = regex.test(value);
                                if (test) 
                                {
                                    let parsed = new Date(value);


                                    let date = f.getSplittedMonthArray(f.getMonth(parsed.getFullYear(), parsed.getMonth()))
                                    handleSelectDay({
                                        date : parsed,
                                        currentMonth: false


                                    })
                                    setCurrentMonth(date);
                                    setInputOpened(false);

                                }
                            }
                            
                        }
                    }/>
                }
                <div onClick={e => handleChangeMonth('next', 1)}className="rdp scroll-arrow right">
                        <img src={arrowRightIcon} alt="" />

                </div>
            </div>
            <table className="rdp date-picker table">
                    <tr>
                        {days.map((day, i) => {
                            return <th className="rdp calendar-day-title" key={i}>{day}</th>
                        })}
                    </tr>
            </table>
            <div className="rdp date-picker-calendar-wrapper">
                <table className="rdp date-picker table">
                        {currentMonth.map((row, i) => {
                            return (
                                <tr key={i}>
                                    {row.map((day, i) => {
                                        return <Day selected={selected} data={day} key={i} handleSelectDay={handleSelectDay}/>
                                    })}
                                </tr>
                            )
                        })}
                </table>
            </div>
            {!submitOnChange && <div className="rdp date-picker-buttons-wrapper">
                <button onClick={handleCancel} className="rdp button secondary-button">Cancel</button>
                <button onClick={handleApllyChange} className="rdp button primary-button">Apply</button>
            </div>}
        </div>
    )
}