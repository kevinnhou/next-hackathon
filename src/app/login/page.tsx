import { login, signup } from "./actions";

export default function LoginPage() {
  return (
    <>
      <form className="mx-auto mt-12 flex w-1/2 flex-col gap-2">
        <h1 className="text-2xl font-bold">Login</h1>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded-md border-2 border-gray-300 p-2"
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="rounded-md border-2 border-gray-300 p-2"
        />
        <button
          formAction={login}
          className="cursor-pointer rounded-md bg-blue-500 p-2 text-white"
        >
          Log in
        </button>
        <button
          formAction={signup}
          className="cursor-pointer rounded-md bg-blue-500 p-2 text-white"
        >
          Sign up
        </button>
      </form>
    </>
  );
}
