import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhotoUploadProps {
  photoUrls: string[];
  onPhotosChange: (urls: string[]) => void;
  uploading: boolean;
  onUploadingChange: (uploading: boolean) => void;
}

export const PhotoUpload = ({ photoUrls, onPhotosChange, uploading, onUploadingChange }: PhotoUploadProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    onUploadingChange(true);
    try {
      const newUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          // Create a local URL for the image (in a real app, you'd upload to a server)
          const url = URL.createObjectURL(file);
          newUrls.push(url);
        }
      }
      
      onPhotosChange([...photoUrls, ...newUrls]);
      toast({
        title: "Photos uploaded",
        description: `Successfully uploaded ${newUrls.length} photo(s).`,
      });
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload photos. Please try again.",
      });
    } finally {
      onUploadingChange(false);
    }
  };

  const removePhoto = (indexToRemove: number) => {
    const newUrls = photoUrls.filter((_, index) => index !== indexToRemove);
    onPhotosChange(newUrls);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => cameraInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2"
        >
          <Camera className="h-4 w-4" />
          Take Photo
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload Files
        </Button>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        onChange={(e) => handleFileUpload(e.target.files)}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFileUpload(e.target.files)}
        className="hidden"
      />

      {/* Photo preview */}
      {photoUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {photoUrls.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg border bg-muted overflow-hidden">
                <img
                  src={url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removePhoto(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
          Uploading photos...
        </div>
      )}
    </div>
  );
};