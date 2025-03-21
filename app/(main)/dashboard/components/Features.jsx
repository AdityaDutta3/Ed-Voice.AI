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
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-medium text-gray-500">My Workspace</h2>
          <h2 className="font-bold text-2xl">
            Welcome back,{user?.displayName}{" "}
          </h2>
        </div>
        <Button>Profile</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-5 mt-10">
        {CoachingOptions.map((options, index) => (
          <BlurFade key={options.icon} delay={0.25 + index * 0.05} inView>
            <UserInputDialog coachingOptions={options}>
              <div
                key={index}
                className="p-3 bg-secondary rounded-3xl flex justify-center items-center"
              >
                <Image
                  src={options.icon}
                  alt={options.name}
                  width={150}
                  height={150}
                  className="h-[70px] w-[70px] hover:rotate-12 cursor-pointer mr-2 transition-all"
                />
                <h2 className="mt-2 ">{options.name}</h2>
              </div>
            </UserInputDialog>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}

export default Features;
