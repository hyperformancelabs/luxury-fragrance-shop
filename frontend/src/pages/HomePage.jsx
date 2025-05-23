import React from 'react'
import Banner from '../components/Banner'
import FlashDeal from '../components/FlashDeal'
import Brand from '../components/Brand'
import NewProduct from '../components/NewProduct'
import BestSellingProduct from '../components/BestSellingProduct'
import TopSearchInWeek from '../components/TopSearchInWeek'
import CollectionSeason from '../components/CollectionSeason'
import AboutUs from '../components/AboutUs'
import Blog from '../components/Blog'

const HomePage = () => {
  return (
    <div>
     <Banner />
     <FlashDeal />
     <Brand />
     <NewProduct />
     <BestSellingProduct />
     {/* <TopSearchInWeek /> */}
     <CollectionSeason />
     <AboutUs />
     <Blog />
    </div>
  )
}

export default HomePage
