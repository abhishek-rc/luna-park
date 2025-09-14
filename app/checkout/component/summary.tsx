import React from "react";
interface SummaryProps {
  totalTickets: number;
  yellowPass: number;
  redGreenPass: number;
  totalPrice: number | string;
}

const Summary: React.FC<SummaryProps> = ({
  totalTickets,
  yellowPass,
  redGreenPass,
  totalPrice,
})  => {
  return (
    <>
      {/* Summary */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">SUMMARY</h3>
        <div>
          <p className="font-semibold">TICKETS</p>
          <p className="text-gray-500">
            {totalTickets > 0
              ? `${yellowPass} Yellow, ${redGreenPass} Red/Green`
              : "Select tickets"}
          </p>
        </div>
        <div>
          <p className="font-semibold">QUANTITY</p>
          <p className="text-gray-500">
            {totalTickets > 0 ? totalTickets : "Select tickets"}
          </p>
        </div>
        <div>
          <p className="font-semibold">DATE</p>
          <p className="text-gray-500">Select date</p>
        </div>
        <div>
          <p className="font-semibold">TOTAL PRICE</p>
          <p className="text-gray-800 font-bold">{totalPrice}</p>
        </div>

        <button className="w-full bg-red-600 text-white py-3 rounded-full font-semibold">
          NEXT
        </button>
      </div>
    </>
  );
};

export default Summary;
