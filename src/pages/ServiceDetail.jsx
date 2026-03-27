import { useState } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Star, ShieldCheck, MapPin, Phone, Globe, AlertTriangle } from 'lucide-react';
import ScamGauge from '../components/ScamGauge';
import SafeNextStep from '../components/SafeNextStep';

export default function ServiceDetail() {
  const { serviceId } = useParams();
  const { lang } = useOutletContext();

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: async () => {
      const results = await base44.entities.Service.filter({ id: serviceId });
      return results[0];
    },
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', serviceId],
    queryFn: () => base44.entities.Review.filter({ service_id: serviceId }, '-created_date', 20),
    enabled: !!serviceId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-muted-foreground">Service not found</p>
        <Link to="/services" className="text-accent font-bold text-sm mt-2 inline-block">Back to Services</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header Image */}
      <div className="relative h-64">
        {service.photos?.[0] ? (
          <img src={service.photos[0]} alt={service.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-secondary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <Link to="/services" className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
        </div>
        {service.is_verified && (
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-success text-success-foreground px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-bold">VERIFIED</span>
          </div>
        )}
      </div>

      <div className="px-4 py-6 max-w-3xl mx-auto space-y-6">
        {/* Info */}
        <div>
          <h1 className="text-2xl font-black tracking-tight">{service.name}</h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded-full capitalize">
              {service.category?.replace('_', ' ')}
            </span>
            <span className="text-xs text-muted-foreground capitalize">{service.city?.replace('-', ' ')}</span>
            {service.avg_rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                <span className="text-sm font-bold">{service.avg_rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="flex gap-3">
          {service.phone && (
            <a href={`tel:${service.phone}`} className="flex-1 flex items-center justify-center gap-2 bg-accent text-accent-foreground py-3 rounded-xl font-bold text-sm min-h-[48px]">
              <Phone className="w-4 h-4" />
              Call
            </a>
          )}
          {service.website && (
            <a href={service.website} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-card border border-border py-3 rounded-xl font-bold text-sm min-h-[48px]">
              <Globe className="w-4 h-4" />
              Website
            </a>
          )}
        </div>

        {/* Description */}
        {service.description && (
          <div className="bg-card rounded-2xl border border-border/50 p-5">
            <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
          </div>
        )}

        {/* Address */}
        {service.address && (
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <span className="text-sm text-muted-foreground">{service.address}</span>
          </div>
        )}

        {/* Scam Score */}
        {service.scam_score > 0 && (
          <div className="bg-card rounded-2xl border border-border/50 p-5 flex flex-col items-center">
            <h3 className="font-bold text-sm mb-3">Scam Probability</h3>
            <ScamGauge score={service.scam_score} />
          </div>
        )}

        {/* Reviews */}
        <div>
          <h2 className="text-lg font-extrabold mb-3">Reviews ({reviews.length})</h2>
          {reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.map(review => (
                <div key={review.id} className="bg-card rounded-2xl border border-border/50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-accent fill-accent' : 'text-border'}`} />
                      ))}
                    </div>
                    {review.author_country && (
                      <span className="text-[10px] text-muted-foreground">from {review.author_country}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No reviews yet</p>
          )}
        </div>

        <SafeNextStep
          title="Check Fair Prices"
          description="Make sure you're paying the right amount"
          to="/price-checker"
        />
      </div>
    </div>
  );
}