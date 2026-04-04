import { useState } from 'react';
import { X, CreditCard, Phone, Check, Copy, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { generateTrackingCode } from '../lib/constants';

const METHODS = [
  {
    id: 'fawry',
    label: 'Fawry',
    emoji: '🏪',
    desc: 'Pay at any Fawry outlet — 170,000+ locations across Egypt',
    color: 'border-orange-400 bg-orange-50',
    badge: 'bg-orange-500',
  },
  {
    id: 'vodafone_cash',
    label: 'Vodafone Cash',
    emoji: '📱',
    desc: 'Mobile wallet — instant transfer via Vodafone',
    color: 'border-red-400 bg-red-50',
    badge: 'bg-red-600',
  },
  {
    id: 'orange_money',
    label: 'Orange Money',
    emoji: '🟠',
    desc: 'Mobile wallet — instant transfer via Orange Egypt',
    color: 'border-orange-500 bg-orange-50',
    badge: 'bg-orange-600',
  },
  {
    id: 'card',
    label: 'Visa / Mastercard',
    emoji: '💳',
    desc: 'Secure card payment — Visa, Mastercard, Meeza accepted',
    color: 'border-blue-400 bg-blue-50',
    badge: 'bg-blue-600',
  },
];

const PAYMENT_INSTRUCTIONS = {
  fawry: {
    title: 'Pay via Fawry',
    steps: [
      'Go to any Fawry outlet (pharmacy, grocery, post office)',
      'Tell the cashier: "Fawry e-payment"',
      'Give them your Reference Code below',
      'Pay the exact amount in cash',
      'Keep your Fawry receipt — it\'s your proof of payment',
      'WhatsApp us the receipt to confirm your booking instantly',
    ],
    note: 'Fawry outlets are open 24/7. No account needed.',
  },
  vodafone_cash: {
    title: 'Pay via Vodafone Cash',
    steps: [
      'Open Vodafone Cash app on your phone',
      'Tap "Send Money" → "Mobile Number"',
      'Enter our number: 010-XXXX-XXXX',
      'Enter exact amount in EGP',
      'Use your Tracking Code as the transfer reference',
      'Screenshot the confirmation and WhatsApp it to us',
    ],
    note: 'Transfer is instant. Confirmation usually within 5 minutes.',
  },
  orange_money: {
    title: 'Pay via Orange Money',
    steps: [
      'Open Orange Money app or dial *888#',
      'Select "Transfer Money" → "Send to Number"',
      'Enter our number: 012-XXXX-XXXX',
      'Enter exact amount in EGP',
      'Use your Tracking Code as transfer note',
      'Screenshot the confirmation and WhatsApp it to us',
    ],
    note: 'Transfer is instant. Confirmation usually within 5 minutes.',
  },
  card: {
    title: 'Pay via Card',
    steps: [
      'Your card details are processed securely (256-bit SSL)',
      'Accepted: Visa, Mastercard, Meeza, Amex',
      'No card data is stored on our servers',
      'You\'ll receive a confirmation email after payment',
      'Your booking is confirmed instantly on success',
    ],
    note: 'Card payments processed via Fawry secure gateway (PCI DSS Level 1).',
  },
};

// Simulated card form
function CardForm({ onPay, loading }) {
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });

  const formatCard = (v) => v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  const formatExpiry = (v) => v.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').slice(0, 5);

  return (
    <div className="space-y-3 mt-4">
      <div>
        <label className="text-xs font-bold text-muted-foreground mb-1 block">Card Number</label>
        <input
          className="w-full border border-border rounded-xl px-3 py-2.5 text-sm font-mono bg-background focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="4111 1111 1111 1111"
          value={card.number}
          onChange={e => setCard(p => ({ ...p, number: formatCard(e.target.value) }))}
          maxLength={19}
        />
      </div>
      <div>
        <label className="text-xs font-bold text-muted-foreground mb-1 block">Cardholder Name</label>
        <input
          className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Name as on card"
          value={card.name}
          onChange={e => setCard(p => ({ ...p, name: e.target.value }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-muted-foreground mb-1 block">Expiry</label>
          <input
            className="w-full border border-border rounded-xl px-3 py-2.5 text-sm font-mono bg-background focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="MM/YY"
            value={card.expiry}
            onChange={e => setCard(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
            maxLength={5}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-muted-foreground mb-1 block">CVV</label>
          <input
            type="password"
            className="w-full border border-border rounded-xl px-3 py-2.5 text-sm font-mono bg-background focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="•••"
            value={card.cvv}
            onChange={e => setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
            maxLength={4}
          />
        </div>
      </div>
      <button
        onClick={onPay}
        disabled={loading || !card.number || !card.name || !card.expiry || !card.cvv}
        className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 transition-opacity"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
        {loading ? 'Processing...' : 'Pay Now Securely'}
      </button>
      <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
        <ShieldCheck className="w-3 h-3 text-success" />
        256-bit SSL · PCI DSS · No card data stored
      </div>
    </div>
  );
}

export default function PaymentModal({ tour, trackingCode, onClose }) {
  const [method, setMethod] = useState(null);
  const [stage, setStage] = useState('select'); // select | instructions | processing | success | failed
  const [copied, setCopied] = useState(false);

  const commission = Math.round(tour.price_egp * 0.07);
  const refCode = `FWY-${trackingCode.slice(-8)}`;

  const copyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulatePay = () => {
    setStage('processing');
    setTimeout(() => {
      // 90% success rate simulation
      setStage(Math.random() > 0.1 ? 'success' : 'failed');
    }, 2200);
  };

  const whatsappConfirm = () => {
    const msg = encodeURIComponent(
      `✅ Payment sent — Locali Egypt\nTracking Code: ${trackingCode}\nService: ${tour.name}\nAmount: ${tour.price_egp} EGP\nPayment Method: ${method}\nRef: ${refCode}`
    );
    window.open(`https://wa.me/201001234567?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-background rounded-t-3xl md:rounded-3xl w-full md:max-w-md max-h-[92vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border/30 px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-base">Book & Pay</h2>
            <p className="text-xs text-muted-foreground truncate max-w-[220px]">{tour.name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-5">
          {/* Price summary */}
          <div className="bg-secondary/60 rounded-2xl p-4 mb-5">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Service price</span>
              <span className="font-bold">{tour.price_egp} EGP</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Platform fee (7%)</span>
              <span className="font-bold text-accent">{commission} EGP</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>≈ USD equivalent</span>
              <span>~${tour.price_usd}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-extrabold">
              <span>Total</span>
              <span className="text-accent">{tour.price_egp} EGP</span>
            </div>
          </div>

          {/* Tracking code */}
          <div className="bg-accent/5 border border-accent/20 rounded-xl px-4 py-3 mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-accent uppercase tracking-wider">Tracking Code</p>
              <p className="font-mono font-bold text-sm">{trackingCode}</p>
            </div>
            <button onClick={() => copyCode(trackingCode)} className="p-1.5 rounded-lg hover:bg-accent/10">
              {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
            </button>
          </div>

          {/* STAGE: select method */}
          {stage === 'select' && (
            <>
              <h3 className="font-extrabold text-sm mb-3">Choose Payment Method</h3>
              <div className="space-y-2 mb-4">
                {METHODS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => { setMethod(m.id); setStage('instructions'); }}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left ${method === m.id ? m.color : 'border-border bg-card'} hover:border-accent/40`}
                  >
                    <span className="text-2xl">{m.emoji}</span>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${m.badge}`} />
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-center text-muted-foreground">
                🔒 Secure · Encrypted · No hidden fees
              </p>
            </>
          )}

          {/* STAGE: instructions */}
          {stage === 'instructions' && method && (
            <>
              <button onClick={() => setStage('select')} className="text-xs text-accent font-bold mb-4 flex items-center gap-1">
                ← Change method
              </button>
              <h3 className="font-extrabold text-sm mb-3">{PAYMENT_INSTRUCTIONS[method].title}</h3>

              {method !== 'card' ? (
                <>
                  {/* Reference code for Fawry */}
                  {method === 'fawry' && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-orange-600 uppercase">Fawry Reference</p>
                        <p className="font-mono font-bold">{refCode}</p>
                      </div>
                      <button onClick={() => copyCode(refCode)} className="p-1.5 rounded-lg hover:bg-orange-100">
                        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-orange-600" />}
                      </button>
                    </div>
                  )}

                  <ol className="space-y-2 mb-4">
                    {PAYMENT_INSTRUCTIONS[method].steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className="w-5 h-5 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                        <span className="text-muted-foreground leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700">{PAYMENT_INSTRUCTIONS[method].note}</p>
                  </div>

                  <button
                    onClick={whatsappConfirm}
                    className="w-full py-3 rounded-xl bg-success text-success-foreground font-bold text-sm flex items-center justify-center gap-2 mb-2 hover:opacity-90"
                  >
                    <Phone className="w-4 h-4" />
                    Send Payment Confirmation on WhatsApp
                  </button>
                  <button onClick={simulatePay} className="w-full py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition-colors">
                    I've paid — Confirm Booking
                  </button>
                </>
              ) : (
                <CardForm onPay={simulatePay} loading={false} />
              )}
            </>
          )}

          {/* STAGE: processing */}
          {stage === 'processing' && (
            <div className="py-12 flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-accent animate-spin" />
              <p className="font-bold">Processing payment...</p>
              <p className="text-xs text-muted-foreground text-center">Please do not close this window</p>
            </div>
          )}

          {/* STAGE: success */}
          {stage === 'success' && (
            <div className="py-8 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                <Check className="w-8 h-8 text-success" />
              </div>
              <div>
                <p className="font-extrabold text-lg text-success">Payment Successful ✅</p>
                <p className="text-sm text-muted-foreground mt-1">Your booking is confirmed!</p>
              </div>
              <div className="bg-secondary/60 rounded-2xl p-4 w-full text-left">
                <p className="text-xs text-muted-foreground mb-1">Tracking Code</p>
                <p className="font-mono font-bold text-sm">{trackingCode}</p>
                <p className="text-xs text-muted-foreground mt-2 mb-1">Service</p>
                <p className="text-sm font-semibold">{tour.name}</p>
                <p className="text-xs text-muted-foreground mt-2 mb-1">Amount Paid</p>
                <p className="font-bold text-accent">{tour.price_egp} EGP</p>
              </div>
              <p className="text-xs text-muted-foreground">A confirmation has been sent. Save your tracking code — you'll need it to verify your booking with the operator.</p>
              <button onClick={onClose} className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-bold text-sm">
                Done
              </button>
            </div>
          )}

          {/* STAGE: failed */}
          {stage === 'failed' && (
            <div className="py-8 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <X className="w-8 h-8 text-destructive" />
              </div>
              <div>
                <p className="font-extrabold text-lg text-destructive">Payment Failed ❌</p>
                <p className="text-sm text-muted-foreground mt-1">Please try a different method.</p>
              </div>
              <button onClick={() => setStage('select')} className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-bold text-sm">
                Try Another Method
              </button>
              <button onClick={onClose} className="text-sm text-muted-foreground underline">Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}