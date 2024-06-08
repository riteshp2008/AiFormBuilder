"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

function Hero() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  return (
    <div>
      <section className="bg-gray-50">
        <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
          <div className="mx-auto max-w-xl text-center">
            <h1 className="text-3xl font-extrabold sm:text-5xl">
              Create your Form
              <strong className="font-extrabold text-blue-600 sm:block">
                {" "}
                In Seconds Not in Hours{" "}
              </strong>
            </h1>

            <p className="mt-4 sm:text-xl/relaxed">
              Create your AI form in seconds. Just fill out the form and we will
              create the form for you. You can use the form to collect data from
              your users.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                className="block w-full rounded bg-blue-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-black focus:outline-none focus:ring active:bg-blue-950 sm:w-auto"
                onClick={() => {
                  if (isSignedIn) {
                    router.push("/dashboard/");
                  } else {
                    router.push("/sign-in");
                  }
                }}
              >
                + Create AI Form
              </button>

              <a
                className="block w-full rounded px-12 py-3 text-sm font-medium text-blue-600 shadow hover:text-black focus:outline-none focus:ring active:text-blue-950 sm:w-auto"
                href="#"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hero;
