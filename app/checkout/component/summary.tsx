import React from "react";
import { useCart } from "../../../contexts/CartContext";

interface SummaryProps {
  totalTickets: number;
  yellowPass: number;
  redGreenPass: number;
  totalPrice: number | string;
  setTicektInfo: any;
  selectedDate?: string | null;
  selectedVariants?: { [key: string]: { variant: any; quantity: number } };
  contentData?: any[];
}

const Summary: React.FC<SummaryProps> = ({
  totalTickets,
  yellowPass,
  redGreenPass,
  totalPrice,
  setTicektInfo,
  selectedDate,
  selectedVariants = {},
  contentData = []
}) => {
  const { addToCart } = useCart();

  const calculateVariantTotalPrice = () => {
    return Object.values(selectedVariants).reduce((total, item) => {
      return total + (parseFloat(item.variant.price) * item.quantity);
    }, 0);
  };

  const getTotalVariantQuantity = () => {
    return Object.values(selectedVariants).reduce((total, item) => total + item.quantity, 0);
  };

  const getVariantDisplayTitle = (variant: any) => {
    console.log('ContentData:', contentData);
    console.log('Variant title:', variant.title);

    if (!contentData || contentData.length === 0) {
      console.log('No content data available');
      return variant.title;
    }

    const contentItem = contentData[0]; // Assuming we're using the first content item
    if (!contentItem) {
      console.log('No content item found');
      return variant.title;
    }

    console.log('Content item:', contentItem);
    console.log('select_1_title:', contentItem.select_1_title);
    console.log('select2_title:', contentItem.select2_title);

    // Check if this is a yellow variant
    if (variant.title.toUpperCase().includes('Y')) {
      const title = contentItem.select_1_title || variant.title;
      console.log('Using yellow title:', title);
      return title;
    }
    // Check if this is a red/green variant
    if (variant.title.toUpperCase().includes('R/G')) {
      const title = contentItem.select2_title || variant.title;
      console.log('Using red/green title:', title);
      return title;
    }

    console.log('Using default title:', variant.title);
    return variant.title;
  };

  const handleNext = async () => {
    // If we have selected variants and a date, add to cart
    if (selectedDate && Object.values(selectedVariants).some(item => item.quantity > 0)) {
      try {
        const cartItems = Object.values(selectedVariants).filter(item => item.quantity > 0);

        for (const item of cartItems) {
          await addToCart({
            product: {
              id: item.variant.product?.id || '',
              title: item.variant.product?.title || 'Unlimited Rides Pass',
            },
            variantId: item.variant.id,
            quantity: item.quantity,
            price: item.variant.price,
            title: item.variant.title,
            image: item.variant.product?.images?.[0]?.url || '',
          });
        }

        alert('Items added to cart successfully!');
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add items to cart. Please try again.');
      }
    }

    // Continue with existing functionality
    setTicektInfo(true);
  };
  return (
    <div>
      {/* Summary */}
      <h3 className="text-3xl md:text-[34px] font-extrabold tracking-tight text-[#0E5A6A]">SUMMARY</h3>
      <div className="bg-white rounded-2xl shadow p-6 mt-6 space-y-4 max-h-[400px]">

        <div>
          <p className="text-xl font-extrabold text-[#0E5A6A]">TICKETS</p>
          <p className="text-[#5C7C86]">
            {Object.values(selectedVariants).some(item => item.quantity > 0)
              ? "Unlimited Rides Pass"
              : totalTickets > 0
                ? `${yellowPass} Yellow, ${redGreenPass} Red/Green`
                : "Select tickets"}
          </p>
        </div>
        <div>
          <p className="text-xl font-extrabold text-[#0E5A6A]">QUANTITY</p>
          <div className="text-[#5C7C86]">
            {Object.values(selectedVariants).some(item => item.quantity > 0)
              ? Object.values(selectedVariants)
                .filter(item => item.quantity > 0)
                .map((item, index) => (
                  <div key={index}>
                    {item.quantity} {getVariantDisplayTitle(item.variant)}
                  </div>
                ))
              : totalTickets > 0 ? totalTickets : "Select tickets"}
          </div>
        </div>
        <div>
          <p className="text-xl font-extrabold text-[#0E5A6A]">DATE</p>
          <p className="text-[#5C7C86]">{selectedDate ? selectedDate : "Select date"}</p>
        </div>
        <div>
          <p className="text-xl font-extrabold text-[#0E5A6A]">TOTAL PRICE</p>
          <p className="text-[#5C7C86]">
            {selectedDate && Object.values(selectedVariants).some(item => item.quantity > 0)
              ? `$${calculateVariantTotalPrice().toFixed(2)}`
              : "TBC"}
          </p>
        </div>

        <button className="w-full bg-[#aa3030] text-white py-3 rounded-full font-semibold" onClick={handleNext}>
          NEXT
        </button>
      </div>
    </div>
  );
};

export default Summary;
