// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./LoginPage2.css";

// export default function LoginPage2() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setIsLoading(true);

//     try {
//       const response = await axios.post("http://localhost:3000/auth/login", {
//         email,
//         password,
//       });

//       const { token, id, role, email: userEmail } = response.data;

//       if (!token || !id) {
//         setError("Connexion échouée : données manquantes.");
//         setIsLoading(false);
//         return;
//       }

//       // نحفظ البيانات
//       localStorage.setItem("token", token);
//       localStorage.setItem("role", role);
//       localStorage.setItem("id", id);
//       localStorage.setItem("email", userEmail);

//       // توجيه حسب الدور
//       switch (role) {
//         case "admin":
//           navigate("/admin/dashboard");
//           break;
//         case "jury":
//           navigate("/jury/dashboard");
//           break;
//         default:
//           navigate("/");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Email ou mot de passe incorrect.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="login2-container">
//       {/* النصف الأيسر : الفورم */}
//       <div className="login2-left">
//         <div className="login2-content">
//           <h2 className="logo">🌱 SmartFalleh</h2>
//           <h1 className="title">Connextion</h1>

//           <form className="login2-form" onSubmit={handleSubmit}>
//             <input
//               type="email"
//               placeholder="admin@gmail.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />

//             <input
//               type="password"
//               placeholder="********"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />

//             {error && <p className="login2-error">{error}</p>}

//             <button type="submit" disabled={isLoading}>
//               {isLoading ? "Connexion en cours..." : "Se connecter"}
//             </button>

//            <p className="forgot-password">
//   Mot de passe oublié ? <a href="/forgot-password">Réinitialisez-le</a>
// </p>


//           </form>
//         </div>
//       </div>

//       {/* النصف الأيمن : الصورة */}
//       <div className="login2-right">
        
//         <div className="overlay"></div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage2.css";

export default function LoginPage2() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      const { token, id, role, email: userEmail } = response.data;

      if (!token || !id) {
        setError("Connexion échouée : données manquantes.");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("id", id);
      localStorage.setItem("email", userEmail);

      switch (role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "jury":
          navigate("/jury/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Email ou mot de passe incorrect.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login2-wrapper">
      <div className="login2-container">
        <div className="login2-left">
          <div className="login2-content">
            <h2 className="logo">🌱 SmartFalleh</h2>
            <h1 className="title">Connexion</h1>

            <form className="login2-formA" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && <p className="login2-error">{error}</p>}

              <button type="submit" disabled={isLoading}>
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </button>

              <p className="forgot-password">
                Mot de passe oublié ?{" "}
                <a href="/forgot-password">Réinitialisez-le</a>
              </p>
            </form>
          </div>
        </div>

        <div className="login2-right">
          <div className="image-frame"></div>
        </div>
      </div>
    </div>
  );
}
