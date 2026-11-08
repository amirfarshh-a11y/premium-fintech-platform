import { useState } from 'react';
import { ArrowRight, Clock3, Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../context/ToastContext';

type Errors = Partial<Record<'name' | 'email' | 'subject' | 'message', string>>;

const initialForm = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const toast = useToast();

  const update = (key: keyof typeof initialForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) next.email = 'Enter a valid email address.';
    if (form.subject.trim().length < 3) next.subject = 'Add a short subject.';
    if (form.message.trim().length < 20) next.message = 'Please add at least 20 characters of detail.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const response = await api<{ message: string }>('/contact', { method: 'POST', body: form });
      setSent(response.message);
      setForm(initialForm);
      toast.success(response.message, 'Message sent');
    } catch (error) {
      toast.error((error as Error).message || 'We could not send your message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <header className="page-head">
        <div className="page-head__bg" aria-hidden />
        <div className="container page-head__inner">
          <span className="eyebrow">Contact us</span>
          <h1 className="h1">
            Talk to the <span className="serif-italic gold-text">desk</span>
          </h1>
          <p className="lede">
            Questions about the platform, our research or a data issue? Send a note and the client team will respond
            within one business day.
          </p>
        </div>
      </header>

      <section className="section section--tight">
        <div className="container">
          <div className="contact-grid">
            <div className="card card--pad">
              {sent ? (
                <div className="state" style={{ borderStyle: 'solid', borderColor: 'rgba(56,211,159,0.32)' }}>
                  <span className="state__icon" style={{ color: 'var(--pos)', borderColor: 'rgba(56,211,159,0.32)', background: 'var(--pos-soft)' }}>
                    <MessageSquare size={20} />
                  </span>
                  <p className="state__title">Message received</p>
                  <p className="state__body">{sent}</p>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => setSent(null)}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form className="stack stack-16" onSubmit={onSubmit} noValidate>
                  <div className="form-grid">
                    <div className="field">
                      <label className="field__label" htmlFor="contact-name">Full name</label>
                      <input
                        id="contact-name"
                        className="input"
                        value={form.name}
                        onChange={(event) => update('name', event.target.value)}
                        aria-invalid={Boolean(errors.name)}
                        placeholder="Your name"
                        autoComplete="name"
                      />
                      {errors.name && <span className="field__error">{errors.name}</span>}
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="contact-email">Email</label>
                      <input
                        id="contact-email"
                        type="email"
                        className="input"
                        value={form.email}
                        onChange={(event) => update('email', event.target.value)}
                        aria-invalid={Boolean(errors.email)}
                        placeholder="you@company.com"
                        autoComplete="email"
                      />
                      {errors.email && <span className="field__error">{errors.email}</span>}
                    </div>
                    <div className="field span-2">
                      <label className="field__label" htmlFor="contact-subject">Subject</label>
                      <input
                        id="contact-subject"
                        className="input"
                        value={form.subject}
                        onChange={(event) => update('subject', event.target.value)}
                        aria-invalid={Boolean(errors.subject)}
                        placeholder="Platform question, research enquiry, data issue…"
                      />
                      {errors.subject && <span className="field__error">{errors.subject}</span>}
                    </div>
                    <div className="field span-2">
                      <label className="field__label" htmlFor="contact-message">Message</label>
                      <textarea
                        id="contact-message"
                        className="textarea"
                        value={form.message}
                        onChange={(event) => update('message', event.target.value)}
                        aria-invalid={Boolean(errors.message)}
                        placeholder="Tell us what you need help with…"
                      />
                      {errors.message ? (
                        <span className="field__error">{errors.message}</span>
                      ) : (
                        <span className="field__hint">{form.message.trim().length}/4000 characters</span>
                      )}
                    </div>
                  </div>

                  <div className="row row--between row--wrap">
                    <span className="field__hint">We never share your details with third parties.</span>
                    <button type="submit" className="btn btn--gold" disabled={submitting}>
                      {submitting ? 'Sending…' : 'Send message'} <ArrowRight size={15} className="btn__icon" />
                    </button>
                  </div>
                </form>
              )}
            </div>

            <aside className="stack stack-16">
              <div className="card card--pad contact-info">
                <div className="contact-info__row">
                  <Mail size={17} />
                  <div className="stack stack-4">
                    <strong style={{ fontSize: '0.88rem' }}>Client desk</strong>
                    <a href="mailto:desk@aurum.markets" className="footer__link">desk@aurum.markets</a>
                  </div>
                </div>
                <div className="contact-info__row">
                  <Phone size={17} />
                  <div className="stack stack-4">
                    <strong style={{ fontSize: '0.88rem' }}>London</strong>
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>+44 20 7946 0812</span>
                  </div>
                </div>
                <div className="contact-info__row">
                  <MapPin size={17} />
                  <div className="stack stack-4">
                    <strong style={{ fontSize: '0.88rem' }}>Office</strong>
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                      One Canada Square, Canary Wharf, London E14
                    </span>
                  </div>
                </div>
                <div className="contact-info__row">
                  <Clock3 size={17} />
                  <div className="stack stack-4">
                    <strong style={{ fontSize: '0.88rem' }}>Response time</strong>
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                      Within one business day, 09:00–18:00 GMT
                    </span>
                  </div>
                </div>
              </div>

              <div className="side-card">
                <span className="side-card__title">Data issues</span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  If a price or chart looks wrong, include the asset and the timestamp shown on the card — it maps
                  directly to the source record.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
