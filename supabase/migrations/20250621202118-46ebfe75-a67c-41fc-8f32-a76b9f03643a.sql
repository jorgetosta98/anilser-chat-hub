
-- Primeiro, vamos remover o trigger antigo se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Remover a função antiga se existir
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Criar uma nova função mais robusta para criar perfis
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, phone, company, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Usuário'),
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
        -- Tentar inserir com dados mínimos
        INSERT INTO public.profiles (id, full_name, email, role)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Usuário'),
            NEW.email,
            'client'
        ) ON CONFLICT (id) DO NOTHING;
        RETURN NEW;
END;
$$;

-- Recriar o trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verificar se existem usuários sem perfil e criar perfis para eles
INSERT INTO public.profiles (id, full_name, email, role)
SELECT 
    au.id,
    COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', 'Usuário'),
    au.email,
    'client'
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
