/**
 * BookingButtons — 3 verified booking sources for every tour/activity.
 * Props:
 *   activity: string — activity/tour name (e.g. "Hot Air Balloon")
 *   city: string     — city name (e.g. "Luxor")
 *   musementCity: string (optional) — slug used in musement URL (e.g. "luxor")
 */
export default function BookingButtons({ activity, city, musementCity }) {
  const act = encodeURIComponent(activity);
  const cty = encodeURIComponent(city);
  const slug = musementCity || city.toLowerCase().replace(/\s+/g, '-');

  const viatorUrl    = `https://www.viator.com/search/${activity.replace(/\s+/g, '+')}+${city.replace(/\s+/g, '+')}+Egypt`;
  const gygUrl       = `https://www.getyourguide.com/s/?q=${act}+${cty}+Egypt`;
  const musementUrl  = `https://www.musement.com/us/egypt/${slug}/`;

  const open = (url) => window.open(url, '_blank');

  return (
    <div className="flex flex-col gap-2 w-full">
      <button
        onClick={() => open(viatorUrl)}
        className="w-full flex items-center justify-center gap-2 bg-[#29C766] text-white py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
      >
        Book on Viator →
      </button>
      <button
        onClick={() => open(gygUrl)}
        className="w-full flex items-center justify-center gap-2 bg-[#FF5533] text-white py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
      >
        Book on GetYourGuide →
      </button>
      <button
        onClick={() => open(musementUrl)}
        className="w-full flex items-center justify-center gap-2 bg-[#5B2D8E] text-white py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
      >
        Book on Musement →
      </button>
    </div>
  );
}