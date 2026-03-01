import RestaurantCard from "./RestaurantCard";
import {useEffect, useState} from "react";
import Shimmer from "./Shimmer.js";
import { Link } from "react-router-dom";

const Body = () => {

    const [listOfRestaurants, setListOfRestaurants] = useState([]);
    const [filteredRestaurant, setFilteredRestaurant] = useState(listOfRestaurants);

    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const data = await fetch("https://www.swiggy.com/dapi/restaurants/list/v5?lat=12.9351929&lng=77.62448069999999&page_type=DESKTOP_WEB_LISTING");

        const json = await data.json();
        setListOfRestaurants(json?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants);
        setFilteredRestaurant(json?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants);
    } 

    return listOfRestaurants?.length === 0 ? (
        <Shimmer />
    ) : (
        <div className="body">
            <div className="filter">
                <div className="search">
                    <input 
                        type="text" 
                        className="search-box" 
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                    />
                    <button
                        onClick={() => {
                            // filter the restaurant card and update the UI
                            // searchText
                            const filteredRestaurant = listOfRestaurants.filter(
                                (res) => res?.info?.name.toLowerCase().includes(searchText.toLowerCase())
                            );
                            setFilteredRestaurant(filteredRestaurant);
                        }}
                    >Search</button>
                </div>

                <button 
                    className="filter-btn" 
                    onClick={ () => {
                       const filteredList = listOfRestaurants?.filter(
                            (res) => res?.info?.avgRating > 4.3
                       ); 
                       setListOfRestaurants(filteredList);
                    }}
                >
                    Top Rated Restaurants
                </button>
            </div>
            <div className="res-container">
                {
                    filteredRestaurant?.map((restaurant) => (
                        <Link 
                            key={restaurant.info.id}
                            to={"/restaurants/" + restaurant.info.id}
                        >
                            <RestaurantCard key={restaurant.info.id} resData={restaurant} />
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default Body;    