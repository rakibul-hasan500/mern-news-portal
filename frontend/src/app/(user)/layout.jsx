import "../globals.css";
import "../../css/font.css"
import "../../css/index.css"
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ReduxWrapper from "@/wrappers/ReduxWrapper";
import {baseUrl} from "@/utils/baseUrl";


// Call Get Settings Data API For Meta Data
async function getSiteSettings(){
    try{
        const res = await fetch(`${baseUrl}/api/settings`, {cache: "no-cache"})
        if(!res.ok) return null;
        return res.json()
    }catch(error){
        return console.error(error)
    }
}

// Apply Meta Data
export async function generateMetadata(){
    // Get Meta Data
    const data = await getSiteSettings();

    return{
        title: `${data?.data?.appName} - ${data?.data?.title}`,
        description: data?.data?.description,
        keywords: data?.data?.keywords,
        icons: {
            icon: [
                {url: data?.data?.siteIcon?.url},
                {url: data?.data?.siteIcon?.url, rel: "shortcut icon"},
            ],
            apple: [
                {url: data?.data?.siteIcon?.url},
            ],
        }
    }
}


export default function RootLayout({children,}) {
  return (
      <ReduxWrapper>
          <html lang="en">
              <body className="relative base-container">
                  <Header />
                  {children}
                  <Footer/>
              </body>
          </html>
      </ReduxWrapper>
  );
}
