import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Star, Send } from 'lucide-react';

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="p-1"
        >
          <Star className={`w-6 h-6 transition-colors ${star <= (hover || value) ? 'text-accent fill-accent' : 'text-border'}`} />
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ entityId, city }) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [country, setCountry] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', entityId],
    queryFn: () => base44.entities.Review.filter({ service_id: entityId }, '-created_date', 50),
    enabled: !!entityId,
  });

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return;
    setSubmitting(true);
    await base44.entities.Review.create({
      service_id: entityId,
      rating,
      comment: comment.trim(),
      city: city || undefined,
      author_country: country.trim() || undefined,
    });
    setSubmitting(false);
    setSubmitted(true);
    setRating(0);
    setComment('');
    setCountry('');
    queryClient.invalidateQueries({ queryKey: ['reviews', entityId] });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div>
      {/* Avg rating summary */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-3 mb-4 bg-card rounded-2xl border border-border/50 p-4">
          <div className="text-center">
            <p className="text-3xl font-black text-accent">{avgRating}</p>
            <div className="flex gap-0.5 justify-center mt-1">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={`w-3 h-3 ${s <= Math.round(Number(avgRating)) ? 'text-accent fill-accent' : 'text-border'}`} />
              ))}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{reviews.length}</span> {reviews.length === 1 ? 'review' : 'reviews'}
          </div>
        </div>
      )}

      {/* Review list */}
      <h3 className="text-base font-extrabold mb-3">Reviews ({reviews.length})</h3>
      {reviews.length > 0 ? (
        <div className="space-y-3 mb-6">
          {reviews.map(review => (
            <div key={review.id} className="bg-card rounded-2xl border border-border/50 p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-accent fill-accent' : 'text-border'}`} />
                  ))}
                </div>
                {review.author_country && (
                  <span className="text-[10px] text-muted-foreground">from {review.author_country}</span>
                )}
                <span className="text-[10px] text-muted-foreground ml-auto">
                  {new Date(review.created_date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-6">No reviews yet — be the first!</p>
      )}

      {/* Submit form */}
      <div className="bg-card rounded-2xl border border-border/50 p-5">
        <h4 className="font-bold text-sm mb-4">Leave a Review</h4>
        {submitted ? (
          <p className="text-sm text-success font-bold">✓ Review submitted! Thank you.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <p className="text-xs font-bold mb-2 text-muted-foreground">Your Rating *</p>
              <StarPicker value={rating} onChange={setRating} />
            </div>
            <div>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share your experience..."
                rows={3}
                className="w-full bg-secondary rounded-xl px-4 py-3 text-sm resize-none outline-none focus:ring-2 focus:ring-accent border border-border"
                required
              />
            </div>
            <div>
              <input
                value={country}
                onChange={e => setCountry(e.target.value)}
                placeholder="Your country (optional)"
                className="w-full bg-secondary rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent border border-border"
              />
            </div>
            <button
              type="submit"
              disabled={!rating || !comment.trim() || submitting}
              className="flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50 transition-opacity"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}