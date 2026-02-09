import { useEffect, useState } from 'react';
import { FileCheck, Upload, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
// Button removed - not used currently
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface DocRow {
  id: string;
  document_type: string;
  document_url: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

const VetDocuments = () => {
  const { user } = useAuth();
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase.from('vet_documents').select('*').eq('user_id', user.id);
      setDocs((data as DocRow[]) || []);
      setIsLoading(false);
    };
    load();
  }, [user]);

  const uploadDoc = async (type: 'license' | 'degree', file: File) => {
    if (!user) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('File must be under 5MB'); return; }

    setUploading(type);
    const path = `${user.id}/${type}-${Date.now()}.${file.name.split('.').pop()}`;
    const { error: uploadError } = await supabase.storage.from('vet-documents').upload(path, file);
    if (uploadError) { toast.error('Upload failed'); setUploading(null); return; }

    const { data: urlData } = supabase.storage.from('vet-documents').getPublicUrl(path);

    const { error } = await supabase.from('vet_documents').insert({
      user_id: user.id,
      document_type: type,
      document_url: urlData.publicUrl,
    });

    if (error) { toast.error('Failed to save document'); setUploading(null); return; }

    toast.success(`${type === 'license' ? 'License' : 'Degree'} uploaded for verification`);
    const { data } = await supabase.from('vet_documents').select('*').eq('user_id', user.id);
    setDocs((data as DocRow[]) || []);
    setUploading(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected': return <AlertCircle className="h-5 w-5 text-destructive" />;
      default: return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  const hasLicense = docs.some(d => d.document_type === 'license');
  const hasDegree = docs.some(d => d.document_type === 'degree');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Document Verification</h1>
        <p className="text-muted-foreground">Upload your veterinary credentials for admin review</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
        {/* License Upload */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <FileCheck className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Veterinary License</h3>
          </div>
          {hasLicense ? (
            <div className="space-y-3">
              {docs.filter(d => d.document_type === 'license').map(d => (
                <div key={d.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(d.status)}
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusBadge(d.status)}`}>{d.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <Label className="cursor-pointer">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload license</p>
                  <p className="text-xs text-muted-foreground">PDF, JPG, PNG (max 5MB)</p>
                </div>
                <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => e.target.files?.[0] && uploadDoc('license', e.target.files[0])}
                  disabled={uploading === 'license'}
                />
              </Label>
              {uploading === 'license' && <div className="flex items-center gap-2 mt-2 text-sm text-primary"><Loader2 className="h-4 w-4 animate-spin" />Uploading...</div>}
            </div>
          )}
        </div>

        {/* Degree Upload */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <FileCheck className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Veterinary Degree</h3>
          </div>
          {hasDegree ? (
            <div className="space-y-3">
              {docs.filter(d => d.document_type === 'degree').map(d => (
                <div key={d.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(d.status)}
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusBadge(d.status)}`}>{d.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <Label className="cursor-pointer">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload degree</p>
                  <p className="text-xs text-muted-foreground">PDF, JPG, PNG (max 5MB)</p>
                </div>
                <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => e.target.files?.[0] && uploadDoc('degree', e.target.files[0])}
                  disabled={uploading === 'degree'}
                />
              </Label>
              {uploading === 'degree' && <div className="flex items-center gap-2 mt-2 text-sm text-primary"><Loader2 className="h-4 w-4 animate-spin" />Uploading...</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VetDocuments;
