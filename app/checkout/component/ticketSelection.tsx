import React, { useEffect, useState } from "react";
import { getContentByType } from "../../../helper";
import { useShopifyProducts } from "../../../hooks/useShopifyProducts";
import { ShopifyProduct } from "../../../shopify-sdk";

interface TicektSelectionProps {
  setPassOpen: any;
  passOpen: any;
  totalPrice: number | string;
  selectedVariants: { [key: string]: { variant: any; quantity: number } };
  setSelectedVariants: (variants: { [key: string]: { variant: any; quantity: number } }) => void;
  setContentData: (data: any[]) => void;
}

const TicketSelection: React.FC<TicektSelectionProps> = ({
  setPassOpen,
  passOpen,
  selectedVariants,
  setSelectedVariants,
  setContentData,
}) => {
  const [content, setContent] = useState<any[]>([]);
  const { products, loading: productsLoading } = useShopifyProducts();
  const [unlimitedRidesProduct, setUnlimitedRidesProduct] = useState<ShopifyProduct | null>(null);

  const fetchContent = async (type: string) => {
    try {
      const response = await getContentByType(type);
      setContent(response || []);
      setContentData(response || []);
    } catch (err) {
      console.error("Error fetching content:", err);
    } finally {
    }
  };

  useEffect(() => {
    fetchContent("riderpass");
  }, []);

  // Find the Unlimited Rides Pass product from Shopify
  useEffect(() => {
    if (products.length > 0) {
      const unlimitedRides = products.find(product =>
        product.title.toLowerCase().includes('unlimited rides pass')
      );
      setUnlimitedRidesProduct(unlimitedRides || null);
    }
  }, [products]);

  // Get variants for Y and R/G
  const getVariantsByType = (type: 'Y' | 'R/G') => {
    if (!unlimitedRidesProduct) return [];
    const variants = unlimitedRidesProduct.variants.filter(variant => {
      const variantTitle = variant.title.toUpperCase();
      return variantTitle.includes(type);
    });
    return variants;
  };

  const yellowVariants = getVariantsByType('Y');
  const redGreenVariants = getVariantsByType('R/G');

  const updateVariantQuantity = (variantId: string, quantity: number, type: 'yellow' | 'redGreen') => {
    const variant = type === 'yellow' ? yellowVariants.find(v => v.id === variantId) : redGreenVariants.find(v => v.id === variantId);
    if (variant) {
      setSelectedVariants({
        ...selectedVariants,
        [variantId]: { variant, quantity }
      });
    }
  };
  return (
    <>
      {" "}
      {/* Ticket Selection */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-3xl md:text-[34px] font-extrabold tracking-tight text-[#0E5A6A]">
          SELECT YOUR TICKETS
        </h2>

        {content.map((item, index) => (
          <div
            key={item?.id || index}
            className="bg-white rounded-2xl min-h-[200px] shadow flex items-center"
          >
            <div className="relative w-48 h-[-webkit-fill-available] flex-shrink-0 mr-6">
              <img
                src={item?.url}
                alt={item?.title || "Unlimited Rides"}
                className="absolute inset-0 w-full h-full object-cover rounded-l-xl"
              />
            </div>
            <div className="flex-1 p-6">
              <h3 className="text-2xl font-extrabold text-[#0E5A6A]">
                {item?.title.toUpperCase() || "Default Title"}
              </h3>

              {passOpen !== index && (
                <>
                  {" "}
                  <hr className="border-t-2 border-dotted border-gray-300 my-4" />
                  <p className="text-[#5C7C86] mb-4">
                    {item?.multi_line ||
                      "Default description about the ticket."}
                  </p>
                  <button
                    className="mt-4 text-[#aa3030] font-semibold text-sm border border-[#aa3030] p-[10px] rounded-full"
                    onClick={() => setPassOpen(index)}
                  >
                    SELECT
                  </button>
                </>
              )}

              {passOpen === index && (
                <div className="mt-4 space-y-4">
                  {/* Yellow Pass Variants */}
                  {yellowVariants.map((variant) => (
                    <div key={variant.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-[#0E5A6A]">
                          {item?.select_1_title}
                        </p>
                        <p className="text-sm text-[#5C7C86]">
                          {item.select2description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            const currentQuantity = selectedVariants[variant.id]?.quantity || 0;
                            updateVariantQuantity(variant.id, Math.max(0, currentQuantity - 1), 'yellow');
                          }}
                          className="px-3 py-1 border rounded-full border-[#5C7C86] text-[#5C7C86]"
                        >
                          -
                        </button>
                        <span className="text-[#5C7C86]">
                          {selectedVariants[variant.id]?.quantity || 0}
                        </span>
                        <button
                          onClick={() => {
                            const currentQuantity = selectedVariants[variant.id]?.quantity || 0;
                            updateVariantQuantity(variant.id, currentQuantity + 1, 'yellow');
                          }}
                          className="px-3 py-1 border rounded-full border-[#5C7C86] text-[#5C7C86]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Red/Green Pass Variants */}
                  {redGreenVariants.map((variant) => (
                    <div key={variant.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-[#0E5A6A]">
                          {content[0].select2_title}
                        </p>
                        <p className="text-sm text-[#5C7C86]">
                          {content[0].select2description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            const currentQuantity = selectedVariants[variant.id]?.quantity || 0;
                            updateVariantQuantity(variant.id, Math.max(0, currentQuantity - 1), 'redGreen');
                          }}
                          className="px-3 py-1 border rounded-full border-[#5C7C86] text-[#5C7C86]"
                        >
                          -
                        </button>
                        <span className="text-[#5C7C86]">
                          {selectedVariants[variant.id]?.quantity || 0}
                        </span>
                        <button
                          onClick={() => {
                            const currentQuantity = selectedVariants[variant.id]?.quantity || 0;
                            updateVariantQuantity(variant.id, currentQuantity + 1, 'redGreen');
                          }}
                          className="px-3 py-1 border rounded-full border-[#5C7C86] text-[#5C7C86]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Clear */}
                  <button
                    onClick={() => {
                      setSelectedVariants({});
                      setPassOpen(null);
                    }}
                    className="mt-4 text-[#aa3030] font-semibold text-sm text-underline"
                  >
                    CLEAR
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TicketSelection;
