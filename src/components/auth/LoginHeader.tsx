
export function LoginHeader() {
  return (
    <>
      {/* Logo */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center mb-4">
          <img 
            src="/lovable-uploads/f742fb87-1258-499b-8a89-f5697f8bb611.png" 
            alt="ZapBase Logo" 
            className="h-12 w-auto"
          />
        </div>
      </div>

      {/* Welcome */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Boas vindas!</h2>
        <p className="text-gray-600 mb-4">Insira seus dados de acesso:</p>
        <p className="text-teal-600 font-medium mb-8">Transforme suas conversas em conhecimento</p>
      </div>
    </>
  );
}
