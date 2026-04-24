/**
 * EditableImage — Drop-in <img> replacement that shows a pencil overlay for admins.
 * For entity-backed images: pass entityName + recordId + fieldName to persist to DB.
 * For static/hero images: omit those props — the new image only updates local state.
 *
 * Props:
 *   src           — current image URL
 *   alt           — alt text
 *   className     — classes for the <img>
 *   entityName    — (optional) e.g. "Service"
 *   recordId      — (optional) entity record id
 *   fieldName     — (optional) field to update, default "main_image"
 *   onUploaded    — (optional) callback(newUrl)
 *   ...rest       — any other img props
 */
import { useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Pencil, Loader2 } from 'lucide-react';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_MB = 5;

export default function EditableImage({
  src: initialSrc,
  alt = '',
  className = '',
  entityName,
  recordId,
  fieldName = 'main_image',
  onUploaded,
  ...rest
}) {
  const { user } = useAuth();
  const inputRef = useRef(null);
  const [src, setSrc] = useState(initialSrc);
  const [loading, setLoading] = useState(false);
  const isAdmin = user?.role === 'admin';

  const handleFile = async (file) => {
    if (!ACCEPTED.includes(file.type) || file.size > MAX_MB * 1024 * 1024) return;
    setLoading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setSrc(file_url);
      if (entityName && recordId) {
        await base44.entities[entityName].update(recordId, { [fieldName]: file_url });
      }
      onUploaded?.(file_url);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return <img src={src} alt={alt} className={className} {...rest} />;
  }

  return (
    <div className="relative w-full h-full">
      <img src={src} alt={alt} className={className} {...rest} />

      {/* Pencil button — bottom right corner */}
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); inputRef.current?.click(); }}
        disabled={loading}
        className="absolute bottom-2 right-2 z-30 w-8 h-8 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center shadow-lg transition-colors disabled:opacity-50"
        title="Replace image"
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
    </div>
  );
}