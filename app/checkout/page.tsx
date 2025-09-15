"use client";
import { useState, useEffect } from "react";
import React from "react";

import Summary from "./component/summary";
import CheckoutFooter from "./component/footer";
import TicketSelection from "./component/ticketSelection";
import { getContentByType } from "../../helper";

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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            {/* Calendar Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-gray-900">
                SEPTEMBER 2025
              </h2>
              <button className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Days of week */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-gray-600 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar dates */}
              <div className="grid grid-cols-7 gap-2">
                {calendarData.map(
                  (day: {
                    date:
                      | boolean
                      | React.ReactElement<
                          unknown,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | Promise<
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactPortal
                          | React.ReactElement<
                              unknown,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | null
                          | undefined
                        >
                      | React.Key
                      | null
                      | undefined;
                    available: any;
                    yellowPrice:
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactElement<
                          unknown,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | Promise<
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactPortal
                          | React.ReactElement<
                              unknown,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | null
                          | undefined
                        >
                      | null
                      | undefined;
                    redGreenPrice:
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactElement<
                          unknown,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | Promise<
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactPortal
                          | React.ReactElement<
                              unknown,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | null
                          | undefined
                        >
                      | null
                      | undefined;
                  }) => (
                    <div
                      className={`aspect-square rounded-lg border-2 p-2 text-center ${
                        day.available
                          ? "border-green-200 bg-green-50 hover:border-green-400 cursor-pointer"
                          : "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                      }`}
                      onClick={() => {
                        if (day.available) {
                          const iso = `2025-09-${String(day.date).padStart(2, '0')}`;
                          setSelectedDate(iso);
                        }
                      }}
                    >
                      <div className="text-sm font-medium mb-1">{day.date}</div>
                      {day.available ? (
                        <div className="text-xs space-y-1">
                          <div className="text-yellow-600 font-semibold">
                            Y: ${day.yellowPrice}
                          </div>
                          <div className="text-red-600 font-semibold">
                            R/G: ${day.redGreenPrice}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400">
                          TICKETS NOT AVAILABLE
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                Visit Details
              </h3>
              <p className="text-blue-800">
                <strong>Date:</strong> {selectedDate || "Please select a date"}
              </p>
              <p className="text-blue-800">
                <strong>Total Tickets:</strong> {totalTickets}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Selected Tickets</h3>
              {Object.entries(ticketQuantities).map(([type, quantity]) => {
                if (quantity === 0) return null;
                return (
                  <div
                    key={type}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="capitalize font-medium">
                      {quantity}x {type} Ticket
                    </span>
                    <span className="font-semibold text-blue-600">
                      $
                      {(
                        quantity *
                        ticketPrices[type as keyof typeof ticketPrices]
                      ).toFixed(2)}
                    </span>
                  </div>
                );
              })}

              {totalTickets === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>
                    No tickets selected. Please go back to select your tickets.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Select Extras
            </h3>
            <p className="text-gray-600">
              Add additional services to your visit
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">
                Coming Soon
              </h4>
              <p className="text-yellow-800">
                Additional services and extras will be available here.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
          <div className="lg:col-span-2">{renderStepContent()}</div>
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
