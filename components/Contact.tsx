import React, { useMemo, useState } from 'react';
import AnimatedOnView from './AnimatedOnView';
import Section from './Section';

// --- Form State & Validation ---
type FormState = {
  name: string;
  email: string;
  phone: string;
  service: string;
  datetime: string;
  message: string;
  consent: boolean;
  company: string; // honeypot
};

const initialState: FormState = {
  name: '',
  email: '',
  phone: '',
  service: '',
  datetime: '',
  message: '',
  consent: false,
  company: '',
};

const emailRe = /.+@.+\..+/i;

// --- Content ---
const content = {
  headline: "Ready to Get Started?",
  subheading: "We are mobile notaries and NNA certified signing agents based in Hellertown, PA. Reach out to us for any inquiries or to schedule an appointment.",
  contactDetails: {
    email: "info@keystonenotarygroup.com",
    phone: "(267) 309-9000",
    hours: "Mon-Fri, 9am - 5pm",
    address: "Hellertown, Pennsylvania"
  },
};

const services = [
  'Loan Signings',
  'General Notary Work',
  'Apostille Services',
  'I-9 Employment Verification',
  'Vehicle Title Transfers',
];

// --- Main Component ---
const Contact: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle'|'success'|'error'>('idle');

  const setField = <K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((prev) => {
      const next = { ...prev };
      if (key === 'name' && typeof val === 'string') {
        if (val.trim()) delete next.name;
      }
      if (key === 'email' && typeof val === 'string') {
        if (val.trim() && emailRe.test(val)) delete next.email;
      }
      if (key === 'message' && typeof val === 'string') {
        if (val.trim()) delete next.message;
      }
      if (key === 'consent' && typeof val === 'boolean') {
        if (val) delete next.consent;
      }
      return next;
    });
  };

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Please enter your full name.';
    if (!form.email.trim() || !emailRe.test(form.email)) e.email = 'Please enter a valid email address.';
    if (!form.message.trim()) e.message = 'Please enter a brief description of your request.';
    if (!form.consent) e.consent = 'Please consent to be contacted.';
    if (form.company.trim()) e.company = 'Spam detected.';
    return e;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    try {
      const endpoint = (import.meta as any).env?.VITE_CONTACT_ENDPOINT as string | undefined;
      const payload = { ...form, timestamp: new Date().toISOString() };

      if (endpoint) {
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      } else {
        const body = [
          `Name: ${form.name}`,
          `Email: ${form.email}`,
          form.phone ? `Phone: ${form.phone}` : undefined,
          form.service ? `Service: ${form.service}` : undefined,
          form.datetime ? `Preferred: ${form.datetime}` : undefined,
          '',
          form.message,
        ].filter(Boolean).join('\n');
        const subject = `Contact Request: ${form.service || 'Inquiry'} - ${form.name}`;
        const href = `mailto:${content.contactDetails.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = href;
      }
      setStatus('success');
      setForm(initialState);
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section id="contact" className="bg-black py-24 sm:py-32" debugName="contact">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-2">
          {/* Left Column: Info */}
          <AnimatedOnView className="lg:max-w-lg">
            <h2 className="text-4xl md:text-5xl font-bold text-white font-serif">{content.headline}</h2>
            <p className="mt-4 text-lg leading-8 text-neutral-300">{content.subheading}</p>
            <div className="mt-10 space-y-6 text-base leading-7 text-neutral-300">
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Telephone</span>
                  {/* Heroicon: phone */}
                  <svg className="h-7 w-6 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" /></svg>
                </dt>
                <dd><a className="hover:text-white" href={`tel:${content.contactDetails.phone}`}>{content.contactDetails.phone}</a></dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Email</span>
                  {/* Heroicon: envelope */}
                  <svg className="h-7 w-6 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                </dt>
                <dd><a className="hover:text-white" href={`mailto:${content.contactDetails.email}`}>{content.contactDetails.email}</a></dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Hours</span>
                  {/* Heroicon: clock */}
                  <svg className="h-7 w-6 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </dt>
                <dd>{content.contactDetails.hours}</dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Address</span>
                  {/* Heroicon: map-pin */}
                  <svg className="h-7 w-6 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                </dt>
                <dd>{content.contactDetails.address}</dd>
              </div>
            </div>
          </AnimatedOnView>

          {/* Right Column: Form */}
          <AnimatedOnView delay="200ms" className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
            <form onSubmit={onSubmit} noValidate className="space-y-6">
              {/* Honeypot */}
              <input type="text" name="company" autoComplete="off" tabIndex={-1} value={form.company} onChange={(e) => setField('company', e.target.value)} className="hidden" aria-hidden="true" />

              <div>
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-neutral-300">Full Name</label>
                <div className="mt-2">
                  <input type="text" id="name" name="name" value={form.name} onChange={(e) => setField('name', e.target.value)} required
                    className={`w-full rounded-md bg-black/20 border-0 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ${errors.name ? 'ring-rose-500' : 'ring-zinc-700'} placeholder:text-neutral-500 focus:ring-2 focus:ring-inset focus:ring-neutral-300 sm:text-sm sm:leading-6`}
                  />
                  {errors.name && <p id="name-err" className="mt-2 text-sm text-rose-400">{errors.name}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-neutral-300">Email</label>
                <div className="mt-2">
                  <input type="email" id="email" name="email" value={form.email} onChange={(e) => setField('email', e.target.value)} required
                    className={`w-full rounded-md bg-black/20 border-0 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ${errors.email ? 'ring-rose-500' : 'ring-zinc-700'} placeholder:text-neutral-500 focus:ring-2 focus:ring-inset focus:ring-neutral-300 sm:text-sm sm:leading-6`}
                  />
                  {errors.email && <p id="email-err" className="mt-2 text-sm text-rose-400">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium leading-6 text-neutral-300">Phone <span className="text-neutral-500">(optional)</span></label>
                <div className="mt-2">
                  <input type="tel" id="phone" name="phone" value={form.phone} onChange={(e) => setField('phone', e.target.value)}
                    className="w-full rounded-md bg-black/20 border-0 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-neutral-500 focus:ring-2 focus:ring-inset focus:ring-neutral-300 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium leading-6 text-neutral-300">How can we help?</label>
                <div className="mt-2">
                  <textarea id="message" name="message" value={form.message} onChange={(e) => setField('message', e.target.value)} rows={4} required
                    className={`w-full rounded-md bg-black/20 border-0 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ${errors.message ? 'ring-rose-500' : 'ring-zinc-700'} placeholder:text-neutral-500 focus:ring-2 focus:ring-inset focus:ring-neutral-300 sm:text-sm sm:leading-6`}
                  ></textarea>
                  {errors.message && <p id="message-err" className="mt-2 text-sm text-rose-400">{errors.message}</p>}
                </div>
              </div>

              <div className="flex items-start gap-x-3">
                <input id="consent" name="consent" type="checkbox" checked={form.consent} onChange={(e) => setField('consent', e.target.checked)} required
                  className={`h-4 w-4 mt-1 rounded border-zinc-700 bg-black/20 text-neutral-300 focus:ring-neutral-300 ${errors.consent ? 'ring-rose-500' : 'ring-zinc-700'}`}
                />
                <label htmlFor="consent" className="text-sm leading-6 text-neutral-400">
                  I consent to be contacted about my inquiry.
                </label>
              </div>
              {errors.consent && <p id="consent-err" className="-mt-4 text-sm text-rose-400">{errors.consent}</p>}

              <div>
                <button type="submit" disabled={submitting}
                  className="w-full rounded-full bg-neutral-100 px-6 py-3 text-base font-semibold text-black shadow-sm hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-100 disabled:opacity-60"
                >
                  {submitting ? 'Sending…' : 'Send Request'}
                </button>
              </div>

              {status === 'success' && (
                <p role="status" className="text-sm text-emerald-400">Thanks! Your message has been prepared. We’ll be in touch soon.</p>
              )}
              {status === 'error' && (
                <p role="alert" className="text-sm text-rose-400">Sorry, something went wrong. Please try again later or email us directly.</p>
              )}
            </form>
          </AnimatedOnView>
        </div>
      </div>
    </Section>
  );
};

export default Contact;
