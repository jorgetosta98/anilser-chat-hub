
import { Link } from "react-router-dom";

export function LoginFooter() {
  return (
    <div className="text-center text-sm text-gray-600">
      Não tem uma conta?{" "}
      <Link to="/register" className="text-teal-600 hover:underline">
        Cadastre-se aqui.
      </Link>
    </div>
  );
}
