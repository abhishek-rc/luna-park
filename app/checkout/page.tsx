"use client";
import { useState, useEffect } from "react";
import React from "react";
import { getContentByType } from "../../helper";
import Summary from "./component/summary";

export default function TicketBooking() {
  const [content, setContent] = useState<any[]>([]);
  const [yellowPass, setYellowPass] = useState(0);
  const [redGreenPass, setRedGreenPass] = useState(0);

  const totalTickets = yellowPass + redGreenPass;
  const totalPrice = totalTickets > 0 ? `$${totalTickets * 50}` : "TBC";
  const [passOpen, setPassOpen] = useState(false);

  const fetchContent = async (type: string) => {
    try {
      const response = await getContentByType(type);
      setContent(response || []);
    } catch (err) {
      console.error("Error fetching content:", err);
    } finally {
    }
  };
  useEffect(() => {
    fetchContent("riderpass");
  }, []);

  console.log(content, "111content");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-red-600">LUNA PARK</h1>
        <button className="text-blue-900 font-semibold">LOG IN</button>
      </div>

      {/* Steps */}
      <div className="flex justify-center space-x-8 text-sm font-semibold text-gray-600 mb-8">
        <span className="text-red-600 border-b-2 border-red-600 pb-1">
          01. SELECT TICKETS
        </span>
        <span>02. TICKETS INFO</span>
        <span>03. SELECT EXTRAS</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ticket Selection */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-800">
            SELECT YOUR TICKETS
          </h2>

          <div className="bg-white rounded-2xl shadow p-6 flex items-center">
            <img
              src={content[0]?.url}
              alt="Unlimited Rides"
              className="rounded-xl w-[50%] object-cover mr-6"
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800">
                {content[0]?.title.toUpperCase() || "Default Title"}
              </h3>

           {!passOpen&&<>   <hr className="border-t-2 border-dotted border-gray-400 my-4" />
              <p className="text-gray-600 mb-4">
                {content[0]?.multi_line ||
                  "Default description about the ticket."}
              </p>

              <button
                className="mt-4 text-red-600 font-semibold text-sm"
                onClick={() => setPassOpen(!passOpen)}
              >
                SELECT
              </button></>}

              {passOpen && (
                <div className="mt-4 space-y-4">
                  {/* Yellow Pass */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">
                        Unlimited Rides Pass Yellow
                      </p>
                      <p className="text-sm text-gray-500">
                        For riders 132cm+ in height
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          setYellowPass(Math.max(0, yellowPass - 1))
                        }
                        className="px-3 py-1 border rounded-full"
                      >
                        -
                      </button>
                      <span>{yellowPass}</span>
                      <button
                        onClick={() => setYellowPass(yellowPass + 1)}
                        className="px-3 py-1 border rounded-full"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Red/Green Pass */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">
                        Unlimited Rides Pass Red/Green
                      </p>
                      <p className="text-sm text-gray-500">
                        For riders 85cm - 132cm in height
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          setRedGreenPass(Math.max(0, redGreenPass - 1))
                        }
                        className="px-3 py-1 border rounded-full"
                      >
                        -
                      </button>
                      <span>{redGreenPass}</span>
                      <button
                        onClick={() => setRedGreenPass(redGreenPass + 1)}
                        className="px-3 py-1 border rounded-full"
                      >
                        +
                      </button>
                    </div>
                  </div>
                     {/* Clear */}
              <button
                onClick={() => {
                  setYellowPass(0);
                  setRedGreenPass(0);
                }}
                className="mt-4 text-red-600 font-semibold text-sm"
              >
                CLEAR
              </button>
                </div>
                
              )}

           
            </div>
          </div>
        </div>
        <Summary
          totalTickets={totalTickets}
          yellowPass={yellowPass}
          redGreenPass={redGreenPass}
          totalPrice={totalPrice}
        />
      </div>
    </div>
  );
}
