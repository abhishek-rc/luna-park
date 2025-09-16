import React from "react";
interface SummaryProps {
  totalTickets: number;
  yellowPass: number;
  redGreenPass: number;
  totalPrice: number | string;
  setTicektInfo: any;
  selectedDate?: string | null;
}

const Summary: React.FC<SummaryProps> = ({
  totalTickets,
  yellowPass,
  redGreenPass,
  totalPrice,
  setTicektInfo,
  selectedDate
})  => {
  return (
    <div>
      {/* Summary */}
         <h3 className="text-3xl md:text-[34px] font-extrabold tracking-tight text-[#0E5A6A]">SUMMARY</h3>
      <div className="bg-white rounded-2xl shadow p-6 mt-6 space-y-4 max-h-[400px]">
     
        <div>
          <p className="text-xl font-extrabold text-[#0E5A6A]">TICKETS</p>
          <p className="text-[#5C7C86]">
            {totalTickets > 0
              ? `${yellowPass} Yellow, ${redGreenPass} Red/Green`
              : "Select tickets"}
          </p>
        </div>
        <div>
          <p className="text-xl font-extrabold text-[#0E5A6A]">QUANTITY</p>
          <p className="text-[#5C7C86]">
            {totalTickets > 0 ? totalTickets : "Select tickets"}
          </p>
        </div>
        <div>
          <p className="text-xl font-extrabold text-[#0E5A6A]">DATE</p>
          <p className="text-[#5C7C86]">{selectedDate ? selectedDate : "Select date"}</p>
        </div>
        <div>
          <p className="text-xl font-extrabold text-[#0E5A6A]">TOTAL PRICE</p>
          <p className="text-[#5C7C86]">{totalPrice}</p>
        </div>

        <button className="w-full bg-[#aa3030] text-white py-3 rounded-full font-semibold" onClick={()=>setTicektInfo(true)}>
          NEXT
        </button>
      </div>
</div>
  );
};

export default Summary;
