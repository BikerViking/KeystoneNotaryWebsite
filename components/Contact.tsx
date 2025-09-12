import React, { useMemo, useState } from 'react';
import AnimatedOnView from './AnimatedOnView';
import Section from './Section';

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

const Contact: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle'|'success'|'error'>('idle');

  const services = useMemo(() => [
    'Loan Signings',
    'General Notary Work',
    'Apostille Services',
    'I-9 Employment Verification',
    'Vehicle Title Transfers',
  ], []);

  const setField = <K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: val }));
    // Inline error clearing for better UX and testability
    setErrors((prev) => {
      const next = { ...prev };
      if (key === 'name' && typeof val === 'string') {
        if (val.trim()) delete next.name; else next.name = 'Please enter your full name.';
      }
      if (key === 'email' && typeof val === 'string') {
        if (val.trim() && emailRe.test(val)) delete next.email; else next.email = 'Please enter a valid email address.';
      }
      if (key === 'message' && typeof val === 'string') {
        if (val.trim()) delete next.message; else next.message = 'Please enter a brief description of your request.';
      }
      if (key === 'consent' && typeof val === 'boolean') {
        if (val) delete next.consent; else next.consent = 'Please consent to be contacted.';
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
    // honeypot
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
      const payload = {
        ...form,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      };
      if (endpoint) {
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      } else {
        // Fallback: open mailto draft
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
        const href = `mailto:contact@keystonenotary.llc?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
    <Section id="contact" className="bg-black" debugName="contact">
      <div className="max-w-4xl mx-auto" data-debug="contact-wrap">
        {/* Heading + accent hairline */}
        <AnimatedOnView>
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Schedule a Notary Appointment
            </h2>
            <img src="/assets/nna-seal.png" alt="NNA Certified Notary Signing Agent" className="hidden sm:block h-8 w-8 md:h-10 md:w-10 opacity-90" onError={(e)=>{(e.currentTarget.style.display='none')}} />
          </div>
          <div className="mt-3 h-px bg-zinc-800" />
        </AnimatedOnView>
        <AnimatedOnView delay="60ms">
          <p className="text-lg text-neutral-400 max-w-[65ch]">
            A certified notary will respond promptly. For urgent needs, call us or include your preferred time in the request.
          </p>
        </AnimatedOnView>

        {/* Trust row */}
        <AnimatedOnView delay="100ms">
          <ul className="mt-5 flex flex-wrap gap-2 text-xs md:text-sm text-neutral-400" data-debug="contact-trust">
            <li className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/40 px-3 py-1">NNA Certified</li>
            <li className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/40 px-3 py-1">E&O $100k</li>
            <li className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/40 px-3 py-1">Background Checked</li>
            <li className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/40 px-3 py-1">Same‑Day Appointments</li>
          </ul>
        </AnimatedOnView>

        {/* Primary quick CTA row */}
        <AnimatedOnView delay="130ms">
          <div className="mt-6 flex flex-wrap items-center gap-3" data-debug="contact-quick-cta">
            <a href="tel:+15551234567" className="inline-flex items-center gap-2 rounded-full bg-neutral-300 text-black font-semibold px-4 py-2 hover:bg-white transition-colors">
              <span className="live-indicator" aria-hidden />
              Call (555) 123‑4567
            </a>
            <a href="mailto:contact@keystonenotary.llc" className="text-neutral-400 hover:text-white transition-colors">
              or email contact@keystonenotary.llc
            </a>
          </div>
        </AnimatedOnView>

        {/* Form card with gradient edge */}
        <AnimatedOnView delay="170ms">
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-neutral-700/0 via-neutral-300/25 to-neutral-700/0">
            {/* Decorative NNA seal watermark (hidden if missing) */}
            <img
              src="/assets/nna-seal.png"
              alt=""
              aria-hidden
              className="pointer-events-none select-none opacity-10 absolute -bottom-4 -right-4 h-20 w-20"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <form onSubmit={onSubmit} noValidate className="relative rounded-2xl bg-zinc-900/80 border border-zinc-800 p-6 md:p-8 space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)]" data-debug="contact-form">
            {/* Honeypot */}
            <input type="text" name="company" autoComplete="off" tabIndex={-1} value={form.company} onChange={(e) => setField('company', e.target.value)} className="hidden" aria-hidden="true" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm text-neutral-300 mb-1">Full Name</label>
                  <input
                    id="name" name="name" value={form.name} onChange={(e) => setField('name', e.target.value)}
                    className={`w-full rounded-lg bg-black border ${errors.name ? 'border-rose-500' : 'border-zinc-800'} px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300`}
                    placeholder="Jane Doe" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-err' : undefined}
                  />
                  {errors.name && <p id="name-err" className="mt-1 text-sm text-rose-400">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-neutral-300 mb-1">Email</label>
                  <input
                    id="email" name="email" type="email" value={form.email} onChange={(e) => setField('email', e.target.value)}
                    className={`w-full rounded-lg bg-black border ${errors.email ? 'border-rose-500' : 'border-zinc-800'} px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300`}
                    placeholder="jane@example.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-err' : undefined}
                  />
                  {errors.email && <p id="email-err" className="mt-1 text-sm text-rose-400">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm text-neutral-300 mb-1">Phone (optional)</label>
                  <input id="phone" name="phone" value={form.phone} onChange={(e) => setField('phone', e.target.value)} className="w-full rounded-lg bg-black border border-zinc-800 px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300" placeholder="(555) 123-4567" />
                </div>
                <div>
                  <label htmlFor="service" className="block text-sm text-neutral-300 mb-1">Service</label>
                  <select id="service" name="service" value={form.service} onChange={(e) => setField('service', e.target.value)} className="w-full rounded-lg bg-black border border-zinc-800 px-3 py-2 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300">
                    <option value="">Select a service (optional)</option>
                    {services.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="datetime" className="block text-sm text-neutral-300 mb-1">Preferred Date/Time (optional)</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                  {['Today PM', 'Tomorrow AM', 'This Week'].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setField('datetime', chip)}
                      className="rounded-full border border-zinc-800 bg-black px-3 py-1 text-sm text-neutral-300 hover:text-white hover:border-neutral-500 transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
                <input id="datetime" name="datetime" type="text" value={form.datetime} onChange={(e) => setField('datetime', e.target.value)} className="w-full rounded-lg bg-black border border-zinc-800 px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300" placeholder="e.g., Tomorrow after 2pm" />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm text-neutral-300 mb-1">How can we help?</label>
                <textarea id="message" name="message" value={form.message} onChange={(e) => setField('message', e.target.value)} rows={5} className={`w-full rounded-lg bg-black border ${errors.message ? 'border-rose-500' : 'border-zinc-800'} px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300`} placeholder="Briefly describe your request" aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-err' : undefined} />
                {errors.message && <p id="message-err" className="mt-1 text-sm text-rose-400">{errors.message}</p>}
              </div>

              <div className="flex items-start gap-3">
                <input id="consent" name="consent" type="checkbox" checked={form.consent} onChange={(e) => setField('consent', e.target.checked)} className="mt-1 h-4 w-4 rounded border-zinc-700 bg-black" aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'consent-err' : undefined} />
                <label htmlFor="consent" className="text-sm text-neutral-300">I consent to be contacted about my inquiry.</label>
              </div>
              {errors.consent && <p id="consent-err" className="-mt-2 text-sm text-rose-400">{errors.consent}</p>}

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button type="submit" disabled={submitting} className="bg-neutral-300 text-black font-bold py-2 px-6 rounded-full hover:bg-white transition-all duration-300 disabled:opacity-60" aria-busy={submitting}>
                  {submitting ? 'Sending…' : 'Send Request'}
                </button>
                <span className="text-neutral-500 text-sm">We respect your privacy. Your information is confidential.</span>
              </div>

              {status === 'success' && (
                <p role="status" className="text-sm text-emerald-400">Thanks! Your message has been prepared. We’ll be in touch soon.</p>
              )}
              {status === 'error' && (
                <p role="alert" className="text-sm text-rose-400">Sorry, something went wrong. Please try again later or email us directly.</p>
              )}
            </form>
          </div>
        </AnimatedOnView>

        {/* Secondary contact row at bottom */}
        <AnimatedOnView delay="220ms">
          <div className="mt-8 flex flex-wrap items-center gap-4 text-neutral-400" data-debug="contact-secondary">
            <div className="inline-flex items-center gap-2">
              <span className="live-indicator" aria-hidden />
              <span>Mon–Fri, 9am–5pm</span>
            </div>
            <a href="tel:+15551234567" className="hover:text-white transition-colors">(555) 123‑4567</a>
            <a href="mailto:contact@keystonenotary.llc" className="hover:text-white transition-colors">contact@keystonenotary.llc</a>
          </div>
        </AnimatedOnView>
      </div>
    </Section>
  );
};

export default Contact;
