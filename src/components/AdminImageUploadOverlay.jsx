import { useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Camera, Loader2 } from 'lucide-react';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_MB = 5;

/**
 * AdminImageUploadOverlay
 * Wraps any image container and shows an "Upload Image" button for admin users only.
 *
 * Props:
 *   entityName   — e.g. "Service", "Listing"
 *   recordId     — entity record id
 *   onUploaded   — callback(newUrl) called after successful upload + save
 *   children     — the existing image/content to wrap
 *   className    — extra classes on wrapper
 */
export default function AdminImageUploadOverlay({ entityName, recordId, onUploaded, children, className = '' }) {
  const { user } = useAuth();
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Non-admins: render children as-is
  if (!user || user.role !== 'admin') {
    return <div className={className}>{children}</div>;
  }

  const handleFile = async (file) => {
    setError('');
    if (!ACCEPTED.includes(file.type)) {
      setError('JPG, PNG or WEBP only');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Max ${MAX_MB}MB`);
      return;
    }
    setLoading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.entities[entityName].update(recordId, { main_image: file_url });
    onUploaded?.(file_url);
    setLoading(false);
  };

  return (
    <div className={`relative group ${className}`}>
      {children}

      {/* Upload overlay — visible on hover for admins */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 rounded-inherit">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="flex items-center gap-1.5 bg-white text-gray-900 px-3 py-2 rounded-xl text-xs font-bold shadow-lg hover:bg-gray-100 transition-colors disabled:opacity-60"
        >
          {loading
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <Camera className="w-3.5 h-3.5" />}
          {loading ? 'Uploading…' : 'Upload Image'}
        </button>
        {error && <p className="text-[10px] text-red-300 font-semibold">{error}</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
      />
    </div>
  );
}