
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatsAppQRCodeProps {
  qrCode: string;
  countdown: number;
  onClose: () => void;
}

export function WhatsAppQRCode({ qrCode, countdown, onClose }: WhatsAppQRCodeProps) {
  console.log('WhatsAppQRCode render - qrCode:', qrCode ? 'presente' : 'vazio');
  console.log('WhatsAppQRCode render - qrCode length:', qrCode.length);
  console.log('WhatsAppQRCode render - countdown:', countdown);

  if (!qrCode) {
    console.log('QR Code vazio, não renderizando modal');
    return null;
  }

  console.log('Renderizando modal do QR Code');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Conectar WhatsApp</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-center">
          <div className="mb-4">
            <img 
              src={qrCode} 
              alt="QR Code WhatsApp"
              className="mx-auto max-w-full h-auto rounded-lg border"
              onLoad={() => console.log('Imagem QR Code carregada com sucesso')}
              onError={(e) => console.error('Erro ao carregar imagem QR Code:', e)}
            />
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Abra o WhatsApp no seu celular, vá em <strong>Dispositivos conectados</strong> e escaneie este código
          </p>
          
          {countdown > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-primary">
                Verificando conexão em {countdown} segundos...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((30 - countdown) / 30) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <Button onClick={onClose} className="w-full">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
