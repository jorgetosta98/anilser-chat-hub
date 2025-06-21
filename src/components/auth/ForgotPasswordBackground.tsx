
interface ForgotPasswordBackgroundProps {
  title: string;
  description: string;
}

export function ForgotPasswordBackground({ title, description }: ForgotPasswordBackgroundProps) {
  return (
    <div 
      className="hidden lg:block lg:flex-1 bg-cover bg-center relative"
      style={{
        backgroundImage: `linear-gradient(rgba(13, 148, 136, 0.7), rgba(13, 148, 136, 0.7)), url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3')`
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg opacity-90">{description}</p>
        </div>
      </div>
    </div>
  );
}
