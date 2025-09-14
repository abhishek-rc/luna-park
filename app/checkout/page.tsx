"use client"
import { useState, useEffect } from "react";
import React from "react";

import Summary from "./component/summary";
import CheckoutFooter from "./component/footer";
import TicketSelection from "./component/ticketSelection";
import { getContentByType } from "../../helper";

export default function TicketBooking() {

  const [yellowPass, setYellowPass] = useState(0);
  const [redGreenPass, setRedGreenPass] = useState(0);
    const [logoContent, setLogoContent] = useState<any[]>([]);

  const totalTickets = yellowPass + redGreenPass;
  const totalPrice = totalTickets > 0 ? `$${totalTickets * 50}` : "TBC";
 const [passOpen, setPassOpen] = useState<number | null>(null);

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

console.log(logoContent,"logoContent")


  return (
    <div className="min-h-screen bg-gray-50 p-6 px-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
     <img
  src={logoContent?.[0]?.url || "/luna-park-logo.png"}
  alt="Luna Park Logo"
  className="h-[80px] w-[150px] "
/>
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
       <TicketSelection setPassOpen={setPassOpen}  totalPrice={totalPrice} passOpen={passOpen} setYellowPass={setYellowPass} yellowPass={yellowPass} setRedGreenPass={setRedGreenPass} redGreenPass={redGreenPass} />
        <Summary
          totalTickets={totalTickets}
          yellowPass={yellowPass}
          redGreenPass={redGreenPass}
          totalPrice={totalPrice}
        />
      </div>
      <CheckoutFooter/>
    </div>
  );
}
