import React, { useState,useEffect } from "react";
import { getContentByType } from "../../../helper";




export const Extras = () => {
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
        fetchContent("checkoutlogo");
      }, []);
      console.log("contentExtras",content);
  return (
    <section className="space-y-10">
      {/* Immersive experiences */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-blue-900 mb-6">
          ADD OUR IMMERSIVE EXPERIENCES AT A SPECIAL ADD-ON PRICE!
        </h2>

        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 flex items-center gap-6">
          <img
            src={content[content.length-1]?.image?.url}
            alt={content[content.length-1]?.title}
            className="w-28 h-28 rounded-md object-cover"
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-gray-800">
                {content[content.length-1]?.title}
              </h3>
              {content[content.length-1]?.price && (
                <span className="text-red-700 font-extrabold">{content[content.length-1]?.price}</span>
              )}
            </div>
            <p className="text-gray-600 mt-2 max-w-3xl">{content[content.length-1]?.description}</p>
            {content[content.length-1]?.length && ( <p className="text-sm text-gray-600 mt-3 font-semibold">
                {content[content.length-1]?.length}
              </p>)}
             
     
          </div>
          <button className="whitespace-nowrap px-5 py-2 rounded-full border-2 border-blue-900 text-blue-900 font-semibold hover:bg-blue-900 hover:text-white transition-colors">
            {content[content.length-1]?.cta}
          </button>
        </div>
      </div>

      {/* Add extra fun */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-blue-900 mb-2">
          ADD EXTRA FUN
        </h2>
        <p className="text-gray-600 mb-6 max-w-3xl">
          Enhance your adventure and open a world of excitement and thrills with our add-ons.
          Capture memorable moments or play some classic games and win prizes!
        </p>

        <div className="space-y-6">
          {content.slice(0, -1).map((item) => (
            <div key={item.uid} className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
              {item.ribbon && (
                <div className="bg-amber-600 text-white text-center text-xs font-bold tracking-wide py-2">
                  {item.ribbon}
                </div>
              )}

              <div className="p-5 flex items-center gap-6">
                <img
                  src={item.image.url}
                  alt={item.title}
                  className="w-24 h-24 rounded-md object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                  <p className="text-gray-600 mt-1 max-w-3xl">{item.description}</p>
                </div>
                <button className="whitespace-nowrap px-8 py-3 rounded-full border-2 border-blue-900 text-blue-900 font-semibold hover:bg-blue-900 hover:text-white transition-colors">
                  {item.cta || "SELECT"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
