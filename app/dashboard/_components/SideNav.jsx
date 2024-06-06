"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { db } from "@/configs";
import { JsonForms } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import {
  LibraryBig,
  LineChart,
  MessageSquare,
  Shield,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

function SideNav() {
  const menuList = [
    {
      id: 1,
      name: "My Form",
      icon: LibraryBig,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Responses",
      icon: MessageSquare,
      path: "/dashboard/responses",
    },
    {
      id: 3,
      name: "Analytics",
      icon: LineChart,
      path: "/dashboard/analytics",
    },
    {
      id: 4,
      name: "Upgrade",
      icon: Shield,
      path: "/dashboard/upgrade",
    },
  ];

  const { user } = useUser();
  const path = usePathname();
  const [formList, setFormList] = useState();
  const [PercFileCreated, setPercFileCreated] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    user && GetFormList();
  }, [user]);

  const GetFormList = async () => {
    const result = await db
      .select()
      .from(JsonForms)
      .where(eq(JsonForms.CreatedBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(JsonForms.id));

    setFormList(result);

    const perc = (result.length / 3) * 100;
    setPercFileCreated(perc);
  };

  return (
    <div>
      <Button
        className="p-2 fixed top-24 left-2 z-50 bg-primary border border-gray-300 rounded-full shadow-md hover:bg-gray-100 sm:hidden"
        onClick={() => setIsNavOpen(!isNavOpen)}
      >
        {isNavOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>
      {isNavOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsNavOpen(false)}
          ></div>
          <div className="h-screen shadow-sm border fixed top-0 left-16 w-64 bg-white z-50 transition-transform transform duration-300 ease-in-out">
            <div className="p-5">
              {menuList.map((menu) => (
                <Link
                  href={menu.path}
                  key={menu.id}
                  className={`flex items-center gap-3 p-4 mb-3 
                      hover:bg-primary hover:text-white rounded-lg
                      cursor-pointer text-gray-500
                      ${path == menu.path && "bg-primary text-white"}
                      `}
                >
                  <menu.icon />
                  {menu.name}
                </Link>
              ))}
            </div>
            <div className="fixed bottom-7 p-6 w-64">
              <Progress value={PercFileCreated} />
              <h2 className="text-sm mt-2 text-gray-600">
                <strong>{formList?.length} </strong>Out of <strong>3</strong>{" "}
                File Created
              </h2>
              <h2 className="text-sm mt-3 text-gray-600">
                Upgrade your plan for unlimited AI form build
              </h2>
            </div>
          </div>
        </>
      )}
      <div className="hidden md:block h-screen shadow-md border w-64 bg-white">
        <div className="p-5">
          {menuList.map((menu) => (
            <Link
              href={menu.path}
              key={menu.id}
              className={`flex items-center gap-3 p-4 mb-3 
                  hover:bg-primary hover:text-white rounded-lg
                  cursor-pointer text-gray-500
                  ${path == menu.path && "bg-primary text-white"}
                  `}
            >
              <menu.icon />
              {menu.name}
            </Link>
          ))}
        </div>
        <div className="fixed bottom-7 p-6 w-64">
          <Progress value={PercFileCreated} />
          <h2 className="text-sm mt-2 text-gray-600">
            <strong>{formList?.length} </strong>Out of <strong>3</strong> File
            Created
          </h2>
          <h2 className="text-sm mt-3 text-gray-600">
            Upgrade your plan for unlimited AI form build
          </h2>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
