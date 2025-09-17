import React from "react";
import { useRouter } from "next/navigation";

interface SummaryProps {
  totalTickets: number;
  yellowPass: number;
  redGreenPass: number;
  totalPrice: number | string;
  setTicektInfo: any;
  selectedDate?: string | null;
  currentStep?: number;
  selectedVariants?: { [key: string]: { variant: any; quantity: number } };
}

const Summary: React.FC<SummaryProps> = ({
  totalTickets,
  yellowPass,
  redGreenPass,
  totalPrice,
  setTicektInfo,
  selectedDate,
  currentStep = 1,
  selectedVariants = {}
})  => {
  const router = useRouter();

  const handleContinueToCheckout = () => {
    if (currentStep === 1) {
      // If still on step 1, go to ticket info
      setTicektInfo(true);
    } else if (currentStep === 2 && selectedDate) {
      // If on step 2 and date is selected, go to payment
      const params = new URLSearchParams({
        date: selectedDate,
        tickets: totalTickets.toString(),
        yellowPass: yellowPass.toString(),
        redGreenPass: redGreenPass.toString(),
        totalPrice: totalPrice.toString(),
        selectedVariants: JSON.stringify(selectedVariants)
      });
      router.push(`/checkout/payment?${params.toString()}`);
    } else {
      // Default behavior
      setTicektInfo(true);
    }
  };

  const getButtonText = () => {
    if (currentStep === 1) {
      return "NEXT";
    } else if (currentStep === 2 && selectedDate) {
      return "CONTINUE TO CHECKOUT";
    } else {
      return "NEXT";
    }
  };
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

        <button 
          className="w-full bg-[#aa3030] text-white py-3 rounded-full font-semibold hover:bg-[#8a2525] transition-colors duration-200" 
          onClick={handleContinueToCheckout}
        >
          {getButtonText()}
        </button>
      </div>
</div>
  );
};

export default Summary;
