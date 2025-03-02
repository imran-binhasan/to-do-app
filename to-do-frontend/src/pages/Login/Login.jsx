
import { useForm } from "react-hook-form";
import axios from "axios";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  

  
  const onSubmit = async (data) => {
    try {
      const response = await axios.post("https://to-do-backend-liard.vercel.app/api/auth/login", {
        email: data.email,
        password: data.password,
      });
      console.log("Login email code sent", response.data);
      toast.success(response?.data.message || "Check your email for the code");
      
      // After login, redirect to the mail verification page
      navigate("/verify-mail", { state: { email: data.email } });
    } catch (error) {
      console.error("Login error:", error.response?.data || error);
      toast.error(error.response?.data.message || "Please try again later");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="p-8 rounded shadow">
        <h4 className="text-2xl font-medium text-center mb-4">Login</h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-4"
        >
          {/* Email Field */}
          <div>
            <label htmlFor="email">Email:</label>
            <Input
              className="w-full md:w-[400px] lg:w-[450px]"
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password">Password:</label>
            <Input
              className="w-full md:w-[400px] lg:w-[450px]"
              id="password"
              type="password"
              autoComplete="true"
              placeholder="Enter a secure password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && <p className="error">{errors.password.message}</p>}
          </div>
          
          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
