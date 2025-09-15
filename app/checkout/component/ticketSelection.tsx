import React, { useEffect, useState } from "react";
import { getContentByType } from "../../../helper";

interface TicektSelectionProps {
  setPassOpen: any;
  passOpen: any
  redGreenPass: number;
  setYellowPass: (value: number) => void;
  yellowPass: number;
  setRedGreenPass: (value: number) => void;
  totalPrice: number | string;
}


const TicketSelection: React.FC<TicektSelectionProps> = ({setPassOpen,passOpen,setYellowPass,yellowPass,setRedGreenPass,redGreenPass}) => {
      const [content, setContent] = useState<any[]>([]);
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
  return (
    <> {/* Ticket Selection */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-3xl md:text-[34px] font-extrabold tracking-tight text-[#0E5A6A]">
            SELECT YOUR TICKETS
          </h2>

          {content.map((item, index) => (
            <div    key={item?.id || index} className="bg-white rounded-2xl shadow p-6 flex items-center">
            <img
              src={item?.url}
              alt="Unlimited Rides"
              className="rounded-xl w-[50%] object-cover mr-6"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-extrabold text-[#0E5A6A]">
                {item?.title.toUpperCase() || "Default Title"}
              </h3>

              
               {passOpen !== index && ( <>
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
                </>)}
              

              {passOpen ===index && (
                <div className="mt-4 space-y-4">
                  {/* Yellow Pass */}
                  <div className="flex justify-between items-center">
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
                        onClick={() =>
                          setYellowPass(Math.max(0, yellowPass - 1))
                        }
                        className="px-3 py-1 border rounded-full border-[#5C7C86] text-[#5C7C86]"
                      >
                        -
                      </button>
                      <span className="text-[#5C7C86]">{yellowPass}</span>
                      <button
                        onClick={() => setYellowPass(yellowPass + 1)}
                        className="px-3 py-1 border rounded-full border-[#5C7C86] text-[#5C7C86]"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Red/Green Pass */}
                  <div className="flex justify-between items-center">
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
                        onClick={() =>
                          setRedGreenPass(Math.max(0, redGreenPass - 1))
                        }
                        className="px-3 py-1 border rounded-full border-[#5C7C86] text-[#5C7C86]"
                      >
                        -
                      </button>
                      <span className="text-[#5C7C86]">{redGreenPass}</span>
                      <button
                        onClick={() => setRedGreenPass(redGreenPass + 1)}
                        className="px-3 py-1 border rounded-full border-[#5C7C86] text-[#5C7C86]"
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
        </div></>
  );
};

export default TicketSelection;
