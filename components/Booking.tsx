import React, { useState } from 'react';
import Section from './Section';
import AnimatedOnView from './AnimatedOnView';

// --- Mock Data ---
const services = [
  'Loan Signing',
  'General Notary Work',
  'Apostille Service',
  'Other'
];
const monthName = "October 2025";
const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
const daysInMonth = [...Array(3).fill(null), ...Array.from({ length: 31 }, (_, i) => i + 1), ...Array(1).fill(null)];
const timeSlots = ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"];

// --- Main Component ---
const Booking: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string | null>(services[0]);
  const [selectedDay, setSelectedDay] = useState<number | null>(15);

  return (
    <Section id="booking" className="py-32 md:py-48" debugName="Booking">
      <div className="container mx-auto px-6">
        <AnimatedOnView>
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white font-serif">Book an Appointment</h2>
            <p className="mt-4 text-lg leading-8 text-neutral-400 max-w-3xl mx-auto">
              Note: Online booking is in development and will be available soon. For now, please <a href="#contact" className="underline hover:text-gold">contact us</a> to schedule.
            </p>
          </div>
        </AnimatedOnView>

        <AnimatedOnView delay="200ms">
          <div className="mt-20 max-w-4xl mx-auto p-8 bg-zinc-900/50 rounded-2xl border border-zinc-800 grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Left Column: Steps & Calendar */}
            <div className="border-r-0 lg:border-r lg:border-zinc-800 lg:pr-8">
              {/* Step 1: Service Selection */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4"><span className="text-gold">Step 1:</span> Select a Service</h3>
                <div className="grid grid-cols-2 gap-3">
                  {services.map(service => (
                    <button key={service} onClick={() => setSelectedService(service)} className={`p-3 text-sm rounded-md transition-colors ${selectedService === service ? 'bg-gold text-black font-semibold' : 'bg-zinc-800 hover:bg-zinc-700 text-white'}`}>
                      {service}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Date Selection */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-white mb-4"><span className="text-gold">Step 2:</span> Select a Date</h3>
                {/* Calendar UI */}
                <div className="p-4 bg-zinc-900 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <button type="button" className="p-2 rounded-full hover:bg-zinc-700 transition-colors" aria-label="Previous month">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h4 className="text-md font-semibold text-white">{monthName}</h4>
                    <button type="button" className="p-2 rounded-full hover:bg-zinc-700 transition-colors" aria-label="Next month">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {daysOfWeek.map(day => <div key={day} className="text-xs font-bold text-neutral-500">{day}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1 mt-2">
                    {daysInMonth.map((day, index) => (
                      <button key={index} onClick={() => day && setSelectedDay(day)} disabled={!day} className={`p-2 rounded-md h-9 w-9 flex items-center justify-center text-sm transition-colors disabled:opacity-30 ${day ? 'hover:bg-zinc-700' : ''} ${selectedDay === day ? 'bg-gold text-black font-semibold' : 'text-white'}`}>
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Time & Confirmation */}
            <div>
              {/* Step 3: Time Selection */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4"><span className="text-gold">Step 3:</span> Select a Time</h3>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map(time => (
                    <button key={time} disabled className="p-3 text-sm rounded-md bg-zinc-800 text-white disabled:opacity-30">
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Confirmation */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-white mb-4"><span className="text-gold">Step 4:</span> Confirm</h3>
                <div className="p-4 bg-zinc-900 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-neutral-400">Service:</span> <span className="font-semibold text-white">{selectedService}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-400">Date:</span> <span className="font-semibold text-white">October {selectedDay}, 2025</span></div>
                </div>
                <button disabled className="w-full mt-6 rounded-full bg-gold px-8 py-4 text-base font-semibold text-black shadow-sm disabled:opacity-30">
                  Confirm Appointment
                </button>
              </div>
            </div>

          </div>
        </AnimatedOnView>
      </div>
    </Section>
  );
};

export default Booking;
