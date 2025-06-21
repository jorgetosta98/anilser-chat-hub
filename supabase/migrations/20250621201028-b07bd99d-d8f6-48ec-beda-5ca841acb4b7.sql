
-- Adicionar campo company na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS company TEXT;

-- Atualizar a função handle_new_user para incluir company do metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, phone, company, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'company', ''),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'client')
    );
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log o erro mas não bloqueie o cadastro
        RAISE WARNING 'Erro ao criar perfil do usuário: %', SQLERRM;
        RETURN NEW;
END;
$$;
