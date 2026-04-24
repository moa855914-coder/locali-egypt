import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_MB = 5;

export default function HomeCityCard({ city }) {
  const { user } = useAuth();
  const [img, setImg] = useState(city.img);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const isAdmin = user?.role === 'admin';

  const handleFile = async (file) => {
    if (!ACCEPTED.includes(file.type) || file.size > MAX_MB * 1024 * 1024) return;
    setLoading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setImg(file_url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shrink-0 relative w-28 h-36 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/city/${city.id}`} className="absolute inset-0 z-0">
        <img
          src={img}
          alt={city.label}
          className="w-full h-full object-cover"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=400'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-2.5 text-center">
          <span className="text-lg block">{city.emoji}</span>
          <p className="text-white font-black text-xs">{city.label}</p>
        </div>
      </Link>

      {isAdmin && (
        <>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); inputRef.current?.click(); }}
            disabled={loading}
            className="absolute top-2 right-2 z-20 w-8 h-8 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center shadow-lg transition-colors disabled:opacity-50"
            title="Change city photo"
          >
            {loading
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Pencil className="w-3.5 h-3.5" />}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(',')}
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
          />
        </>
      )}
    </div>
  );
}