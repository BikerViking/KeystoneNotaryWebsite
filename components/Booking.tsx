import React from 'react';
import Section from './Section';
import AnimatedOnView from './AnimatedOnView';

const Booking: React.FC = () => {
  // Mock data for a calendar display. This is purely for visual representation.
  const monthName = "October 2025";
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  // A sample month grid. 1-31, with empty slots for padding.
  const daysInMonth = [
    ...Array(3).fill(null), // Wednesday is the 1st
    ...Array.from({ length: 31 }, (_, i) => i + 1),
    ...Array(1).fill(null),
  ];

  return (
    <Section id="booking" className="py-24 sm:py-32" debugName="Booking">
      <div className="container mx-auto px-6">
        <AnimatedOnView>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white font-serif">Book an Appointment</h2>
            <p className="mt-4 text-lg leading-8 text-neutral-300 max-w-3xl mx-auto">
              Find a time that works for you. Our online booking system is coming soon!
            </p>
          </div>
        </AnimatedOnView>

        <AnimatedOnView delay="200ms">
          <div className="mt-20 max-w-2xl mx-auto p-8 bg-zinc-900 rounded-2xl border border-zinc-800 relative">
            {/* Overlay to indicate non-functionality */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
              <div className="text-center p-4">
                <h3 className="text-2xl font-bold text-white">Coming Soon!</h3>
                <p className="text-neutral-300 mt-2">
                  This feature is currently under construction.
                  <br />
                  Please <a href="#contact" className="underline hover:text-white">contact us</a> directly to schedule.
                </p>
              </div>
            </div>

            {/* The Calendar UI (visually present but disabled) */}
            <div className="opacity-30">
              <div className="flex items-center justify-between mb-6">
                <button type="button" className="p-2 rounded-full hover:bg-zinc-700 transition-colors" aria-label="Previous month">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h3 className="text-xl font-semibold text-white">{monthName}</h3>
                <button type="button" className="p-2 rounded-full hover:bg-zinc-700 transition-colors" aria-label="Next month">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center">
                {daysOfWeek.map(day => (
                  <div key={day} className="text-xs font-bold text-neutral-400 uppercase">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2 mt-4">
                {daysInMonth.map((day, index) => (
                  <div key={index} className={`p-2 rounded-md h-12 flex items-center justify-center ${day ? 'bg-zinc-800' : ''}`}>
                    {day && <span className="text-white">{day}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedOnView>
      </div>
    </Section>
  );
};

export default Booking;
