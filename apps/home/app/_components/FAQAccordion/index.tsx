"use client";

import { useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

interface FAQAccordionProps {
  title?: string;
  items: FAQItem[];
}

export default function FAQAccordion({
  title = "자주 묻는 질문(FAQ)",
  items,
}: FAQAccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  return (
    <section
      style={{
        padding: "56px 0",
        background:
          "linear-gradient(180deg, rgba(232,240,254,0.55) 0%, rgba(245,244,240,1) 100%)",
      }}
    >
      <div
        className="container-main"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(24px, 4vw, 34px)",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "28px",
            letterSpacing: "-0.02em",
            color: "#111",
          }}
        >
          {title}
        </h2>

        <div style={{ display: "grid", gap: "14px" }}>
          {items.map((item, index) => {
            const isOpen = openIndexes.includes(index);

            return (
              <div
                key={index}
                style={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "20px 22px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      fontSize: "clamp(16px, 2vw, 20px)",
                      fontWeight: 700,
                      color: "#111",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.question}
                  </span>

                  <span
                    style={{
                      fontSize: "22px",
                      fontWeight: 400,
                      color: "#111",
                      marginLeft: "16px",
                      flexShrink: 0,
                      lineHeight: 1,
                    }}
                  >
                    {isOpen ? "⌃" : "›"}
                  </span>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: "0 22px 22px",
                      fontSize: "15px",
                      lineHeight: 1.8,
                      color: "#555",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}