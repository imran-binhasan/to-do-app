import { useForm } from "react-hook-form";
import axios from "axios";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const password = watch("password", "");

  const onSubmit = async (data) => {
    try {
      // Temporarily store email and password in localStorage
      localStorage.setItem("email", data.email);
      localStorage.setItem("password", data.password);

      const response = await axios.post("https://to-do-backend-liard.vercel.app/api/auth/register", {
        email: data.email,
        password: data.password,
      });
      console.log(response.data);

      toast.success("Registration successful! Please verify your email.");
      navigate("/verify-mail", { state: { email: data.email } });
    } catch (error) {
      toast.error(error.response?.data.message || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="p-8 rounded shadow">
        <h4 className="text-2xl font-medium text-center mb-4">Register</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-4">
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

          <div>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <Input
              className="w-full md:w-[400px] lg:w-[450px]"
              id="confirmPassword"
              type="password"
              autoComplete="true"
              placeholder="Re-enter your password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
