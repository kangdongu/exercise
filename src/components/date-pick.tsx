import { ko } from 'date-fns/locale';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateChoiceProps {
  onDateChange: (date: Date | null) => void;
  initialDate: Date | null;
}


export default function DateChoiceFuture({ onDateChange, initialDate }: DateChoiceProps) {

  const [startDate, setStartDate] = useState<Date | null>(initialDate);

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7 * 7);

  return (

    <DatePicker
      selected={startDate}
      onChange={(date: Date | null) => {
        setStartDate(date!);
        onDateChange(date);
      }}
      showIcon
      dateFormat="yyyy-MM-dd"
      shouldCloseOnSelect
      minDate={new Date(new Date().setDate(new Date().getDate() + 7))}
      maxDate={maxDate}
      locale={ko}
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 48 48"
        >
          <mask id="ipSApplication0">
            <g fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="4">
              <path strokeLinecap="round" d="M40.04 22v20h-32V22"></path>
              <path
                fill="#fff"
                d="M5.842 13.777C4.312 17.737 7.263 22 11.51 22c3.314 0 6.019-2.686 6.019-6a6 6 0 0 0 6 6h1.018a6 6 0 0 0 6-6c0 3.314 2.706 6 6.02 6c4.248 0 7.201-4.265 5.67-8.228L39.234 6H8.845l-3.003 7.777Z"
              ></path>
            </g>
          </mask>
          <path
            fill="currentColor"
            d="M0 0h48v48H0z"
            mask="url(#ipSApplication0)"
          ></path>
        </svg>
      }
      showTimeSelect={false}
    />

  );
};
