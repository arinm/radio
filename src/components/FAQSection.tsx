'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FAQItem } from '@/types';

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
}

export function FAQSection({ faqs, title = 'Intrebari frecvente' }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="mx-auto max-w-3xl">
      <h2 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h2>
      <div className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
        {faqs.map((faq, index) => (
          <div key={index}>
            <button
              onClick={() => toggle(index)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted/50 sm:text-base"
              aria-expanded={openIndex === index}
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
                  openIndex === index && 'rotate-180',
                )}
              />
            </button>
            <div
              className={cn(
                'grid transition-all duration-200',
                openIndex === index ? 'grid-rows-[1fr] pb-4' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
