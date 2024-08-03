import HomeAB from "./HomeAB";
import HomeAdmin from "./HomeAdmin";
import HomeCommunity from "./HomeCommunity";
import HomeMainImg from "./HomeMainImg";

export default function Home() {

   return(
      <div>
         <HomeMainImg />
         <HomeCommunity />
         <HomeAB />
         <HomeAdmin />
      </div>
   );
}