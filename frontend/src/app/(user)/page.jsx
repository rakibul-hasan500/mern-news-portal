import Hero from "@/components/home/Hero";
import SideBarOne from "@/components/sideBar/SideBarOne";
import NewsSectionOne from "@/components/home/NewsSectionOne";
import NewsSectionTwo from "@/components/home/NewsSectionTwo";
import NewsSectionThree from "@/components/home/NewsSectionThree";
import NewsSectionFour from "@/components/home/NewsSectionFour";
import NewsSectionFive from "@/components/home/NewsSectionFive";
import NewsSectionSix from "@/components/home/NewsSectionSix";
import NewsSectionSeven from "@/components/home/NewsSectionSeven";
import NewsSectionEight from "@/components/home/NewsSectionEight";
import SideBarTwo from "@/components/sideBar/SideBarTwo";

export default function Home() {
    return (
      <main className="bg-white px-4 lg:px-12">
          <Hero/>

          {/*  Sections & Sidebar  */}
          <div className="flex flex-col lg:flex-row justify-between py-6 gap-12">
              {/*  Sections  */}
              <div className="flex-1">
                  {/*  News Section 1  */}
                  <NewsSectionOne/>

                  {/*  News Section 2  */}
                  <NewsSectionTwo/>

                  {/*  News Section 3  */}
                  <NewsSectionThree/>
              </div>

              {/*  Sidebar  */}
              <div className="w-full lg:w-[324px]">
                  <SideBarOne/>
              </div>
          </div>

          {/*  News Section 4  */}
          <NewsSectionFour/>

          {/*  Sections & Sidebar  */}
          <div className="flex flex-col lg:flex-row justify-between py-6 gap-12">
              {/*  News Section 5  */}
              <div className="flex-1">
                  <NewsSectionFive/>
              </div>

              {/*  News Section 6  */}
              <div className="w-full lg:w-[324px] lg:min-w-[324px]">
                  <NewsSectionSix/>
              </div>
          </div>

          {/*  News Section 7  */}
          <NewsSectionSeven/>

          {/*  Sections & Sidebar  */}
          <div className="flex flex-col lg:flex-row justify-between pt-6 pb-12 gap-12">
              {/*  Sections  */}
              <div className="flex-1">
                  {/*  News Section 8  */}
                  <NewsSectionEight/>
              </div>

              {/*  Sidebar  */}
              <div className="w-full lg:max-w-[324px] lg:w-[324px]">
                  <SideBarTwo/>
              </div>
          </div>
      </main>
  );
}
