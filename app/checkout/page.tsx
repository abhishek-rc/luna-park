"use client";
import { useState, useEffect } from "react";
import React from "react";

import Summary from "./component/summary";
import CheckoutFooter from "./component/footer";
import TicketSelection from "./component/ticketSelection";
import { getContentByType } from "../../helper";
import DateSelection from "./component/dateSelection";

type Day = {
  date: any | string;
  available: boolean;
  yellowPrice: number;
  redGreenPrice: number;
};

export default function TicketBooking() {
  const [yellowPass, setYellowPass] = useState(0);
  const [redGreenPass, setRedGreenPass] = useState(0);
  const [logoContent, setLogoContent] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const totalTickets = yellowPass + redGreenPass;
  const totalPrice = totalTickets > 0 ? `$${totalTickets * 50}` : "TBC";
  const [passOpen, setPassOpen] = useState<number | null>(null);
  const [ticketInfo, setTicektInfo] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const ticketQuantities = {
    yellow: yellowPass,
    redGreen: redGreenPass,
  };

  const fetchContent = async (type: string) => {
    try {
      const response = await getContentByType(type);
      setLogoContent(response || []);
    } catch (err) {
      console.error("Error fetching content:", err);
    } finally {
    }
  };
  useEffect(() => {
    fetchContent("checkoutlogo");
  }, []);
  const [ticketPrices, setTicketPrices] = useState<{
    yellow: number;
    redGreen: number;
  }>({
    yellow: 50,
    redGreen: 50,
  });
  const onDateChange = (dateStr: string, day?: Day) => {
    setSelectedDate(dateStr);
    setCurrentStep(2);
    if (day) {
      setTicketPrices({ yellow: day.yellowPrice, redGreen: day.redGreenPrice });
    }
  };

  const [calendarData, setCalendarData] = useState<Day[]>(() =>
    generateCalendarData()
  );

  function generateCalendarData(): Day[] {
    // September has 30 days.
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthIndex = today.getMonth(); // 0-11
    const isSeptember = currentMonthIndex === 8 && currentYear === 2025; // 8 => September

    return Array.from({ length: 30 }, (_, i) => {
      const date = i + 1;
      // Compute if this calendar day is in the past relative to today (only if we are in Sep 2025)
      const isPast = isSeptember && date < today.getDate();
      // base availability pattern
      const baseAvailable = date % 3 !== 0;
      const available = !isPast && baseAvailable;
      const yellowPrice = 50 + (date % 5) * 2;
      const redGreenPrice = 50 + (date % 4) * 3;
      return { date, available, yellowPrice, redGreenPrice };
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 px-10">
      {/* Header */}
      {/* <div className="flex justify-between items-center mb-6">
        <img
          src={logoContent?.[0]?.url || "/luna-park-logo.png"}
          alt="Luna Park Logo"
          className="h-[80px] w-[150px] "
        />
        <button className="text-blue-900 font-semibold">LOG IN</button>
      </div> */}

      {/* Steps */}
      <div className="flex justify-center space-x-8 text-sm font-semibold text-gray-600 mb-8">
        <span className="text-red-600 border-b-2 border-red-600 pb-1">
          01. SELECT TICKETS
        </span>
        <span
          className={`${
            ticketInfo ? "text-red-600 border-b-2 border-red-600 pb-1" : ""
          }`}
        >
          02. TICKETS INFO
        </span>
        <span>03. SELECT EXTRAS</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {!ticketInfo && (
          <TicketSelection
            setPassOpen={setPassOpen}
            totalPrice={totalPrice}
            passOpen={passOpen}
            setYellowPass={setYellowPass}
            yellowPass={yellowPass}
            setRedGreenPass={setRedGreenPass}
            redGreenPass={redGreenPass}
          />
        )}
        {ticketInfo && (
          <DateSelection
            currentStep={currentStep}
            calendarData={calendarData}
            setSelectedDate={setSelectedDate}
            selectedDate={selectedDate}
            totalTickets={totalTickets}
            ticketQuantities={ticketQuantities}
            setCurrentStep={setCurrentStep}
            onDateChange={onDateChange}
            ticketPrices={ticketPrices}
          />
        )}
        <Summary
          totalTickets={totalTickets}
          yellowPass={yellowPass}
          redGreenPass={redGreenPass}
          totalPrice={totalPrice}
          setTicektInfo={setTicektInfo}
          selectedDate={selectedDate}
        />
      </div>
      <CheckoutFooter />
    </div>
  );
}
