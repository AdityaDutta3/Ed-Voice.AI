"use client";
import { Button } from "@/components/ui/button";
import { CoachingOptions } from "@/services/options";
import { useUser } from "@stackframe/stack";
import React from "react";
import Image from "next/image";
import { BlurFade } from "@/components/magicui/blur-fade";
import UserInputDialog from "./UserInputDialog";

function Features() {
  const user = useUser();

  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-medium text-gray-500 dark:text-gray-400">My Workspace</h2>
          <h2 className="font-bold text-2xl dark:text-white">
            Welcome back, {user?.displayName}{" "}
          </h2>
        </div>
        <Button className="bg-primary hover:bg-primary-dark text-white dark:bg-primary-dark dark:hover:bg-primary">
          Profile
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-10">
        {CoachingOptions.map((options, index) => (
          <BlurFade key={options.icon} delay={0.25 + index * 0.05} inView>
            <UserInputDialog coachingOptions={options}>
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md flex flex-col items-center justify-center hover:scale-105 transition-transform"
              >
                <Image
                  src={options.icon}
                  alt={options.name}
                  width={150}
                  height={150}
                  className="h-[70px] w-[70px] hover:rotate-12 cursor-pointer mb-4 transition-all"
                />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{options.name}</h2>
              </div>
            </UserInputDialog>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}

export default Features;