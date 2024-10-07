import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Acowale SaaS Test
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Sign up or log in to manage your products efficiently.
        </p>

        <div className="flex flex-col space-y-4">
          <Link href="/auth/signup">
            <div className="block w-full text-center py-2 px-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition">
              Sign Up
            </div>
          </Link>

          <Link href="/auth/signin">
            <div className="block w-full text-center py-2 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition">
              Log In
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
