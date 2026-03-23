import axios from "axios";

export const getCoordinates = async (location, country) => {
    let address = `${location}, ${country}`;
    let url = "https://nominatim.openstreetmap.org/search";

    let response = await axios.get(url, {
        params: {
            format: "json",
            q: address,
        },
        headers: {
            "User-Agent": "airbnb-app"
        }
    });
    // console.log(response.data);
    let data = response.data;
    // return response.data
    if (response.data.length > 0) {
        return {
            lat: data[0].lat,
            lng: data[0].lon,
        };
    }

    return null;
};