"use client"
import { Button } from "@/components/ui/button";
import { UserButton } from "@stackframe/stack";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Header with Get Started Button */}
      <header className="w-full max-w-4xl mx-auto mb-12 bg-red-50 shadow-md rounded-lg p-4">
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <section className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-black">
            Welcome to Ed-Voice.AI
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 mt-4">
            Empower your career with mock interview tests and personalized learning.
          </p>
        </section>

        <section className="mb-12">
          <img
            src="/interview.webp"
            alt="Learning and Interviewing"
            className="w-3/4 rounded-xl shadow-2xl mx-auto mb-8"
            style={{ objectFit: "cover" }}
          />

          <div className="flex justify-center">
            <Button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700" onClick={()=>{router.push('/dashboard')}}>
              Start Your Journey
            </Button>
          </div>
        </section>

        <section className="text-center mt-8">
          <UserButton />
        </section>
      </main>
    </div>
  );
}