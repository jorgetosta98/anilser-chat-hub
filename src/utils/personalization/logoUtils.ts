
import { supabase } from '@/integrations/supabase/client';

export const uploadLogoFile = async (file: File, userId: string): Promise<string | null> => {
  try {
    console.log('Iniciando upload do logo...', { fileName: file.name, fileSize: file.size });
    
    // Create unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `logo-${userId}-${Date.now()}.${fileExt}`;
    
    console.log('Nome do arquivo gerado:', fileName);
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('user-logos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Erro no upload do Supabase:', error);
      return null;
    }

    console.log('Upload realizado com sucesso:', data);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('user-logos')
      .getPublicUrl(fileName);

    console.log('URL pública gerada:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Erro geral no upload:', error);
    return null;
  }
};
