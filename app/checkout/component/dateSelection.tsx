'use client';

import React from "react";
import { Extras } from "./selectExtras";

type Day = {
  date: any | string;
  available: boolean;
  yellowPrice: number;
  redGreenPrice: number;
};

interface DateSelectionProps {
  currentStep: number;
  calendarData: Day[];
  setSelectedDate: (value: string | null) => void;
  selectedDate: string | null;
  totalTickets: number;
  ticketQuantities: { [key: string]: number };
  setCurrentStep: (step: number) => void;
  onDateChange: (dateStr: string, day?: Day) => void;
  ticketPrices: { [key: string]: number };
  selectedVariants: { [key: string]: { variant: any; quantity: number } };
}

const DateSelection: React.FC<DateSelectionProps> = ({
  currentStep,
  calendarData,
  setSelectedDate,
  selectedDate,
  totalTickets,
  ticketQuantities,
  setCurrentStep,
  onDateChange,
  ticketPrices,
  selectedVariants,
}) => {
  if (currentStep === 1) {
    return (
      <div className="space-y-8 lg:col-span-2">
        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-gray-900">SEPTEMBER 2025</h2>
          <button className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Days of week */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar dates */}
          <div className="grid grid-cols-7 gap-2">
            {calendarData.map((day) => (
              <div
                key={`cal-${String(day.date)}`}
                className={`aspect-square rounded-lg border-2 p-2 text-center ${day.available
                  ? 'border-green-200 bg-green-50 hover:border-green-400 cursor-pointer'
                  : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                  }`}
                onClick={() => {
                  if (day.available) {
                    const iso = `2025-09-${String(day.date).padStart(2, '0')}`;
                    setSelectedDate(iso);
                    onDateChange(iso, day);
                  }
                }}
              >
                <div className="text-sm font-medium mb-1">{day.date}</div>
                {day.available ? (
                  <div className="text-xs space-y-1">
                    <div className="text-yellow-600 font-semibold">Y: ${day.yellowPrice}</div>
                    <div className="text-red-600 font-semibold">R/G: ${day.redGreenPrice}</div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">TICKETS NOT AVAILABLE</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 2) {

    return (
      <div className="space-y-6 lg:col-span-2">
        <Extras />
      </div>
    );
  }

  if (currentStep === 3) {
    return (
      <div className="space-y-6 lg:col-span-2">
        <h3 className="text-xl font-semibold text-gray-900">Select Extras</h3>
        <p className="text-gray-600">Add additional services to your visit</p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-900 mb-2">Coming Soon</h4>
          <p className="text-yellow-800">Additional services and extras will be available here.</p>
        </div>
      </div>
    );
  }

  return null;
};

export default DateSelection;



